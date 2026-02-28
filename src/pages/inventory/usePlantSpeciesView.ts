/* ═══════════════════════════════════════════════════════════════════════════
 * usePlantSpeciesView — All state + logic for the Plant Species page.
 *
 * Connects to Laravel backend via React Query.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Stat } from "@/components/shared/QuickStats";
import type { ViewMode } from "@/components/shared/ViewToggle";
import {
  useCreatePlantSpecies,
  useDeletePlantSpecies,
  usePlantSpeciesList,
  useUpdatePlantSpecies,
} from "@/hooks/usePlantSpeciesQuery";
import type { ApiError } from "@/lib/api-client";
import {
  collectErrors,
  type FieldErrors,
  isValid,
  maxLength,
  required,
  sanitizeForm,
  throttleSubmit,
  validate,
  validUrl,
} from "@/lib/validation";
import type { PlantSpecies } from "@/types/inventory";
import type { LucideIcon } from "lucide-react";
import { Bean, Citrus, Flower2, Leaf, Wheat } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────

// Use PlantSpecies from types
export type SpeciesItem = PlantSpecies & {
  icon: LucideIcon;
  color: string;
};

export interface SpeciesForm {
  commonName: string;
  khmerName: string;
  scientificName: string;
  family: string;
  growthType: string;
  nativeRegion: string;
  propagationMethod: string;
  description: string;
  imageUrl: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

export const FAMILY_ICONS: Record<string, { icon: LucideIcon; color: string }> =
  {
    Solanaceae: { icon: Citrus, color: "hsl(0, 72%, 51%)" },
    Brassicaceae: { icon: Flower2, color: "hsl(145, 63%, 32%)" },
    Poaceae: { icon: Wheat, color: "hsl(38, 92%, 50%)" },
    Fabaceae: { icon: Bean, color: "hsl(210, 20%, 50%)" },
    Other: { icon: Leaf, color: "hsl(175, 65%, 35%)" },
  };

const EMPTY_FORM: SpeciesForm = {
  commonName: "",
  khmerName: "",
  scientificName: "",
  family: "",
  growthType: "annual",
  nativeRegion: "",
  propagationMethod: "",
  description: "",
  imageUrl: "",
};

// Helper: enrich PlantSpecies with UI icon/color
function toSpeciesItem(species: PlantSpecies): SpeciesItem {
  return {
    ...species,
    icon: FAMILY_ICONS[species.family || "Other"]?.icon || Leaf,
    color:
      FAMILY_ICONS[species.family || "Other"]?.color || "hsl(175, 65%, 35%)",
  };
}

// ─── Backend Error Field Map ────────────────────────────────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof SpeciesForm> = {
  common_name: "commonName",
  khmer_name: "khmerName",
  scientific_name: "scientificName",
  family: "family",
  growth_type: "growthType",
  native_region: "nativeRegion",
  propagation_method: "propagationMethod",
  description: "description",
  image_url: "imageUrl",
};

function mapBackendErrors(
  errors: Record<string, string[]>,
): FieldErrors<keyof SpeciesForm> {
  const mapped: FieldErrors<keyof SpeciesForm> = {};
  for (const [key, msgs] of Object.entries(errors)) {
    const field = BACKEND_FIELD_MAP[key];
    if (field) mapped[field] = msgs[0];
  }
  return mapped;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function usePlantSpeciesView() {
  const navigate = useNavigate();

  // ── Data from backend ──
  const {
    data: rawItems = [],
    isLoading,
    isError,
    error: fetchError,
  } = usePlantSpeciesList();

  const items: SpeciesItem[] = rawItems.map(toSpeciesItem);

  // ── Mutations ──
  const createMutation = useCreatePlantSpecies();
  const updateMutation = useUpdatePlantSpecies();
  const deleteMutation = useDeletePlantSpecies();
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SpeciesItem | null>(null);
  const [form, setForm] = useState<SpeciesForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FieldErrors<keyof SpeciesForm>>(
    {},
  );

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  // ── Derived ──
  const families = [...new Set(items.map((s) => s.family))];

  const filteredItems = items.filter((sp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sp.scientificName.toLowerCase().includes(q) ||
      sp.commonName.toLowerCase().includes(q) ||
      sp.id.toLowerCase().includes(q);
    const matchesFamily =
      familyFilter === "all" ||
      sp.family === familyFilter ||
      (sp.family === undefined && familyFilter === "Other");
    return matchesSearch && matchesFamily;
  });

  const totalVarieties = items.reduce(
    (sum, sp) => sum + (sp.varietyCount ?? 0),
    0,
  );
  const totalSamples = items.reduce(
    (sum, sp) => sum + (sp.sampleCount ?? 0),
    0,
  );
  const totalQuantity = items.reduce(
    (sum, sp) => sum + (sp.totalQuantity ?? 0),
    0,
  );
  const activeSpecies = items.filter(
    (sp) => sp.isActive !== false && sp.varietyCount > 0,
  ).length;

  const quickStats: Stat[] = [
    { label: "Total Species", value: items.length, color: "primary" },
    { label: "Active", value: activeSpecies, color: "primary" },
    {
      label: "Varieties",
      value: totalVarieties.toLocaleString(),
      color: "primary",
    },
    {
      label: "Samples",
      value: totalSamples.toLocaleString(),
      color: "muted",
    },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Plant Species" : "Add New Species";
  const formDescription = isEditing
    ? `Update details for ${editingItem!.commonName}.`
    : "Fill in the details to register a new plant species.";

  const canSubmitForm = Boolean(
    form.commonName && form.scientificName && form.growthType,
  );

  // ── Actions ──
  const navigateToDetail = (id: string) =>
    navigate(`/inventory/products/species/${id}`);
  const navigateToBatches = (commonName: string) =>
    navigate(`/plant-stock?species=${encodeURIComponent(commonName)}`);
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateFamilyFilter = (f: string) => setFamilyFilter(f);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);

  const openCreateForm = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const openEditForm = (species: SpeciesItem) => {
    setEditingItem(species);
    setForm({
      commonName: species.commonName,
      khmerName: species.khmerName || "",
      scientificName: species.scientificName,
      family: species.family || "",
      growthType: species.growthType || "annual",
      nativeRegion: species.nativeRegion || "",
      propagationMethod: species.propagationMethod || "",
      description: species.description || "",
      imageUrl: species.imageUrl || "",
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof SpeciesForm>(
    field: K,
    value: SpeciesForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitSpeciesForm = () => {
    // ── Throttle guard ──
    const throttleErr = throttleSubmit("species_form", 1000);
    if (throttleErr) {
      toast.error(throttleErr);
      return;
    }

    // ── Sanitize ──
    const clean = sanitizeForm(form);

    // ── Validate ──
    const errors = collectErrors<keyof SpeciesForm>({
      commonName: validate(
        clean.commonName,
        (v) => required(v, "Common name"),
        (v) => maxLength(v, 255, "Common name"),
      ),
      scientificName: validate(
        clean.scientificName,
        (v) => required(v, "Scientific name"),
        (v) => maxLength(v, 255, "Scientific name"),
      ),
      growthType: validate(
        clean.growthType,
        (v) => required(v, "Growth type"),
        (v) =>
          ["annual", "perennial", "biennial"].includes(v)
            ? undefined
            : "Growth type must be Annual, Perennial, or Biennial",
      ),
      khmerName: clean.khmerName
        ? maxLength(clean.khmerName, 255, "Khmer name")
        : undefined,
      family: clean.family ? maxLength(clean.family, 255, "Family") : undefined,
      nativeRegion: clean.nativeRegion
        ? maxLength(clean.nativeRegion, 255, "Native region")
        : undefined,
      propagationMethod: clean.propagationMethod
        ? maxLength(clean.propagationMethod, 255, "Propagation method")
        : undefined,
      description: undefined,
      imageUrl: clean.imageUrl
        ? validate(
            clean.imageUrl,
            (v) => maxLength(v, 255, "Image URL"),
            (v) => validUrl(v, "Image URL"),
          )
        : undefined,
    });
    if (!isValid(errors)) {
      setFormErrors(errors);
      toast.error("Please fix the highlighted errors");
      return;
    }
    setFormErrors({});

    const formData = clean as unknown as Record<string, string>;

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, form: formData },
        {
          onSuccess: () => {
            setFormOpen(false);
            setForm(EMPTY_FORM);
            setEditingItem(null);
            toast.success(`${clean.commonName} updated successfully`);
          },
          onError: (err) => {
            const apiErr = err as unknown as ApiError;
            if (apiErr.errors) {
              setFormErrors(mapBackendErrors(apiErr.errors));
            }
            toast.error(apiErr.message || "Failed to update species");
          },
        },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          setFormOpen(false);
          setForm(EMPTY_FORM);
          setEditingItem(null);
          toast.success(`${clean.commonName} added successfully`);
        },
        onError: (err) => {
          const apiErr = err as unknown as ApiError;
          if (apiErr.errors) {
            setFormErrors(mapBackendErrors(apiErr.errors));
          }
          toast.error(apiErr.message || "Failed to create species");
        },
      });
    }
  };

  // ── Delete Species (with confirmation) ──
  const requestDeleteSpecies = (species: SpeciesItem) => {
    deleteDialog.requestConfirm(species.id, {
      title: `Delete ${species.commonName}?`,
      description: `This will permanently remove ${species.scientificName} (${species.id}).`,
    });
  };

  const confirmDeleteSpecies = () => {
    deleteDialog.confirm((id) => {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Species deleted"),
        onError: (err) => {
          const apiErr = err as unknown as ApiError;
          toast.error(apiErr.message || "Failed to delete species");
        },
      });
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    filteredItems,
    totalCount: items.length,
    quickStats,
    families,
    searchQuery,
    updateSearchQuery,
    familyFilter,
    updateFamilyFilter,
    viewMode,
    switchViewMode,
    navigateToDetail,
    navigateToBatches,
    formOpen,
    isEditing,
    formTitle,
    formDescription,
    form,
    formErrors,
    canSubmitForm,
    openCreateForm,
    openEditForm,
    closeForm,
    updateFormField,
    submitSpeciesForm,
    isSubmitting,
    isLoading,
    isError,
    fetchError,
    // Delete
    deleteDialog,
    requestDeleteSpecies,
    confirmDeleteSpecies,
  };
}

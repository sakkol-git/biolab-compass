/* ═══════════════════════════════════════════════════════════════════════════
 * usePlantSpeciesView — All state + logic for the Plant Species page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Stat } from "@/components/shared/QuickStats";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { plantSpeciesData } from "@/data/mockInventoryData";
import { usePersistedState } from "@/lib/persistence";
import {
    checkDuplicate,
    collectErrors,
    type FieldErrors,
    isValid,
    required,
    sanitizeForm,
    throttleSubmit,
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
  optimalTemp: string;
  description: string;
  imageUrl: string;
  nativeRegion: string;
  lightRequirement: string;
  waterRequirement: string;
  soilType: string;
  humidity: string;
  propagation: string;
  maturityDays: string;
  maxHeight: string;
  tags: string;
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
  growthType: "Annual",
  optimalTemp: "",
  description: "",
  imageUrl: "",
  nativeRegion: "",
  lightRequirement: "",
  waterRequirement: "",
  soilType: "",
  humidity: "",
  propagation: "",
  maturityDays: "",
  maxHeight: "",
  tags: "",
};

// Map mock data to include icons
const SEED_DATA: SpeciesItem[] = plantSpeciesData.map((species) => ({
  ...species,
  icon: FAMILY_ICONS[species.family || "Other"]?.icon || Leaf,
  color: FAMILY_ICONS[species.family || "Other"]?.color || "hsl(175, 65%, 35%)",
}));

// ─── Hook ──────────────────────────────────────────────────────────────────

export function usePlantSpeciesView() {
  const navigate = useNavigate();
  const [items, setItems] = usePersistedState<SpeciesItem[]>(
    "plant_species",
    SEED_DATA,
  );
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
    (sp) => sp.isActive && sp.varietyCount > 0,
  ).length;

  const quickStats: Stat[] = [
    { label: "Total Species", value: items.length, color: "primary" },
    { label: "Active", value: activeSpecies, color: "success" },
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
    form.commonName && form.scientificName && form.family && form.optimalTemp,
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
      growthType: species.growthType || "Annual",
      optimalTemp: species.optimalTemp || "",
      description: species.description || "",
      imageUrl: species.images?.[0] || "",
      nativeRegion: species.nativeRegion || "",
      lightRequirement: species.lightRequirement || "",
      waterRequirement: species.waterRequirement || "",
      soilType: species.soilType || "",
      humidity: species.humidity || "",
      propagation: species.propagation || "",
      maturityDays: species.maturityDays ? String(species.maturityDays) : "",
      maxHeight: species.maxHeight || "",
      tags: species.tags ? species.tags.join(", ") : "",
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
      commonName: required(clean.commonName, "Common name"),
      scientificName:
        required(clean.scientificName, "Scientific name") ||
        checkDuplicate(
          items,
          "scientificName",
          clean.scientificName,
          editingItem?.id,
        ),
      family: required(clean.family, "Family"),
      optimalTemp: required(clean.optimalTemp, "Optimal temperature"),
      khmerName: undefined,
      growthType: undefined,
      description: undefined,
      imageUrl: undefined,
      nativeRegion: undefined,
      lightRequirement: undefined,
      waterRequirement: undefined,
      soilType: undefined,
      humidity: undefined,
      propagation: undefined,
      maturityDays: undefined,
      maxHeight: undefined,
      tags: undefined,
    });
    if (!isValid(errors)) {
      setFormErrors(errors);
      toast.error("Please fix the highlighted errors");
      return;
    }
    setFormErrors({});

    const fInfo = FAMILY_ICONS[clean.family] || FAMILY_ICONS.Other;
    const parsedTags = clean.tags
      ? clean.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    if (editingItem) {
      setItems((prev) =>
        prev.map((s) =>
          s.id === editingItem.id
            ? {
                ...s,
                commonName: clean.commonName,
                scientificName: clean.scientificName,
                khmerName: clean.khmerName || undefined,
                family: clean.family,
                growthType: clean.growthType,
                optimalTemp: clean.optimalTemp,
                description: clean.description,
                images: clean.imageUrl ? [clean.imageUrl] : s.images,
                nativeRegion: clean.nativeRegion || undefined,
                lightRequirement: clean.lightRequirement || undefined,
                waterRequirement: clean.waterRequirement || undefined,
                soilType: clean.soilType || undefined,
                humidity: clean.humidity || undefined,
                propagation: clean.propagation || undefined,
                maturityDays: clean.maturityDays
                  ? Number(clean.maturityDays)
                  : undefined,
                maxHeight: clean.maxHeight || undefined,
                tags: parsedTags.length > 0 ? parsedTags : undefined,
                icon: fInfo.icon,
                color: fInfo.color,
                updatedAt: new Date().toISOString(),
              }
            : s,
        ),
      );
    } else {
      const newId = `SP-${String(items.length + 1).padStart(4, "0")}`;
      const newItem: SpeciesItem = {
        id: newId,
        speciesCode: `SP-${String(items.length + 1).padStart(4, "0")}`,
        commonName: clean.commonName,
        scientificName: clean.scientificName,
        khmerName: clean.khmerName || undefined,
        family: clean.family,
        genus: clean.family, // Use family as genus for simplicity
        growthType: clean.growthType,
        optimalTemp: clean.optimalTemp,
        description: clean.description,
        isActive: true,
        varietyCount: 0,
        sampleCount: 0,
        totalQuantity: 0,
        quantityUnit: "seeds",
        icon: fInfo.icon,
        color: fInfo.color,
        images: clean.imageUrl ? [clean.imageUrl] : [],
        nativeRegion: clean.nativeRegion || undefined,
        lightRequirement: clean.lightRequirement || undefined,
        waterRequirement: clean.waterRequirement || undefined,
        soilType: clean.soilType || undefined,
        humidity: clean.humidity || undefined,
        propagation: clean.propagation || undefined,
        maturityDays: clean.maturityDays
          ? Number(clean.maturityDays)
          : undefined,
        maxHeight: clean.maxHeight || undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setItems((prev) => [...prev, newItem]);
    }

    setFormOpen(false);
    setForm(EMPTY_FORM);
    toast.success(
      isEditing
        ? `${clean.commonName} updated successfully`
        : `${clean.commonName} added successfully`,
    );
    setEditingItem(null);
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
      setItems((prev) => prev.filter((s) => s.id !== id));
      toast.success("Species deleted");
    });
  };

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
    // Delete
    deleteDialog,
    requestDeleteSpecies,
    confirmDeleteSpecies,
  };
}

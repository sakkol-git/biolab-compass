/* ═══════════════════════════════════════════════════════════════════════════
 * usePlantSamplesView — State + logic for the Plant Samples page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Stat } from "@/components/shared/QuickStats";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { speciesDetailData } from "@/data/mockDetailData";
import { plantSamplesData } from "@/data/mockInventoryData";
import { usePersistedState } from "@/lib/persistence";
import {
    collectErrors,
    type FieldErrors,
    isValid,
    required,
    sanitizeForm,
    throttleSubmit,
    validateForeignKey,
} from "@/lib/validation";
import type { LucideIcon } from "lucide-react";
import { TestTube } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface SampleItem {
  id: string;
  sampleCode: string;
  // Hierarchical structure
  varietyId: string;
  varietyName?: string;
  speciesId: string;
  speciesName: string;
  name: string;
  uniqueCode: string;
  ownershipUserName?: string;
  ownershipDepartment?: string;
  originLocation?: string;
  description?: string;
  dateBrought?: string;
  status: string;
  icon: LucideIcon;
  color: string;
  images?: string[];
  // Physical quantity
  quantity: number;
  quantityUnit: string;
  storageLocation?: string;
  viabilityStatus?: string;
}

export interface SampleForm {
  name: string;
  speciesId: string;
  uniqueCode: string;
  ownershipUserName: string;
  ownershipDepartment: string;
  originLocation: string;
  description: string;
  dateBrought: string;
  status: string;
  notes: string;
}

const EMPTY_FORM: SampleForm = {
  name: "",
  speciesId: "",
  uniqueCode: "",
  ownershipUserName: "",
  ownershipDepartment: "",
  originLocation: "",
  description: "",
  dateBrought: "",
  status: "Active",
  notes: "",
};

const STATUS_COLORS: Record<string, string> = {
  Active:
    "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  Archived: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  Destroyed: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950",
};

export { STATUS_COLORS };

export function usePlantSamplesView() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SampleForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FieldErrors<keyof SampleForm>>(
    {},
  );

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  const [items, setItems] = usePersistedState<SampleItem[]>(
    "plant_samples",
    plantSamplesData.map((s) => ({
      id: s.id,
      sampleCode: s.sampleCode,
      varietyId: s.varietyId,
      varietyName: s.varietyName,
      speciesId: s.speciesId,
      speciesName: s.speciesName || "",
      name: s.name,
      uniqueCode: s.sampleCode,
      ownershipUserName: s.ownershipUserName,
      ownershipDepartment: s.ownershipDepartment,
      originLocation: s.originLocation,
      description: s.description,
      dateBrought: s.dateBrought,
      status: s.status,
      icon: TestTube,
      color: "text-blue-600",
      images: s.images,
      quantity: s.quantity || 0,
      quantityUnit: s.quantityUnit || "units",
      storageLocation: s.storageLocation,
      viabilityStatus: s.viabilityStatus,
    })),
  );

  const species = Object.values(speciesDetailData);

  const filteredItems = useMemo(() => {
    let result = items;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.uniqueCode.toLowerCase().includes(q) ||
          i.speciesName.toLowerCase().includes(q) ||
          (i.ownershipUserName?.toLowerCase() ?? "").includes(q) ||
          i.originLocation.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    return result;
  }, [items, searchQuery, statusFilter]);

  const stats: Stat[] = [
    { label: "Total Samples", value: items.length, color: "primary" },
    {
      label: "Active",
      value: items.filter((i) => i.status === "Active").length,
      color: "primary",
    },
    {
      label: "Archived",
      value: items.filter((i) => i.status === "Archived").length,
      color: "warning",
    },
  ];

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditForm = (item: SampleItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      speciesId: item.speciesId,
      uniqueCode: item.uniqueCode,
      ownershipUserName: item.ownershipUserName ?? "",
      ownershipDepartment: item.ownershipDepartment ?? "",
      originLocation: item.originLocation,
      description: item.description ?? "",
      dateBrought: item.dateBrought ?? "",
      status: item.status,
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    // ── Throttle guard ──
    const throttleErr = throttleSubmit("sample_form", 1000);
    if (throttleErr) {
      toast.error(throttleErr);
      return;
    }

    const clean = sanitizeForm(form);

    // ── Validate ──
    const errors = collectErrors<keyof SampleForm>({
      name: required(clean.name, "Sample name"),
      speciesId: validateForeignKey(species, clean.speciesId, "Species"),
      originLocation: required(clean.originLocation, "Origin location"),
      uniqueCode: undefined,
      ownershipUserName: undefined,
      ownershipDepartment: undefined,
      description: undefined,
      dateBrought: undefined,
      status: undefined,
      notes: undefined,
    });
    if (!isValid(errors)) {
      setFormErrors(errors);
      toast.error("Please fix the highlighted errors");
      return;
    }
    setFormErrors({});

    const matchedSpecies = species.find((s) => s.id === clean.speciesId);
    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...clean,
                speciesName: matchedSpecies?.scientificName ?? item.speciesName,
              }
            : item,
        ),
      );
      toast.success(`Sample "${clean.name}" updated`);
    } else {
      const newId = `PS-${String(items.length + 1).padStart(3, "0")}`;
      setItems((prev) => [
        ...prev,
        {
          id: newId,
          sampleCode: newId,
          varietyId: "",
          varietyName: "",
          speciesId: clean.speciesId,
          speciesName: matchedSpecies?.scientificName ?? "",
          name: clean.name,
          uniqueCode:
            clean.uniqueCode ||
            `PS-SMP-${String(items.length + 1).padStart(4, "0")}`,
          ownershipUserName: clean.ownershipUserName,
          ownershipDepartment: clean.ownershipDepartment,
          originLocation: clean.originLocation,
          description: clean.description,
          dateBrought: clean.dateBrought,
          status: clean.status,
          icon: TestTube,
          color: "text-blue-600",
          images: [],
          quantity: 0,
          quantityUnit: "units",
          storageLocation: "",
          viabilityStatus: "Unknown",
        },
      ]);
      toast.success(`Sample "${clean.name}" added`);
    }
    setDialogOpen(false);
  };

  const requestDeleteSample = (item: SampleItem) => {
    deleteDialog.requestConfirm(item.id, {
      title: `Delete ${item.name}?`,
      description: `This will permanently remove sample ${item.name} (${item.id}).`,
    });
  };

  const confirmDeleteSample = () => {
    deleteDialog.confirm((id) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Sample deleted");
    });
  };

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    setDialogOpen,
    editingId,
    form,
    formErrors,
    setForm,
    items,
    filteredItems,
    stats,
    species,
    openCreateForm,
    openEditForm,
    handleSave,
    deleteDialog,
    requestDeleteSample,
    confirmDeleteSample,
    navigate,
  } as const;
}

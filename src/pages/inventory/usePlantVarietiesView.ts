/* ═══════════════════════════════════════════════════════════════════════════
 * usePlantVarietiesView — State + logic for the Plant Varieties page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { Stat } from "@/components/shared/QuickStats";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { speciesDetailData } from "@/data/mockDetailData";
import { plantVarietiesData } from "@/data/mockInventoryData";
import { toast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";
import { Leaf } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface VarietyItem {
  id: string;
  varietyCode: string;
  speciesId: string;
  speciesName: string;
  name: string;
  uniqueCode: string;
  ownershipUserName?: string;
  ownershipDepartment?: string;
  originLocation: string;
  description?: string;
  dateBrought?: string;
  status: string;
  icon: LucideIcon;
  color: string;
  imageUrl?: string;
}

export interface VarietyForm {
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

const EMPTY_FORM: VarietyForm = {
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

// ─── Hook ──────────────────────────────────────────────────────────────────

export function usePlantVarietiesView() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<VarietyForm>(EMPTY_FORM);
  const [items, setItems] = useState<VarietyItem[]>(
    plantVarietiesData.map((v) => ({
      id: v.id,
      varietyCode: v.varietyCode,
      speciesId: v.speciesId,
      speciesName: v.speciesName,
      name: v.name,
      uniqueCode: v.uniqueCode,
      ownershipUserName: v.ownershipUserName,
      ownershipDepartment: v.ownershipDepartment,
      originLocation: v.originLocation,
      description: v.description,
      dateBrought: v.dateBrought,
      status: v.status,
      icon: Leaf,
      color: "text-emerald-600",
      imageUrl: v.images?.[0],
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
    { label: "Total Varieties", value: items.length, color: "primary" },
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
    {
      label: "Destroyed",
      value: items.filter((i) => i.status === "Destroyed").length,
      color: "destructive",
    },
  ];

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditForm = (item: VarietyItem) => {
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
    if (!form.name || !form.speciesId || !form.originLocation) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    const matchedSpecies = species.find((s) => s.id === form.speciesId);
    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                speciesName: matchedSpecies?.scientificName ?? item.speciesName,
              }
            : item,
        ),
      );
      toast({
        title: "Updated",
        description: `Variety "${form.name}" updated successfully`,
      });
    } else {
      const newId = `PV-${String(items.length + 1).padStart(3, "0")}`;
      setItems((prev) => [
        ...prev,
        {
          id: newId,
          varietyCode: newId,
          speciesId: form.speciesId,
          speciesName: matchedSpecies?.scientificName ?? "",
          name: form.name,
          uniqueCode:
            form.uniqueCode ||
            `PS-VAR-${String(items.length + 1).padStart(4, "0")}`,
          ownershipUserName: form.ownershipUserName,
          ownershipDepartment: form.ownershipDepartment,
          originLocation: form.originLocation,
          description: form.description,
          dateBrought: form.dateBrought,
          status: form.status,
          icon: Leaf,
          color: "text-emerald-600",
        },
      ]);
      toast({
        title: "Created",
        description: `Variety "${form.name}" added successfully`,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "Variety removed" });
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
    setForm,
    items,
    filteredItems,
    stats,
    species,
    openCreateForm,
    openEditForm,
    handleSave,
    handleDelete,
    navigate,
  } as const;
}

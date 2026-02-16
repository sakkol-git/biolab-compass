/* ═══════════════════════════════════════════════════════════════════════════
 * usePlantSamplesView — State + logic for the Plant Samples page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { Stat } from "@/components/shared/QuickStats";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { speciesDetailData } from "@/data/mockDetailData";
import { plantSamplesData } from "@/data/mockInventoryData";
import { toast } from "@/hooks/use-toast";
import type { LucideIcon } from "lucide-react";
import { TestTube } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface SampleItem {
  id: string;
  sampleCode: string;
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
  const [items, setItems] = useState<SampleItem[]>(
    plantSamplesData.map((s) => ({
      id: s.id,
      sampleCode: s.sampleCode,
      speciesId: s.speciesId,
      speciesName: s.speciesName,
      name: s.name,
      uniqueCode: s.uniqueCode,
      ownershipUserName: s.ownershipUserName,
      ownershipDepartment: s.ownershipDepartment,
      originLocation: s.originLocation,
      description: s.description,
      dateBrought: s.dateBrought,
      status: s.status,
      icon: TestTube,
      color: "text-blue-600",
      imageUrl: s.images?.[0],
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
      toast({ title: "Updated", description: `Sample "${form.name}" updated` });
    } else {
      const newId = `PS-${String(items.length + 1).padStart(3, "0")}`;
      setItems((prev) => [
        ...prev,
        {
          id: newId,
          sampleCode: newId,
          speciesId: form.speciesId,
          speciesName: matchedSpecies?.scientificName ?? "",
          name: form.name,
          uniqueCode:
            form.uniqueCode ||
            `PS-SMP-${String(items.length + 1).padStart(4, "0")}`,
          ownershipUserName: form.ownershipUserName,
          ownershipDepartment: form.ownershipDepartment,
          originLocation: form.originLocation,
          description: form.description,
          dateBrought: form.dateBrought,
          status: form.status,
          icon: TestTube,
          color: "text-blue-600",
        },
      ]);
      toast({ title: "Created", description: `Sample "${form.name}" added` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "Sample removed" });
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

/* ═══════════════════════════════════════════════════════════════════════════
 * useEquipmentView — All state, effects and business logic for Equipment.
 * The UI component reads this hook and renders pure, declarative JSX.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Wrench, Microscope, Flame, Gauge, Scan, Sprout, Cpu, Check, Clock, AlertCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ViewMode } from "@/components/shared/ViewToggle";
import type { Stat } from "@/components/shared/QuickStats";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  lastMaintenance?: string;
  borrowedBy?: string;
  returnDate?: string;
  issue?: string;
  icon: LucideIcon;
  color: string;
  imageUrl?: string;
  notes?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: string;
  warrantyExpiry?: string;
  depreciationRate?: string;
}

export type EquipmentForm = {
  name: string;
  category: string;
  status: string;
  location: string;
  lastMaintenance: string;
  notes: string;
  imageUrl: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: string;
  warrantyExpiry: string;
  depreciationRate: string;
  borrowedBy: string;
  returnDate: string;
  issue: string;
};

/* ─── Constants ─────────────────────────────────────────────────────────── */

const EMPTY_FORM: EquipmentForm = {
  name: "",
  category: "",
  status: "Available",
  location: "",
  lastMaintenance: "",
  notes: "",
  imageUrl: "",
  manufacturer: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  purchasePrice: "",
  warrantyExpiry: "",
  depreciationRate: "",
  borrowedBy: "",
  returnDate: "",
  issue: "",
};

export const CATEGORY_ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  Optics: { icon: Microscope, color: "hsl(210, 60%, 50%)" },
  Sterilization: { icon: Flame, color: "hsl(0, 72%, 51%)" },
  Measurement: { icon: Gauge, color: "hsl(175, 65%, 35%)" },
  Processing: { icon: Scan, color: "hsl(270, 50%, 50%)" },
  Analysis: { icon: Scan, color: "hsl(38, 92%, 50%)" },
  "Sterile Work": { icon: Flame, color: "hsl(145, 63%, 32%)" },
  "Plant Growth": { icon: Sprout, color: "hsl(80, 50%, 40%)" },
  "Molecular Biology": { icon: Cpu, color: "hsl(330, 50%, 50%)" },
};

const SEED_DATA: EquipmentItem[] = [
  { id: "EQ-001", name: "Compound Microscope", category: "Optics", status: "Available", location: "Lab Room 1", lastMaintenance: "Jan 15, 2026", icon: Microscope, color: "hsl(210, 60%, 50%)", imageUrl: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?w=600&h=400&fit=crop" },
  { id: "EQ-002", name: "Autoclave (Large)", category: "Sterilization", status: "Borrowed", location: "Lab Room 2", borrowedBy: "Dr. Park", returnDate: "Feb 10, 2026", icon: Flame, color: "hsl(0, 72%, 51%)", imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&h=400&fit=crop" },
  { id: "EQ-003", name: "pH Meter", category: "Measurement", status: "Available", location: "Chemistry Lab", lastMaintenance: "Dec 20, 2025", icon: Gauge, color: "hsl(175, 65%, 35%)", imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop" },
  { id: "EQ-004", name: "Centrifuge (High-Speed)", category: "Processing", status: "Maintenance", location: "Service Dept", issue: "Rotor replacement", icon: Scan, color: "hsl(270, 50%, 50%)", imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&h=400&fit=crop" },
  { id: "EQ-005", name: "Spectrophotometer", category: "Analysis", status: "Available", location: "Lab Room 1", lastMaintenance: "Jan 28, 2026", icon: Scan, color: "hsl(38, 92%, 50%)", imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=400&fit=crop" },
  { id: "EQ-006", name: "Laminar Flow Hood", category: "Sterile Work", status: "Borrowed", location: "Tissue Culture", borrowedBy: "Emily Rodriguez", returnDate: "Feb 08, 2026", icon: Flame, color: "hsl(145, 63%, 32%)", imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop" },
  { id: "EQ-007", name: "Growth Chamber", category: "Plant Growth", status: "Available", location: "Plant Lab", lastMaintenance: "Feb 01, 2026", icon: Sprout, color: "hsl(80, 50%, 40%)", imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&h=400&fit=crop" },
  { id: "EQ-008", name: "PCR Thermocycler", category: "Molecular Biology", status: "Available", location: "Molecular Lab", lastMaintenance: "Jan 10, 2026", icon: Cpu, color: "hsl(330, 50%, 50%)", imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop" },
];

/* ─── Status Helpers ────────────────────────────────────────────────────── */

export function statusBadgeStyle(status: string) {
  switch (status) {
    case "Available":  return "bg-primary text-primary-foreground";
    case "Borrowed":   return "bg-warning text-warning-foreground";
    case "Maintenance": return "bg-destructive text-destructive-foreground";
    default:           return "bg-muted text-muted-foreground";
  }
}

export function statusIconInfo(status: string) {
  switch (status) {
    case "Available":  return { icon: Check, className: "bg-muted text-primary border" };
    case "Borrowed":   return { icon: Clock, className: "bg-warning/10 text-warning border-warning/30 border" };
    case "Maintenance": return { icon: AlertCircle, className: "bg-destructive/10 text-destructive border-destructive/30 border" };
    default:           return { icon: AlertCircle, className: "bg-muted text-muted-foreground border-border border" };
  }
}

export function statusBackgroundStyle(status: string) {
  switch (status) {
    case "Available":  return "bg-primary/5 border-primary/20";
    case "Borrowed":   return "bg-warning/5 border-warning/20";
    case "Maintenance": return "bg-destructive/5 border-destructive/20";
    default:           return "bg-muted/50 border-border";
  }
}

/* ─── Hook ──────────────────────────────────────────────────────────────── */

export function useEquipmentView() {
  const navigate = useNavigate();

  /* — Core State — */
  const [items, setItems] = useState<EquipmentItem[]>(SEED_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  /* — Checkout Dialog — */
  const [checkoutTarget, setCheckoutTarget] = useState<EquipmentItem | null>(null);
  const isCheckoutOpen = checkoutTarget !== null;

  /* — Create / Edit Dialog — */
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EquipmentItem | null>(null);
  const [form, setForm] = useState<EquipmentForm>(EMPTY_FORM);

  /* — Derived Data — */
  const filteredItems = useMemo(
    () =>
      items.filter((eq) => {
        const q = searchQuery.toLowerCase();
        return (
          eq.name.toLowerCase().includes(q) ||
          eq.category.toLowerCase().includes(q) ||
          eq.id.toLowerCase().includes(q)
        );
      }),
    [items, searchQuery],
  );

  const quickStats: Stat[] = useMemo(() => {
    const count = (status: string) => items.filter((e) => e.status === status).length;
    return [
      { label: "Available", value: count("Available"), color: "primary" },
      { label: "Borrowed", value: count("Borrowed"), color: "warning" },
      { label: "Maintenance", value: count("Maintenance"), color: "destructive" },
    ];
  }, [items]);

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Equipment" : "Add New Equipment";
  const formDescription = isEditing
    ? `Update details for ${editingItem?.name}.`
    : "Fill in the details to add a new piece of equipment.";
  const canSubmitForm = form.name !== "" && form.category !== "" && form.location !== "";
  const showBorrowedFields = form.status === "Borrowed";
  const showMaintenanceFields = form.status === "Maintenance";
  const showConditionalFields = showBorrowedFields || showMaintenanceFields;

  /* — Actions — */
  const navigateToDetail = useCallback(
    (id: string) => navigate(`/inventory/products/equipment/${id}`),
    [navigate],
  );

  const openCheckoutDialog = useCallback((equipment: EquipmentItem) => {
    setCheckoutTarget(equipment);
  }, []);

  const closeCheckoutDialog = useCallback(() => {
    setCheckoutTarget(null);
  }, []);

  const openCreateForm = useCallback(() => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }, []);

  const openEditForm = useCallback((eq: EquipmentItem) => {
    setEditingItem(eq);
    setForm({
      name: eq.name,
      category: eq.category,
      status: eq.status,
      location: eq.location,
      lastMaintenance: eq.lastMaintenance || "",
      notes: eq.notes || "",
      imageUrl: eq.imageUrl || "",
      manufacturer: eq.manufacturer || "",
      model: eq.model || "",
      serialNumber: eq.serialNumber || "",
      purchaseDate: eq.purchaseDate || "",
      purchasePrice: eq.purchasePrice || "",
      warrantyExpiry: eq.warrantyExpiry || "",
      depreciationRate: eq.depreciationRate || "",
      borrowedBy: eq.borrowedBy || "",
      returnDate: eq.returnDate || "",
      issue: eq.issue || "",
    });
    setFormOpen(true);
  }, []);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingItem(null);
    setForm(EMPTY_FORM);
  }, []);

  const updateFormField = useCallback(
    <K extends keyof EquipmentForm>(field: K, value: EquipmentForm[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const submitEquipmentForm = useCallback(() => {
    const catInfo = CATEGORY_ICONS[form.category] || { icon: Wrench, color: "hsl(210, 20%, 50%)" };
    const optional = (v: string) => v || undefined;

    const fields = {
      name: form.name,
      category: form.category,
      status: form.status,
      location: form.location,
      lastMaintenance: optional(form.lastMaintenance),
      notes: optional(form.notes),
      icon: catInfo.icon,
      color: catInfo.color,
      imageUrl: optional(form.imageUrl),
      manufacturer: optional(form.manufacturer),
      model: optional(form.model),
      serialNumber: optional(form.serialNumber),
      purchaseDate: optional(form.purchaseDate),
      purchasePrice: optional(form.purchasePrice),
      warrantyExpiry: optional(form.warrantyExpiry),
      depreciationRate: optional(form.depreciationRate),
      borrowedBy: optional(form.borrowedBy),
      returnDate: optional(form.returnDate),
      issue: optional(form.issue),
    };

    if (editingItem) {
      setItems((prev) =>
        prev.map((eq) => (eq.id === editingItem.id ? { ...eq, ...fields } : eq)),
      );
    } else {
      const newId = `EQ-${String(items.length + 1).padStart(3, "0")}`;
      setItems((prev) => [...prev, { id: newId, ...fields } as EquipmentItem]);
    }

    toast.success(
      editingItem
        ? `${form.name} updated successfully`
        : `${form.name} added successfully`,
    );
    closeForm();
  }, [form, editingItem, items.length, closeForm]);

  /* — Public Interface — */
  return {
    /* List view */
    filteredItems,
    totalCount: items.length,
    quickStats,
    searchQuery,
    updateSearchQuery: setSearchQuery,
    viewMode,
    switchViewMode: setViewMode,
    navigateToDetail,

    /* Checkout dialog */
    checkoutTarget,
    isCheckoutOpen,
    openCheckoutDialog,
    closeCheckoutDialog,

    /* Form dialog */
    formOpen,
    isEditing,
    formTitle,
    formDescription,
    form,
    canSubmitForm,
    showBorrowedFields,
    showMaintenanceFields,
    showConditionalFields,
    openCreateForm,
    openEditForm,
    closeForm,
    updateFormField,
    submitEquipmentForm,
  };
}

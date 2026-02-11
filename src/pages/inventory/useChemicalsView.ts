/* ═══════════════════════════════════════════════════════════════════════════
 * useChemicalsView — All state + logic for the Chemicals listing page.
 *
 * The component file imports this hook and renders pure JSX.
 * No useState, useEffect, or business logic leaks into the view.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Beaker, Droplets, FlaskConical, Atom, TestTubes } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ViewMode } from "@/components/shared/ViewToggle";
import type { Stat } from "@/components/shared/QuickStats";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ChemicalItem {
  id: string;
  name: string;
  cas: string;
  quantity: string;
  expiry: string;
  daysLeft: number;
  hazard: string;
  location: string;
  icon: LucideIcon;
  color: string;
  imageUrl?: string;
  notes?: string;
  concentration?: string;
  molecularWeight?: string;
  purity?: string;
  supplier?: string;
  supplierCatalog?: string;
  lotNumber?: string;
  dateReceived?: string;
  storageTemp?: string;
  storageConditions?: string;
  safetyClass?: string;
  ghs?: string[];
}

export interface ChemicalForm {
  name: string;
  cas: string;
  quantity: string;
  expiry: string;
  hazard: string;
  location: string;
  notes: string;
  imageUrl: string;
  concentration: string;
  molecularWeight: string;
  purity: string;
  supplier: string;
  supplierCatalog: string;
  lotNumber: string;
  dateReceived: string;
  storageTemp: string;
  storageConditions: string;
  safetyClass: string;
  ghs: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

export const HAZARD_ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  high: { icon: Droplets, color: "hsl(0, 72%, 51%)" },
  medium: { icon: FlaskConical, color: "hsl(38, 92%, 50%)" },
  low: { icon: Atom, color: "hsl(145, 63%, 32%)" },
};

const EMPTY_FORM: ChemicalForm = {
  name: "", cas: "", quantity: "", expiry: "", hazard: "low", location: "",
  notes: "", imageUrl: "", concentration: "", molecularWeight: "", purity: "",
  supplier: "", supplierCatalog: "", lotNumber: "", dateReceived: "",
  storageTemp: "", storageConditions: "", safetyClass: "", ghs: "",
};

const SEED_DATA: ChemicalItem[] = [
  { id: "CH-001", name: "Sodium Hydroxide (NaOH)", cas: "1310-73-2", quantity: "2.5L", expiry: "2026-02-12", daysLeft: 7, hazard: "high", location: "Cabinet A-1", icon: Beaker as LucideIcon, color: "hsl(0, 72%, 51%)", imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=600&h=400&fit=crop" },
  { id: "CH-002", name: "Hydrochloric Acid (HCl)", cas: "7647-01-0", quantity: "1L", expiry: "2026-02-18", daysLeft: 13, hazard: "high", location: "Acid Storage", icon: Droplets as LucideIcon, color: "hsl(38, 92%, 50%)", imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop" },
  { id: "CH-003", name: "Ethanol 95%", cas: "64-17-5", quantity: "5L", expiry: "2026-02-25", daysLeft: 20, hazard: "medium", location: "Flammable Cabinet", icon: FlaskConical as LucideIcon, color: "hsl(210, 60%, 50%)", imageUrl: "https://images.unsplash.com/photo-1616711020004-4a85c872f1ee?w=600&h=400&fit=crop" },
  { id: "CH-004", name: "Agar Powder", cas: "9002-18-0", quantity: "500g", expiry: "2026-12-15", daysLeft: 313, hazard: "low", location: "Dry Storage", icon: TestTubes as LucideIcon, color: "hsl(145, 63%, 32%)", imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop" },
  { id: "CH-005", name: "Murashige-Skoog Medium", cas: "N/A", quantity: "1kg", expiry: "2026-08-30", daysLeft: 206, hazard: "low", location: "Cold Room", icon: Atom as LucideIcon, color: "hsl(175, 65%, 35%)", imageUrl: "https://images.unsplash.com/photo-1578496781985-452d4a934d50?w=600&h=400&fit=crop" },
  { id: "CH-006", name: "Phosphoric Acid", cas: "7664-38-2", quantity: "500mL", expiry: "2026-01-05", daysLeft: -31, hazard: "high", location: "Acid Storage", icon: Droplets as LucideIcon, color: "hsl(0, 72%, 51%)", imageUrl: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=600&h=400&fit=crop" },
  { id: "CH-007", name: "Potassium Nitrate", cas: "7757-79-1", quantity: "2kg", expiry: "2026-10-20", daysLeft: 257, hazard: "medium", location: "Chemical Store", icon: Atom as LucideIcon, color: "hsl(270, 50%, 50%)", imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=600&h=400&fit=crop" },
];

// ─── Helpers (exported for sub-components) ─────────────────────────────────

export const hazardBackground = (hazard: string): string => {
  switch (hazard) {
    case "high":   return "bg-destructive/5 border-destructive/20";
    case "medium": return "bg-warning/5 border-warning/20";
    case "low":    return "bg-primary/5 border-primary/20";
    default:       return "bg-muted/50 border-border";
  }
};

export const hazardBadge = (hazard: string): string => {
  switch (hazard) {
    case "high":   return "bg-destructive text-destructive-foreground";
    case "medium": return "bg-warning text-warning-foreground";
    case "low":    return "bg-primary text-primary-foreground";
    default:       return "bg-muted text-muted-foreground";
  }
};

export const expiryStatus = (daysLeft: number) => {
  if (daysLeft < 0)   return { label: "Expired", className: "bg-destructive text-destructive-foreground" };
  if (daysLeft <= 14)  return { label: `${daysLeft}d left`, className: "bg-destructive/10 text-destructive" };
  if (daysLeft <= 30)  return { label: `${daysLeft}d left`, className: "bg-warning/10 text-warning" };
  return { label: "OK", className: "bg-muted text-primary" };
};

export const formatDisplayDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useChemicalsView() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChemicalItem[]>(SEED_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChemicalItem | null>(null);
  const [form, setForm] = useState<ChemicalForm>(EMPTY_FORM);

  // ── Derived state ──
  const filteredItems = items.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cas.includes(searchQuery) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const expiredCount = items.filter((c) => c.daysLeft < 0).length;
  const expiringSoonCount = items.filter((c) => c.daysLeft > 0 && c.daysLeft <= 14).length;

  const quickStats: Stat[] = [
    { label: "Total Chemicals", value: items.length, color: "primary" },
    { label: "Expired", value: expiredCount, color: "destructive" },
    { label: "Expiring (14d)", value: expiringSoonCount, color: "warning" },
    { label: "Safe", value: items.length - expiredCount - expiringSoonCount, color: "muted" },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Chemical" : "Add New Chemical";
  const formDescription = isEditing
    ? `Update details for ${editingItem!.name}.`
    : "Fill in the details to register a new chemical.";

  const canSubmitForm = Boolean(form.name && form.quantity && form.expiry && form.location);

  // ── Actions ──
  const navigateToDetail = (id: string) => navigate(`/inventory/products/chemicals/${id}`);
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (chem: ChemicalItem) => {
    setEditingItem(chem);
    setForm({
      name: chem.name, cas: chem.cas, quantity: chem.quantity, expiry: chem.expiry,
      hazard: chem.hazard, location: chem.location, notes: chem.notes || "",
      imageUrl: chem.imageUrl || "", concentration: chem.concentration || "",
      molecularWeight: chem.molecularWeight || "", purity: chem.purity || "",
      supplier: chem.supplier || "", supplierCatalog: chem.supplierCatalog || "",
      lotNumber: chem.lotNumber || "", dateReceived: chem.dateReceived || "",
      storageTemp: chem.storageTemp || "", storageConditions: chem.storageConditions || "",
      safetyClass: chem.safetyClass || "", ghs: chem.ghs ? chem.ghs.join(", ") : "",
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ChemicalForm>(field: K, value: ChemicalForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitChemicalForm = () => {
    const today = new Date();
    const expiryDate = new Date(form.expiry);
    const daysLeft = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const hInfo = HAZARD_ICONS[form.hazard] || HAZARD_ICONS.low;
    const parsedGhs = form.ghs ? form.ghs.split(",").map((g) => g.trim()).filter(Boolean) : [];

    if (editingItem) {
      setItems((prev) =>
        prev.map((c) =>
          c.id === editingItem.id
            ? { ...c, name: form.name, cas: form.cas, quantity: form.quantity, expiry: form.expiry, daysLeft, hazard: form.hazard, location: form.location, notes: form.notes || undefined, icon: hInfo.icon, color: hInfo.color, imageUrl: form.imageUrl || undefined, concentration: form.concentration || undefined, molecularWeight: form.molecularWeight || undefined, purity: form.purity || undefined, supplier: form.supplier || undefined, supplierCatalog: form.supplierCatalog || undefined, lotNumber: form.lotNumber || undefined, dateReceived: form.dateReceived || undefined, storageTemp: form.storageTemp || undefined, storageConditions: form.storageConditions || undefined, safetyClass: form.safetyClass || undefined, ghs: parsedGhs.length > 0 ? parsedGhs : undefined }
            : c,
        ),
      );
    } else {
      const newId = `CH-${String(items.length + 1).padStart(3, "0")}`;
      const newItem: ChemicalItem = {
        id: newId, name: form.name, cas: form.cas, quantity: form.quantity, expiry: form.expiry,
        daysLeft, hazard: form.hazard, location: form.location, notes: form.notes || undefined,
        icon: hInfo.icon, color: hInfo.color, imageUrl: form.imageUrl || undefined,
        concentration: form.concentration || undefined, molecularWeight: form.molecularWeight || undefined,
        purity: form.purity || undefined, supplier: form.supplier || undefined,
        supplierCatalog: form.supplierCatalog || undefined, lotNumber: form.lotNumber || undefined,
        dateReceived: form.dateReceived || undefined, storageTemp: form.storageTemp || undefined,
        storageConditions: form.storageConditions || undefined, safetyClass: form.safetyClass || undefined,
        ghs: parsedGhs.length > 0 ? parsedGhs : undefined,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setFormOpen(false);
    setForm(EMPTY_FORM);
    toast.success(isEditing ? `${form.name} updated successfully` : `${form.name} added successfully`);
    setEditingItem(null);
  };

  return {
    // Data
    filteredItems,
    totalCount: items.length,
    quickStats,
    expiredCount,
    expiringSoonCount,

    // Search & View
    searchQuery,
    updateSearchQuery,
    viewMode,
    switchViewMode,

    // Navigation
    navigateToDetail,

    // Form
    formOpen,
    isEditing,
    formTitle,
    formDescription,
    form,
    canSubmitForm,
    openCreateForm,
    openEditForm,
    closeForm,
    updateFormField,
    submitChemicalForm,
  };
}

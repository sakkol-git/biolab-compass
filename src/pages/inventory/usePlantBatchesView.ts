/* ═══════════════════════════════════════════════════════════════════════════
 * usePlantBatchesView — All state + logic for the Plant Batches page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ViewMode } from "@/components/shared/ViewToggle";
import type { Stat } from "@/components/shared/QuickStats";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface BatchItem {
  id: string;
  species: string;
  commonName: string;
  stage: string;
  quantity: number;
  location: string;
  status: string;
  startDate: string;
  notes: string;
  imageUrl?: string;
  sourceMaterial?: string;
  expectedHarvestDate?: string;
  healthScore?: number;
  assignedTo?: string;
}

export interface BatchForm {
  species: string;
  commonName: string;
  stage: string;
  quantity: string;
  location: string;
  status: string;
  startDate: string;
  notes: string;
  imageUrl: string;
  sourceMaterial: string;
  expectedHarvestDate: string;
  healthScore: string;
  assignedTo: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

export const stageStyle = (stage: string): string => {
  switch (stage) {
    case "Seed":      return "status-pill status-seed";
    case "Seedling":  return "status-pill status-seedling";
    case "Growing":   return "status-pill status-growing";
    case "Harvested": return "status-pill status-harvested";
    case "Failed":    return "status-pill status-failed";
    default:          return "status-pill status-seed";
  }
};

const EMPTY_FORM: BatchForm = {
  species: "", commonName: "", stage: "Seed", quantity: "", location: "",
  status: "Healthy", startDate: "", notes: "", imageUrl: "", sourceMaterial: "",
  expectedHarvestDate: "", healthScore: "", assignedTo: "",
};

const SEED_DATA: BatchItem[] = [
  { id: "PB-001", species: "Solanum lycopersicum", commonName: "Tomato", stage: "Growing", quantity: 150, location: "Greenhouse A", status: "Healthy", startDate: "2025-11-15", notes: "Experimental cultivar trial", imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop" },
  { id: "PB-002", species: "Arabidopsis thaliana", commonName: "Thale Cress", stage: "Seedling", quantity: 300, location: "Growth Chamber 1", status: "Healthy", startDate: "2026-01-03", notes: "Gene expression study", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop" },
  { id: "PB-003", species: "Zea mays", commonName: "Maize", stage: "Seed", quantity: 500, location: "Cold Storage", status: "Dormant", startDate: "2025-09-20", notes: "Stored for spring planting", imageUrl: "https://images.unsplash.com/photo-1551268831-81d0b7c7c1b8?w=600&h=400&fit=crop" },
  { id: "PB-004", species: "Oryza sativa", commonName: "Rice", stage: "Growing", quantity: 200, location: "Greenhouse B", status: "Healthy", startDate: "2025-12-01", notes: "Drought resistance study", imageUrl: "https://images.unsplash.com/photo-1536304929831-774a1e21e4db?w=600&h=400&fit=crop" },
  { id: "PB-005", species: "Nicotiana tabacum", commonName: "Tobacco", stage: "Harvested", quantity: 45, location: "Drying Room", status: "Processed", startDate: "2025-08-10", notes: "Transient expression batch", imageUrl: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=600&h=400&fit=crop" },
  { id: "PB-006", species: "Glycine max", commonName: "Soybean", stage: "Failed", quantity: 0, location: "Greenhouse A", status: "Failed", startDate: "2025-10-05", notes: "Contamination detected", imageUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=400&fit=crop" },
  { id: "PB-007", species: "Triticum aestivum", commonName: "Wheat", stage: "Seedling", quantity: 400, location: "Field Plot 1", status: "Healthy", startDate: "2026-01-20", notes: "Winter wheat variety trial", imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop" },
];

// ─── Hook ──────────────────────────────────────────────────────────────────

export function usePlantBatchesView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const speciesParam = searchParams.get("species") || "";

  const [items, setItems] = useState<BatchItem[]>(SEED_DATA);
  const [searchQuery, setSearchQuery] = useState(speciesParam);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [stageFilter, setStageFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BatchItem | null>(null);
  const [form, setForm] = useState<BatchForm>(EMPTY_FORM);

  // ── Derived ──
  const locations = [...new Set(items.map((b) => b.location))];

  const filteredItems = items.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      b.species.toLowerCase().includes(q) ||
      b.commonName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);
    const matchesStage = stageFilter === "all" || b.stage.toLowerCase() === stageFilter;
    const matchesLocation = locationFilter === "all" || b.location === locationFilter;
    return matchesSearch && matchesStage && matchesLocation;
  });

  const totalPlants = items.reduce((sum, b) => sum + b.quantity, 0);
  const healthyCount = items.filter((b) => b.status === "Healthy").length;

  const quickStats: Stat[] = [
    { label: "Total Batches", value: items.length, color: "primary" },
    { label: "Healthy", value: healthyCount, color: "primary" },
    { label: "Total Plants", value: totalPlants.toLocaleString(), color: "muted" },
    { label: "Locations", value: locations.length, color: "muted" },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Plant Batch" : "Add New Batch";
  const formDescription = isEditing
    ? `Update details for batch ${editingItem!.id}.`
    : "Fill in the details to start tracking a new plant batch.";

  const canSubmitForm = Boolean(form.commonName && form.species && form.quantity && form.location && form.startDate);

  // ── Actions ──
  const navigateToDetail = (id: string) => navigate(`/inventory/products/batches/${id}`);
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);
  const updateStageFilter = (s: string) => setStageFilter(s);
  const updateLocationFilter = (l: string) => setLocationFilter(l);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (batch: BatchItem) => {
    setEditingItem(batch);
    setForm({
      species: batch.species, commonName: batch.commonName, stage: batch.stage,
      quantity: String(batch.quantity), location: batch.location, status: batch.status,
      startDate: batch.startDate, notes: batch.notes, imageUrl: batch.imageUrl || "",
      sourceMaterial: batch.sourceMaterial || "",
      expectedHarvestDate: batch.expectedHarvestDate || "",
      healthScore: batch.healthScore !== undefined ? String(batch.healthScore) : "",
      assignedTo: batch.assignedTo || "",
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof BatchForm>(field: K, value: BatchForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitBatchForm = () => {
    if (editingItem) {
      setItems((prev) =>
        prev.map((b) =>
          b.id === editingItem.id
            ? { ...b, species: form.species, commonName: form.commonName, stage: form.stage, quantity: Number(form.quantity) || 0, location: form.location, status: form.status, startDate: form.startDate, notes: form.notes, imageUrl: form.imageUrl || undefined, sourceMaterial: form.sourceMaterial || undefined, expectedHarvestDate: form.expectedHarvestDate || undefined, healthScore: form.healthScore ? Number(form.healthScore) : undefined, assignedTo: form.assignedTo || undefined }
            : b,
        ),
      );
    } else {
      const newId = `PB-${String(items.length + 1).padStart(3, "0")}`;
      const newItem: BatchItem = {
        id: newId, species: form.species, commonName: form.commonName, stage: form.stage,
        quantity: Number(form.quantity) || 0, location: form.location, status: form.status,
        startDate: form.startDate, notes: form.notes, imageUrl: form.imageUrl || undefined,
        sourceMaterial: form.sourceMaterial || undefined,
        expectedHarvestDate: form.expectedHarvestDate || undefined,
        healthScore: form.healthScore ? Number(form.healthScore) : undefined,
        assignedTo: form.assignedTo || undefined,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setFormOpen(false);
    setForm(EMPTY_FORM);
    toast.success(isEditing ? `Batch ${editingItem!.id} updated successfully` : "New batch added successfully");
    setEditingItem(null);
  };

  return {
    filteredItems, totalCount: items.length, quickStats, locations,
    searchQuery, updateSearchQuery, viewMode, switchViewMode,
    stageFilter, updateStageFilter, locationFilter, updateLocationFilter,
    navigateToDetail,
    formOpen, isEditing, formTitle, formDescription, form, canSubmitForm,
    openCreateForm, openEditForm, closeForm, updateFormField, submitBatchForm,
  };
}

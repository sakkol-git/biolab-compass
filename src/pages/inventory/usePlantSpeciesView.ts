/* ═══════════════════════════════════════════════════════════════════════════
 * usePlantSpeciesView — All state + logic for the Plant Species page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Leaf, Citrus, Flower2, Wheat, Bean, Vegan } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ViewMode } from "@/components/shared/ViewToggle";
import type { Stat } from "@/components/shared/QuickStats";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SpeciesItem {
  id: string;
  scientificName: string;
  commonName: string;
  family: string;
  growthType: string;
  optimalTemp: string;
  activeBatches: number;
  totalPlants: number;
  description: string;
  icon: LucideIcon;
  color: string;
  imageUrl?: string;
  nativeRegion?: string;
  lightRequirement?: string;
  waterRequirement?: string;
  soilType?: string;
  humidity?: string;
  propagation?: string;
  maturityDays?: number;
  maxHeight?: string;
  tags?: string[];
}

export interface SpeciesForm {
  commonName: string;
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

export const FAMILY_ICONS: Record<string, { icon: LucideIcon; color: string }> = {
  Solanaceae: { icon: Citrus, color: "hsl(0, 72%, 51%)" },
  Brassicaceae: { icon: Flower2, color: "hsl(145, 63%, 32%)" },
  Poaceae: { icon: Wheat, color: "hsl(38, 92%, 50%)" },
  Fabaceae: { icon: Bean, color: "hsl(210, 20%, 50%)" },
  Other: { icon: Leaf, color: "hsl(175, 65%, 35%)" },
};

const EMPTY_FORM: SpeciesForm = {
  commonName: "", scientificName: "", family: "", growthType: "Annual",
  optimalTemp: "", description: "", imageUrl: "", nativeRegion: "",
  lightRequirement: "", waterRequirement: "", soilType: "", humidity: "",
  propagation: "", maturityDays: "", maxHeight: "", tags: "",
};

const SEED_DATA: SpeciesItem[] = [
  { id: "SP-001", scientificName: "Solanum lycopersicum", commonName: "Tomato", family: "Solanaceae", growthType: "Annual", optimalTemp: "20–25°C", activeBatches: 1, totalPlants: 150, description: "Widely cultivated edible fruit-bearing plant used in various research studies.", icon: Citrus as LucideIcon, color: "hsl(0, 72%, 51%)", imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=600&h=400&fit=crop" },
  { id: "SP-002", scientificName: "Arabidopsis thaliana", commonName: "Thale Cress", family: "Brassicaceae", growthType: "Annual", optimalTemp: "22–24°C", activeBatches: 1, totalPlants: 300, description: "Model organism for plant biology and genetics research.", icon: Flower2 as LucideIcon, color: "hsl(145, 63%, 32%)", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop" },
  { id: "SP-003", scientificName: "Zea mays", commonName: "Maize", family: "Poaceae", growthType: "Annual", optimalTemp: "25–30°C", activeBatches: 1, totalPlants: 500, description: "Major cereal grain used in genetics, breeding, and biofuel research.", icon: Wheat as LucideIcon, color: "hsl(38, 92%, 50%)", imageUrl: "https://images.unsplash.com/photo-1551268831-81d0b7c7c1b8?w=600&h=400&fit=crop" },
  { id: "SP-004", scientificName: "Oryza sativa", commonName: "Rice", family: "Poaceae", growthType: "Annual", optimalTemp: "25–35°C", activeBatches: 1, totalPlants: 200, description: "Staple cereal crop and model monocot for genomics research.", icon: Vegan as LucideIcon, color: "hsl(80, 50%, 40%)", imageUrl: "https://images.unsplash.com/photo-1536304929831-774a1e21e4db?w=600&h=400&fit=crop" },
  { id: "SP-005", scientificName: "Nicotiana tabacum", commonName: "Tobacco", family: "Solanaceae", growthType: "Annual", optimalTemp: "20–30°C", activeBatches: 1, totalPlants: 45, description: "Commonly used in plant molecular biology and transient expression studies.", icon: Leaf as LucideIcon, color: "hsl(175, 65%, 35%)", imageUrl: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=600&h=400&fit=crop" },
  { id: "SP-006", scientificName: "Glycine max", commonName: "Soybean", family: "Fabaceae", growthType: "Annual", optimalTemp: "20–30°C", activeBatches: 0, totalPlants: 0, description: "Important legume crop used in nitrogen fixation and protein research.", icon: Bean as LucideIcon, color: "hsl(210, 20%, 50%)", imageUrl: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=400&fit=crop" },
  { id: "SP-007", scientificName: "Triticum aestivum", commonName: "Wheat", family: "Poaceae", growthType: "Annual", optimalTemp: "15–20°C", activeBatches: 1, totalPlants: 400, description: "Major global cereal crop, model for polyploidy and breeding research.", icon: Wheat as LucideIcon, color: "hsl(30, 60%, 45%)", imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop" },
];

// ─── Hook ──────────────────────────────────────────────────────────────────

export function usePlantSpeciesView() {
  const navigate = useNavigate();
  const [items, setItems] = useState<SpeciesItem[]>(SEED_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [familyFilter, setFamilyFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SpeciesItem | null>(null);
  const [form, setForm] = useState<SpeciesForm>(EMPTY_FORM);

  // ── Derived ──
  const families = [...new Set(items.map((s) => s.family))];

  const filteredItems = items.filter((sp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sp.scientificName.toLowerCase().includes(q) ||
      sp.commonName.toLowerCase().includes(q) ||
      sp.id.toLowerCase().includes(q);
    const matchesFamily = familyFilter === "all" || sp.family === familyFilter;
    return matchesSearch && matchesFamily;
  });

  const totalPlants = items.reduce((sum, sp) => sum + sp.totalPlants, 0);
  const activeSpecies = items.filter((sp) => sp.activeBatches > 0).length;

  const quickStats: Stat[] = [
    { label: "Species", value: items.length, color: "primary" },
    { label: "Active Species", value: activeSpecies, color: "primary" },
    { label: "Total Plants", value: totalPlants.toLocaleString(), color: "muted" },
    { label: "Families", value: families.length, color: "muted" },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Plant Species" : "Add New Species";
  const formDescription = isEditing
    ? `Update details for ${editingItem!.commonName}.`
    : "Fill in the details to register a new plant species.";

  const canSubmitForm = Boolean(form.commonName && form.scientificName && form.family && form.optimalTemp);

  // ── Actions ──
  const navigateToDetail = (id: string) => navigate(`/inventory/products/species/${id}`);
  const navigateToBatches = (commonName: string) => navigate(`/plant-batches?species=${encodeURIComponent(commonName)}`);
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateFamilyFilter = (f: string) => setFamilyFilter(f);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (species: SpeciesItem) => {
    setEditingItem(species);
    setForm({
      commonName: species.commonName, scientificName: species.scientificName,
      family: species.family, growthType: species.growthType, optimalTemp: species.optimalTemp,
      description: species.description, imageUrl: species.imageUrl || "",
      nativeRegion: species.nativeRegion || "", lightRequirement: species.lightRequirement || "",
      waterRequirement: species.waterRequirement || "", soilType: species.soilType || "",
      humidity: species.humidity || "", propagation: species.propagation || "",
      maturityDays: species.maturityDays ? String(species.maturityDays) : "",
      maxHeight: species.maxHeight || "", tags: species.tags ? species.tags.join(", ") : "",
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof SpeciesForm>(field: K, value: SpeciesForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitSpeciesForm = () => {
    const fInfo = FAMILY_ICONS[form.family] || FAMILY_ICONS.Other;
    const parsedTags = form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];

    if (editingItem) {
      setItems((prev) =>
        prev.map((s) =>
          s.id === editingItem.id
            ? { ...s, commonName: form.commonName, scientificName: form.scientificName, family: form.family, growthType: form.growthType, optimalTemp: form.optimalTemp, description: form.description, imageUrl: form.imageUrl || undefined, nativeRegion: form.nativeRegion || undefined, lightRequirement: form.lightRequirement || undefined, waterRequirement: form.waterRequirement || undefined, soilType: form.soilType || undefined, humidity: form.humidity || undefined, propagation: form.propagation || undefined, maturityDays: form.maturityDays ? Number(form.maturityDays) : undefined, maxHeight: form.maxHeight || undefined, tags: parsedTags.length > 0 ? parsedTags : undefined, icon: fInfo.icon, color: fInfo.color }
            : s,
        ),
      );
    } else {
      const newId = `SP-${String(items.length + 1).padStart(3, "0")}`;
      const newItem: SpeciesItem = {
        id: newId, commonName: form.commonName, scientificName: form.scientificName,
        family: form.family, growthType: form.growthType, optimalTemp: form.optimalTemp,
        description: form.description, activeBatches: 0, totalPlants: 0,
        icon: fInfo.icon, color: fInfo.color,
        imageUrl: form.imageUrl || undefined, nativeRegion: form.nativeRegion || undefined,
        lightRequirement: form.lightRequirement || undefined, waterRequirement: form.waterRequirement || undefined,
        soilType: form.soilType || undefined, humidity: form.humidity || undefined,
        propagation: form.propagation || undefined,
        maturityDays: form.maturityDays ? Number(form.maturityDays) : undefined,
        maxHeight: form.maxHeight || undefined,
        tags: parsedTags.length > 0 ? parsedTags : undefined,
      };
      setItems((prev) => [...prev, newItem]);
    }

    setFormOpen(false);
    setForm(EMPTY_FORM);
    toast.success(isEditing ? `${form.commonName} updated successfully` : `${form.commonName} added successfully`);
    setEditingItem(null);
  };

  return {
    filteredItems, totalCount: items.length, quickStats, families,
    searchQuery, updateSearchQuery, familyFilter, updateFamilyFilter,
    viewMode, switchViewMode,
    navigateToDetail, navigateToBatches,
    formOpen, isEditing, formTitle, formDescription, form, canSubmitForm,
    openCreateForm, openEditForm, closeForm, updateFormField, submitSpeciesForm,
  };
}

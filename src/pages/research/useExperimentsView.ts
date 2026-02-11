/* ═══════════════════════════════════════════════════════════════════════════
 * useExperimentsView — All state + logic for the Experiments page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ViewMode } from "@/components/shared/ViewToggle";
import type { Stat } from "@/components/shared/QuickStats";
import { experimentsData as initialData } from "@/data/mockResearchData";
import type { Experiment, PropagationMethod } from "@/types/research";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ExperimentForm {
  title: string;
  speciesName: string;
  commonName: string;
  objective: string;
  propagationMethod: PropagationMethod;
  growthMedium: string;
  environment: string;
  initialSeedCount: string;
  startDate: string;
  expectedEndDate: string;
  assignedTo: string;
  tags: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: ExperimentForm = {
  title: "", speciesName: "", commonName: "", objective: "",
  propagationMethod: "Seed", growthMedium: "", environment: "",
  initialSeedCount: "", startDate: "", expectedEndDate: "", assignedTo: "", tags: "",
};

const PROPAGATION_METHODS: PropagationMethod[] = ["Seed", "Cutting", "Grafting", "Tissue Culture"];
const STATUS_OPTIONS = ["Planning", "Active", "Paused", "Completed", "Failed"];

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useExperimentsView() {
  const navigate = useNavigate();
  const [experiments, setExperiments] = useState<Experiment[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Experiment | null>(null);
  const [form, setForm] = useState<ExperimentForm>(EMPTY_FORM);

  // ── Derived ──
  const filteredExperiments = experiments.filter((exp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      exp.title.toLowerCase().includes(q) ||
      exp.commonName.toLowerCase().includes(q) ||
      exp.experimentCode.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || exp.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeCount = experiments.filter((e) => e.status === "Active").length;
  const completedCount = experiments.filter((e) => e.status === "Completed").length;

  const quickStats: Stat[] = [
    { label: "Total", value: experiments.length, color: "primary" },
    { label: "Active", value: activeCount, color: "primary" },
    { label: "Completed", value: completedCount, color: "muted" },
    { label: "Species", value: [...new Set(experiments.map((e) => e.commonName))].length, color: "muted" },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Experiment" : "New Experiment";
  const formDescription = isEditing
    ? `Update ${editingItem!.experimentCode}`
    : "Set up a new seedling propagation experiment.";

  const canSubmitForm = Boolean(form.title && form.speciesName && form.initialSeedCount);

  // ── Actions ──
  const navigateToDetail = (id: string) => navigate(`/research/experiments/${id}`);
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateStatusFilter = (s: string) => setStatusFilter(s);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (exp: Experiment) => {
    setEditingItem(exp);
    setForm({
      title: exp.title, speciesName: exp.speciesName, commonName: exp.commonName,
      objective: exp.objective, propagationMethod: exp.propagationMethod,
      growthMedium: exp.growthMedium, environment: exp.environment,
      initialSeedCount: String(exp.initialSeedCount), startDate: exp.startDate,
      expectedEndDate: exp.expectedEndDate,
      assignedTo: exp.assignedTo.join(", "), tags: exp.tags.join(", "),
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ExperimentForm>(field: K, value: ExperimentForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitExperimentForm = () => {
    if (editingItem) {
      setExperiments((prev) => prev.map((e) =>
        e.id === editingItem.id
          ? { ...e, title: form.title, objective: form.objective, propagationMethod: form.propagationMethod, growthMedium: form.growthMedium, environment: form.environment, initialSeedCount: Number(form.initialSeedCount), startDate: form.startDate, expectedEndDate: form.expectedEndDate, assignedTo: form.assignedTo.split(",").map((s) => s.trim()).filter(Boolean), tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean) }
          : e,
      ));
    } else {
      const newId = `EXP-${String(experiments.length + 1).padStart(3, "0")}`;
      setExperiments((prev) => [...prev, {
        id: newId, experimentCode: newId, speciesId: "", speciesName: form.speciesName,
        commonName: form.commonName, title: form.title, objective: form.objective,
        propagationMethod: form.propagationMethod, growthMedium: form.growthMedium,
        environment: form.environment, initialSeedCount: Number(form.initialSeedCount),
        currentCount: 0, startDate: form.startDate, expectedEndDate: form.expectedEndDate,
        status: "Planning", assignedTo: form.assignedTo.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        createdAt: new Date().toISOString().split("T")[0],
      }]);
    }

    setFormOpen(false);
    setForm(EMPTY_FORM);
    toast.success(isEditing ? `${form.title} updated` : `${form.title} created`);
    setEditingItem(null);
  };

  return {
    filteredExperiments, totalCount: experiments.length, quickStats,
    searchQuery, updateSearchQuery, statusFilter, updateStatusFilter,
    viewMode, switchViewMode,
    navigateToDetail,
    formOpen, isEditing, formTitle, formDescription, form, canSubmitForm,
    propagationMethods: PROPAGATION_METHODS, statusOptions: STATUS_OPTIONS,
    openCreateForm, openEditForm, closeForm, updateFormField, submitExperimentForm,
  };
}

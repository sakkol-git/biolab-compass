/* ═══════════════════════════════════════════════════════════════════════════
 * useExperimentsView — All state + logic for the Experiments listing page.
 *
 * Connects to Laravel backend via React Query + experimentService.
 * Follows the golden-standard hook pattern (see useChemicalsView).
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  useCreateExperiment,
  useDeleteExperiment,
  useExperimentList,
  useUpdateExperiment,
} from "@/features/research/services";
import { useConfirmDialog } from "@/shared/components/ConfirmDialog";
import type { Stat } from "@/shared/components/QuickStats";
import type { ViewMode } from "@/shared/components/ViewToggle";
import type { ExperimentApi, ExperimentPayload } from "@/shared/types";
import { isValidationError } from "@/shared/types/api-error";
import type { PropagationMethod } from "@/shared/types/enums";
import {
  EXPERIMENT_STATUSES,
  PROPAGATION_METHODS,
  formatEnumLabel,
} from "@/shared/types/enums";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ExperimentForm {
  title: string;
  plantSpeciesId: string;
  objective: string;
  description: string;
  propagationMethod: string;
  growthMedium: string;
  environment: string;
  initialSeedCount: string;
  startDate: string;
  expectedEndDate: string;
  notes: string;
  imageUrl: string;
  tags: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: ExperimentForm = {
  title: "",
  plantSpeciesId: "",
  objective: "",
  description: "",
  propagationMethod: "seed",
  growthMedium: "",
  environment: "",
  initialSeedCount: "",
  startDate: "",
  expectedEndDate: "",
  notes: "",
  imageUrl: "",
  tags: "",
};

export { EXPERIMENT_STATUSES, PROPAGATION_METHODS, formatEnumLabel };

// ─── Helpers (exported for sub-components) ─────────────────────────────────

function formToPayload(form: ExperimentForm): ExperimentPayload {
  return {
    title: form.title,
    plant_species_id: Number(form.plantSpeciesId) || 0,
    objective: form.objective || null,
    description: form.description || null,
    propagation_method: form.propagationMethod as PropagationMethod,
    growth_medium: form.growthMedium || null,
    environment: form.environment || null,
    initial_seed_count: Number(form.initialSeedCount) || 0,
    start_date: form.startDate,
    expected_end_date: form.expectedEndDate || null,
    notes: form.notes || null,
    image_url: form.imageUrl || null,
    tags: form.tags
      ? form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  };
}

function experimentToForm(item: ExperimentApi): ExperimentForm {
  return {
    title: item.title,
    plantSpeciesId: String(item.species.id),
    objective: item.objective || "",
    description: item.description || "",
    propagationMethod: item.propagation_method,
    growthMedium: item.growth_medium || "",
    environment: item.environment || "",
    initialSeedCount: String(item.metrics.initial_seed_count),
    startDate: item.dates.start_date,
    expectedEndDate: item.dates.expected_end_date || "",
    notes: item.notes || "",
    imageUrl: item.image_url || "",
    tags: item.tags.map((t) => t.name).join(", "),
  };
}

// ─── Backend Error Field Map ────────────────────────────────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof ExperimentForm> = {
  title: "title",
  plant_species_id: "plantSpeciesId",
  objective: "objective",
  description: "description",
  propagation_method: "propagationMethod",
  growth_medium: "growthMedium",
  environment: "environment",
  initial_seed_count: "initialSeedCount",
  start_date: "startDate",
  expected_end_date: "expectedEndDate",
  notes: "notes",
  image_url: "imageUrl",
  tags: "tags",
};

type FormErrors = Partial<Record<keyof ExperimentForm, string>>;

function mapBackendErrors(errors: Record<string, string[]>): FormErrors {
  const mapped: FormErrors = {};
  for (const [key, msgs] of Object.entries(errors)) {
    const field = BACKEND_FIELD_MAP[key];
    if (field) mapped[field] = msgs[0];
  }
  return mapped;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useExperimentsView() {
  const navigate = useNavigate();

  // ── Data from backend (paginated) ──
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryParams: Record<string, unknown> = { page };
  if (searchQuery) queryParams.search = searchQuery;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data: response, isLoading, isError } = useExperimentList(queryParams);

  const items = response?.data ?? [];
  const meta = response?.meta;

  // ── Mutations ──
  const createMutation = useCreateExperiment();
  const updateMutation = useUpdateExperiment();
  const deleteMutation = useDeleteExperiment();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperimentApi | null>(null);
  const [form, setForm] = useState<ExperimentForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  // ── Derived state ──
  const filteredItems = items; // Server-side filtering

  const activeCount = items.filter((e) => e.status === "active").length;
  const completedCount = items.filter((e) => e.status === "completed").length;

  const quickStats: Stat[] = [
    { label: "Total", value: meta?.total ?? items.length, color: "primary" },
    { label: "Active", value: activeCount, color: "primary" },
    { label: "Completed", value: completedCount, color: "muted" },
    {
      label: "Species",
      value: [...new Set(items.map((e) => e.species.common_name))].length,
      color: "muted",
    },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Experiment" : "New Experiment";
  const formDescription = isEditing
    ? `Update ${editingItem!.experiment_code}`
    : "Set up a new seedling propagation experiment.";

  const canSubmitForm = Boolean(
    form.title && form.plantSpeciesId && form.initialSeedCount,
  );

  // ── Actions ──
  const navigateToDetail = (id: number) =>
    navigate(`/research/experiments/${id}`);
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateStatusFilter = (s: string) => setStatusFilter(s);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);

  const openCreateForm = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  const openEditForm = (exp: ExperimentApi) => {
    setEditingItem(exp);
    setForm(experimentToForm(exp));
    setFormErrors({});
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ExperimentForm>(
    field: K,
    value: ExperimentForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitExperimentForm = () => {
    if (!form.title || !form.plantSpeciesId || !form.initialSeedCount) {
      toast.error("Please fill in all required fields");
      return;
    }
    setFormErrors({});

    const payload = formToPayload(form);

    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, payload },
        {
          onSuccess: () => {
            setFormOpen(false);
            setForm(EMPTY_FORM);
            setEditingItem(null);
            toast.success(`${form.title} updated successfully`);
          },
          onError: (err) => {
            if (isValidationError(err)) {
              setFormErrors(mapBackendErrors(err.response.data.errors));
            }
            toast.error(
              isValidationError(err)
                ? err.response.data.message
                : "Failed to update experiment",
            );
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          setFormOpen(false);
          setForm(EMPTY_FORM);
          setEditingItem(null);
          toast.success(`${form.title} created successfully`);
        },
        onError: (err) => {
          if (isValidationError(err)) {
            setFormErrors(mapBackendErrors(err.response.data.errors));
          }
          toast.error(
            isValidationError(err)
              ? err.response.data.message
              : "Failed to create experiment",
          );
        },
      });
    }
  };

  // ── Delete ──
  const requestDeleteExperiment = (exp: ExperimentApi) => {
    deleteDialog.requestConfirm(String(exp.id), {
      title: `Delete ${exp.title}?`,
      description: `This will permanently remove experiment ${exp.experiment_code}.`,
    });
  };

  const confirmDeleteExperiment = () => {
    deleteDialog.confirm((id) => {
      deleteMutation.mutate(Number(id), {
        onSuccess: () => toast.success("Experiment deleted"),
        onError: () => toast.error("Failed to delete experiment"),
      });
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    filteredItems,
    totalCount: meta?.total ?? items.length,
    quickStats,
    searchQuery,
    updateSearchQuery,
    statusFilter,
    updateStatusFilter,
    statusOptions: EXPERIMENT_STATUSES,
    viewMode,
    switchViewMode,
    navigateToDetail,
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
    submitExperimentForm,
    // Delete
    deleteDialog,
    requestDeleteExperiment,
    confirmDeleteExperiment,
    isLoading,
    isError,
    isSubmitting,
    page,
    setPage,
    meta,
  };
}

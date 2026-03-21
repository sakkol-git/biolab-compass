/* ═══════════════════════════════════════════════════════════════════════════
 * useLabNotebooksView — All state + logic for the Lab Notebooks page.
 *
 * Connects to Laravel backend via React Query + labNotebookService.
 * Follows the golden-standard hook pattern. LabNotebooks uses an expandable-
 * card layout rather than grid/table, so no ViewMode toggle is included.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateLabNotebook,
  useDeleteLabNotebook,
  useExperimentList,
  useLabNotebookList,
  useToggleLabNotebookLock,
  useUpdateLabNotebook,
} from "@/features/research/services";
import { useConfirmDialog } from "@/shared/components/ConfirmDialog";
import type { Stat } from "@/shared/components/QuickStats";
import type { LabNotebookApi, LabNotebookPayload } from "@/shared/types";
import { isValidationError } from "@/shared/types/api-error";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface NotebookForm {
  title: string;
  content: string;
  experimentId: string; // "" = none, otherwise stringified number ID
  tags: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: NotebookForm = {
  title: "",
  content: "",
  experimentId: "",
  tags: "",
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function formToPayload(form: NotebookForm): LabNotebookPayload {
  return {
    title: form.title,
    content: form.content || null,
    experiment_id: form.experimentId ? Number(form.experimentId) : null,
    tags: form.tags
      ? form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  };
}

function notebookToForm(item: LabNotebookApi): NotebookForm {
  return {
    title: item.title,
    content: item.content || "",
    experimentId: item.experiment ? String(item.experiment.id) : "",
    tags: item.tags.map((t) => t.name).join(", "),
  };
}

// ─── Backend Error Field Map ────────────────────────────────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof NotebookForm> = {
  title: "title",
  content: "content",
  experiment_id: "experimentId",
  tags: "tags",
};

type FormErrors = Partial<Record<keyof NotebookForm, string>>;

function mapBackendErrors(errors: Record<string, string[]>): FormErrors {
  const mapped: FormErrors = {};
  for (const [key, msgs] of Object.entries(errors)) {
    const field = BACKEND_FIELD_MAP[key];
    if (field) mapped[field] = msgs[0];
  }
  return mapped;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useLabNotebooksView() {
  // ── Data from backend (paginated) ──
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const queryParams: Record<string, unknown> = { page };
  if (searchQuery) queryParams.search = searchQuery;

  const {
    data: response,
    isLoading,
    isError,
  } = useLabNotebookList(queryParams);

  const items = response?.data ?? [];
  const meta = response?.meta;

  // ── Available experiments for dropdown ──
  const { data: experimentsResponse } = useExperimentList({ per_page: 100 });
  const availableExperiments = experimentsResponse?.data ?? [];

  // ── Mutations ──
  const createMutation = useCreateLabNotebook();
  const updateMutation = useUpdateLabNotebook();
  const deleteMutation = useDeleteLabNotebook();
  const toggleLockMutation = useToggleLabNotebookLock();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LabNotebookApi | null>(null);
  const [form, setForm] = useState<NotebookForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  // ── Derived state ──
  const filteredEntries = items; // Server-side filtering

  const summaryStats: Stat[] = [
    {
      label: "Total Entries",
      value: meta?.total ?? items.length,
      color: "primary",
    },
    {
      label: "Locked",
      value: items.filter((n) => n.is_locked).length,
      color: "muted",
    },
    {
      label: "Linked",
      value: items.filter((n) => n.experiment !== null).length,
      color: "primary",
    },
    {
      label: "Authors",
      value: [...new Set(items.map((n) => n.user?.name ?? "unknown"))].length,
      color: "muted",
    },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Entry" : "New Notebook Entry";
  const formDescription = isEditing
    ? `Update ${editingItem!.notebook_code}`
    : "Record observations, procedures, or notes.";

  const canSubmitForm = Boolean(form.title && form.content);

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);

  const isExpanded = (id: number) => expandedId === id;
  const toggleExpansion = (id: number) =>
    setExpandedId(expandedId === id ? null : id);

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

  const openEditForm = (nb: LabNotebookApi) => {
    if (nb.is_locked) {
      toast.error("This entry is locked and cannot be edited.");
      return;
    }
    setEditingItem(nb);
    setForm(notebookToForm(nb));
    setFormErrors({});
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof NotebookForm>(
    field: K,
    value: NotebookForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLock = (nb: LabNotebookApi) => {
    toggleLockMutation.mutate(nb.id, {
      onSuccess: () =>
        toast.success(
          nb.is_locked
            ? `${nb.notebook_code} unlocked`
            : `${nb.notebook_code} locked`,
        ),
      onError: () => toast.error("Failed to toggle lock"),
    });
  };

  const submitNotebookForm = () => {
    if (!form.title || !form.content) {
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
                : "Failed to update entry",
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
              : "Failed to create entry",
          );
        },
      });
    }
  };

  // ── Delete ──
  const requestDeleteNotebook = (nb: LabNotebookApi) => {
    deleteDialog.requestConfirm(String(nb.id), {
      title: `Delete ${nb.title}?`,
      description: `This will permanently remove notebook entry ${nb.notebook_code}.`,
    });
  };

  const confirmDeleteNotebook = () => {
    deleteDialog.confirm((id) => {
      deleteMutation.mutate(Number(id), {
        onSuccess: () => toast.success("Notebook entry deleted"),
        onError: () => toast.error("Failed to delete notebook entry"),
      });
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    filteredEntries,
    totalCount: meta?.total ?? items.length,
    summaryStats,
    searchQuery,
    updateSearchQuery,
    isExpanded,
    toggleExpansion,
    formOpen,
    isEditing,
    formTitle,
    formDescription,
    form,
    formErrors,
    canSubmitForm,
    availableExperiments,
    openCreateForm,
    openEditForm,
    closeForm,
    updateFormField,
    submitNotebookForm,
    toggleLock,
    // Delete
    deleteDialog,
    requestDeleteNotebook,
    confirmDeleteNotebook,
    isLoading,
    isError,
    isSubmitting,
    page,
    setPage,
    meta,
  };
}

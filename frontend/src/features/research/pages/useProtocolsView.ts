/* ═══════════════════════════════════════════════════════════════════════════
 * useProtocolsView — All state + logic for the Protocols listing page.
 *
 * Connects to Laravel backend via React Query + protocolService.
 * Follows the golden-standard hook pattern (see useChemicalsView).
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { toast } from "sonner";

import {
  useCreateProtocol,
  useDeleteProtocol,
  useProtocolList,
  useUpdateProtocol,
} from "@/features/research/services";
import { useConfirmDialog } from "@/shared/components/ConfirmDialog";
import type { Stat } from "@/shared/components/QuickStats";
import type { ViewMode } from "@/shared/components/ViewToggle";
import type { ProtocolApi, ProtocolPayload } from "@/shared/types";
import { isValidationError } from "@/shared/types/api-error";
import type { ProtocolStatus } from "@/shared/types/enums";
import { PROTOCOL_STATUSES, formatEnumLabel } from "@/shared/types/enums";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ProtocolForm {
  title: string;
  description: string;
  category: string;
  version: string;
  status: string;
  tags: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: ProtocolForm = {
  title: "",
  description: "",
  category: "",
  version: "1.0",
  status: "draft",
  tags: "",
};

export { PROTOCOL_STATUSES, formatEnumLabel };

// ─── Helpers ───────────────────────────────────────────────────────────────

function formToPayload(form: ProtocolForm): ProtocolPayload {
  return {
    title: form.title,
    description: form.description || null,
    category: form.category,
    version: form.version || undefined,
    status: (form.status as ProtocolStatus) || undefined,
    tags: form.tags
      ? form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  };
}

function protocolToForm(item: ProtocolApi): ProtocolForm {
  return {
    title: item.title,
    description: item.description || "",
    category: item.category,
    version: item.version,
    status: item.status,
    tags: item.tags.map((t) => t.name).join(", "),
  };
}

// ─── Backend Error Field Map ────────────────────────────────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof ProtocolForm> = {
  title: "title",
  description: "description",
  category: "category",
  version: "version",
  status: "status",
  tags: "tags",
};

type FormErrors = Partial<Record<keyof ProtocolForm, string>>;

function mapBackendErrors(errors: Record<string, string[]>): FormErrors {
  const mapped: FormErrors = {};
  for (const [key, msgs] of Object.entries(errors)) {
    const field = BACKEND_FIELD_MAP[key];
    if (field) mapped[field] = msgs[0];
  }
  return mapped;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useProtocolsView() {
  // ── Data from backend (paginated) ──
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryParams: Record<string, unknown> = { page };
  if (searchQuery) queryParams.search = searchQuery;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data: response, isLoading, isError } = useProtocolList(queryParams);

  const items = response?.data ?? [];
  const meta = response?.meta;

  // ── Mutations ──
  const createMutation = useCreateProtocol();
  const updateMutation = useUpdateProtocol();
  const deleteMutation = useDeleteProtocol();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProtocolApi | null>(null);
  const [form, setForm] = useState<ProtocolForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  // ── Derived state ──
  const filteredItems = items; // Server-side filtering

  const categories = [...new Set(items.map((p) => p.category))];

  const quickStats: Stat[] = [
    { label: "Total", value: meta?.total ?? items.length, color: "primary" },
    {
      label: "Active",
      value: items.filter((p) => p.status === "active").length,
      color: "primary",
    },
    {
      label: "Draft",
      value: items.filter((p) => p.status === "draft").length,
      color: "muted",
    },
    { label: "Categories", value: categories.length, color: "muted" },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Protocol" : "New Protocol";
  const formDescription = isEditing
    ? `Update ${editingItem!.protocol_code}`
    : "Define a new standard operating procedure.";

  const canSubmitForm = Boolean(form.title && form.category);

  // ── Actions ──
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

  const openEditForm = (p: ProtocolApi) => {
    setEditingItem(p);
    setForm(protocolToForm(p));
    setFormErrors({});
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ProtocolForm>(
    field: K,
    value: ProtocolForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitProtocolForm = () => {
    if (!form.title || !form.category) {
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
                : "Failed to update protocol",
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
              : "Failed to create protocol",
          );
        },
      });
    }
  };

  // ── Delete ──
  const requestDeleteProtocol = (p: ProtocolApi) => {
    deleteDialog.requestConfirm(String(p.id), {
      title: `Delete ${p.title}?`,
      description: `This will permanently remove protocol ${p.protocol_code}.`,
    });
  };

  const confirmDeleteProtocol = () => {
    deleteDialog.confirm((id) => {
      deleteMutation.mutate(Number(id), {
        onSuccess: () => toast.success("Protocol deleted"),
        onError: () => toast.error("Failed to delete protocol"),
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
    statusOptions: PROTOCOL_STATUSES,
    viewMode,
    switchViewMode,
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
    submitProtocolForm,
    // Delete
    deleteDialog,
    requestDeleteProtocol,
    confirmDeleteProtocol,
    isLoading,
    isError,
    isSubmitting,
    page,
    setPage,
    meta,
  };
}

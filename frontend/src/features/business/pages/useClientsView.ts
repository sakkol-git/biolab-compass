/* ═══════════════════════════════════════════════════════════════════════════
 * useClientsView — All state + logic for the Clients listing page.
 *
 * Connects to Laravel backend via React Query + clientService.
 * Follows the golden-standard hook pattern (see useChemicalsView).
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { toast } from "sonner";

import {
    useClientList,
    useCreateClient,
    useDeleteClient,
    useUpdateClient,
} from "@/features/business/services";
import { useConfirmDialog } from "@/shared/components/ConfirmDialog";
import type { Stat } from "@/shared/components/QuickStats";
import type { ViewMode } from "@/shared/components/ViewToggle";
import { formatCurrency } from "@/shared/lib/calculator";
import type { ClientApi, ClientPayload } from "@/shared/types";
import { isValidationError } from "@/shared/types/api-error";
import type { ClientType } from "@/shared/types/enums";
import { CLIENT_TYPES, formatEnumLabel } from "@/shared/types/enums";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ClientForm {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  clientType: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: ClientForm = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  clientType: "farm_owner",
};

export { CLIENT_TYPES, formatEnumLabel };

// ─── Helpers ───────────────────────────────────────────────────────────────

function formToPayload(form: ClientForm): ClientPayload {
  return {
    company_name: form.companyName,
    contact_name: form.contactName,
    email: form.email || null,
    phone: form.phone || null,
    address: form.address || null,
    client_type: form.clientType as ClientType,
  };
}

function clientToForm(item: ClientApi): ClientForm {
  return {
    companyName: item.company_name,
    contactName: item.contact_name,
    email: item.email || "",
    phone: item.phone || "",
    address: item.address || "",
    clientType: item.client_type,
  };
}

// ─── Backend Error Field Map ────────────────────────────────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof ClientForm> = {
  company_name: "companyName",
  contact_name: "contactName",
  email: "email",
  phone: "phone",
  address: "address",
  client_type: "clientType",
};

type FormErrors = Partial<Record<keyof ClientForm, string>>;

function mapBackendErrors(errors: Record<string, string[]>): FormErrors {
  const mapped: FormErrors = {};
  for (const [key, msgs] of Object.entries(errors)) {
    const field = BACKEND_FIELD_MAP[key];
    if (field) mapped[field] = msgs[0];
  }
  return mapped;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useClientsView() {
  // ── Data from backend (paginated) ──
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const queryParams: Record<string, unknown> = { page };
  if (searchQuery) queryParams.search = searchQuery;
  if (typeFilter !== "all") queryParams.client_type = typeFilter;

  const { data: response, isLoading, isError } = useClientList(queryParams);

  const items = response?.data ?? [];
  const meta = response?.meta;

  // ── Mutations ──
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient();
  const deleteMutation = useDeleteClient();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClientApi | null>(null);
  const [form, setForm] = useState<ClientForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  // ── Derived state ──
  const filteredItems = items; // Server-side filtering

  const totalValue = items.reduce((s, c) => s + c.total_value, 0);

  const quickStats: Stat[] = [
    {
      label: "Total Clients",
      value: meta?.total ?? items.length,
      color: "primary",
    },
    {
      label: "Farm Owners",
      value: items.filter((c) => c.client_type === "farm_owner").length,
      color: "muted",
    },
    {
      label: "Total Pipeline",
      value: formatCurrency(totalValue),
      color: "primary",
    },
    {
      label: "Avg Value",
      value: formatCurrency(totalValue / (items.length || 1)),
      color: "muted",
    },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Client" : "Add Client";
  const formDescription = isEditing
    ? `Update ${editingItem!.client_code}`
    : "Add a new client to your system.";
  const canSubmitForm = Boolean(form.companyName && form.contactName);

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateTypeFilter = (t: string) => setTypeFilter(t);
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

  const openEditForm = (cl: ClientApi) => {
    setEditingItem(cl);
    setForm(clientToForm(cl));
    setFormErrors({});
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ClientForm>(
    field: K,
    value: ClientForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitClientForm = () => {
    if (!form.companyName || !form.contactName) {
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
            toast.success(`${form.companyName} updated successfully`);
          },
          onError: (err) => {
            if (isValidationError(err)) {
              setFormErrors(mapBackendErrors(err.response.data.errors));
            }
            toast.error(
              isValidationError(err)
                ? err.response.data.message
                : "Failed to update client",
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
          toast.success(`${form.companyName} added successfully`);
        },
        onError: (err) => {
          if (isValidationError(err)) {
            setFormErrors(mapBackendErrors(err.response.data.errors));
          }
          toast.error(
            isValidationError(err)
              ? err.response.data.message
              : "Failed to create client",
          );
        },
      });
    }
  };

  // ── Delete ──
  const requestDeleteClient = (cl: ClientApi) => {
    deleteDialog.requestConfirm(String(cl.id), {
      title: `Delete ${cl.company_name}?`,
      description: `This will permanently remove client ${cl.client_code} and all associated data.`,
    });
  };

  const confirmDeleteClient = () => {
    deleteDialog.confirm((id) => {
      deleteMutation.mutate(Number(id), {
        onSuccess: () => toast.success("Client deleted"),
        onError: () => toast.error("Failed to delete client"),
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
    typeFilter,
    updateTypeFilter,
    clientTypes: CLIENT_TYPES,
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
    submitClientForm,
    // Delete
    deleteDialog,
    requestDeleteClient,
    confirmDeleteClient,
    isLoading,
    isError,
    isSubmitting,
    page,
    setPage,
    meta,
  };
}

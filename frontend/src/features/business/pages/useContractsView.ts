/* ═══════════════════════════════════════════════════════════════════════════
 * useContractsView — All state + logic for the Contracts listing page.
 *
 * Connects to Laravel backend via React Query + contractService.
 * Follows the golden-standard hook pattern (see useChemicalsView).
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
    useClientList, useContractList,
    useCreateContract,
    useDeleteContract,
    useUpdateContract
} from "@/features/business/services";
import { useConfirmDialog } from "@/shared/components/ConfirmDialog";
import type { Stat } from "@/shared/components/QuickStats";
import type { ViewMode } from "@/shared/components/ViewToggle";
import { formatCurrency } from "@/shared/lib/calculator";
import type { ContractApi, ContractPayload } from "@/shared/types";
import { isValidationError } from "@/shared/types/api-error";
import { CONTRACT_STATUSES, formatEnumLabel } from "@/shared/types/enums";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ContractForm {
  clientId: string;
  commonName: string;
  quantityOrdered: string;
  unitPrice: string;
  contractDate: string;
  deliveryDeadline: string;
  notes: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: ContractForm = {
  clientId: "",
  commonName: "",
  quantityOrdered: "",
  unitPrice: "",
  contractDate: "",
  deliveryDeadline: "",
  notes: "",
};

export { CONTRACT_STATUSES, formatEnumLabel };

// ─── Helpers ───────────────────────────────────────────────────────────────

function formToPayload(form: ContractForm): ContractPayload {
  return {
    client_id: Number(form.clientId) || 0,
    common_name: form.commonName,
    quantity_ordered: Number(form.quantityOrdered) || 0,
    unit_price: Number(form.unitPrice) || 0,
    contract_date: form.contractDate,
    delivery_deadline: form.deliveryDeadline,
    notes: form.notes || null,
  };
}

function contractToForm(item: ContractApi): ContractForm {
  return {
    clientId: String(item.client.id),
    commonName: item.common_name,
    quantityOrdered: String(item.quantities.quantity_ordered),
    unitPrice: String(item.quantities.unit_price),
    contractDate: item.dates.contract_date || "",
    deliveryDeadline: item.dates.delivery_deadline || "",
    notes: item.notes || "",
  };
}

// ─── Backend Error Field Map ────────────────────────────────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof ContractForm> = {
  client_id: "clientId",
  common_name: "commonName",
  quantity_ordered: "quantityOrdered",
  unit_price: "unitPrice",
  contract_date: "contractDate",
  delivery_deadline: "deliveryDeadline",
  notes: "notes",
};

type FormErrors = Partial<Record<keyof ContractForm, string>>;

function mapBackendErrors(errors: Record<string, string[]>): FormErrors {
  const mapped: FormErrors = {};
  for (const [key, msgs] of Object.entries(errors)) {
    const field = BACKEND_FIELD_MAP[key];
    if (field) mapped[field] = msgs[0];
  }
  return mapped;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useContractsView() {
  const navigate = useNavigate();

  // ── Data from backend (paginated) ──
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryParams: Record<string, unknown> = { page };
  if (searchQuery) queryParams.search = searchQuery;
  if (statusFilter !== "all") queryParams.status = statusFilter;

  const { data: response, isLoading, isError } = useContractList(queryParams);
  const { data: clientsResponse } = useClientList({ per_page: 100 });

  const items = response?.data ?? [];
  const meta = response?.meta;
  const availableClients = clientsResponse?.data ?? [];

  // ── Mutations ──
  const createMutation = useCreateContract();
  const updateMutation = useUpdateContract();
  const deleteMutation = useDeleteContract();

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContractApi | null>(null);
  const [form, setForm] = useState<ContractForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  // ── Derived state ──
  const filteredItems = items; // Server-side filtering

  const totalValue = items.reduce((s, c) => s + c.quantities.total_value, 0);
  const activeCount = items.filter(
    (c) => c.status === "signed" || c.status === "in_production",
  ).length;

  const quickStats: Stat[] = [
    { label: "Total", value: meta?.total ?? items.length, color: "primary" },
    { label: "Active", value: activeCount, color: "primary" },
    { label: "Revenue", value: formatCurrency(totalValue), color: "muted" },
    {
      label: "Delivered",
      value: items.filter((c) => c.status === "delivered").length,
      color: "muted",
    },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Contract" : "Create Contract";
  const formDescription = isEditing
    ? `Update ${editingItem!.contract_code}`
    : "Create a new seedling production contract.";

  const canSubmitForm = Boolean(
    form.clientId &&
    form.commonName &&
    form.quantityOrdered &&
    form.unitPrice &&
    form.deliveryDeadline,
  );

  const computedTotalValue = formatCurrency(
    (Number(form.quantityOrdered) || 0) * (Number(form.unitPrice) || 0),
  );

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateStatusFilter = (s: string) => setStatusFilter(s);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);
  const navigateToDetail = (id: number) =>
    navigate(`/business/contracts/${id}`);

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

  const openEditForm = (contract: ContractApi) => {
    setEditingItem(contract);
    setForm(contractToForm(contract));
    setFormErrors({});
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ContractForm>(
    field: K,
    value: ContractForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitContractForm = () => {
    if (!form.clientId || !form.commonName || !form.quantityOrdered) {
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
            toast.success(`Contract updated successfully`);
          },
          onError: (err) => {
            if (isValidationError(err)) {
              setFormErrors(mapBackendErrors(err.response.data.errors));
            }
            toast.error(
              isValidationError(err)
                ? err.response.data.message
                : "Failed to update contract",
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
          toast.success("Contract created successfully");
        },
        onError: (err) => {
          if (isValidationError(err)) {
            setFormErrors(mapBackendErrors(err.response.data.errors));
          }
          toast.error(
            isValidationError(err)
              ? err.response.data.message
              : "Failed to create contract",
          );
        },
      });
    }
  };

  // ── Delete ──
  const requestDeleteContract = (c: ContractApi) => {
    deleteDialog.requestConfirm(String(c.id), {
      title: `Delete contract ${c.contract_code}?`,
      description: `This will permanently remove this contract for ${c.client.company_name}.`,
    });
  };

  const confirmDeleteContract = () => {
    deleteDialog.confirm((id) => {
      deleteMutation.mutate(Number(id), {
        onSuccess: () => toast.success("Contract deleted"),
        onError: () => toast.error("Failed to delete contract"),
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
    statusOptions: CONTRACT_STATUSES,
    availableClients,
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
    computedTotalValue,
    openCreateForm,
    openEditForm,
    closeForm,
    updateFormField,
    submitContractForm,
    // Delete
    deleteDialog,
    requestDeleteContract,
    confirmDeleteContract,
    isLoading,
    isError,
    isSubmitting,
    page,
    setPage,
    meta,
  };
}

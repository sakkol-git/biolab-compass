/* ═══════════════════════════════════════════════════════════════════════════
 * usePaymentsView — All state + logic for the Payments listing page.
 *
 * Connects to Laravel backend via React Query + paymentService.
 * Follows the golden-standard hook pattern (see useChemicalsView).
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { toast } from "sonner";

import {
    useContractList, useCreatePayment,
    useDeletePayment,
    usePaymentList,
    useUpdatePayment
} from "@/features/business/services";
import { useConfirmDialog } from "@/shared/components/ConfirmDialog";
import type { Stat } from "@/shared/components/QuickStats";
import { formatCurrency } from "@/shared/lib/calculator";
import type { PaymentApi, PaymentPayload } from "@/shared/types";
import { isValidationError } from "@/shared/types/api-error";
import type { PaymentStatus, PaymentType } from "@/shared/types/enums";
import {
    PAYMENT_STATUSES,
    PAYMENT_TYPES,
    formatEnumLabel,
} from "@/shared/types/enums";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PaymentForm {
  contractId: string;
  amount: string;
  paymentType: string;
  dueDate: string;
  paymentDate: string;
  status: string;
  referenceNumber: string;
  notes: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: PaymentForm = {
  contractId: "",
  amount: "",
  paymentType: "deposit",
  dueDate: "",
  paymentDate: "",
  status: "pending",
  referenceNumber: "",
  notes: "",
};

export { PAYMENT_STATUSES, PAYMENT_TYPES, formatEnumLabel };

// ─── Helpers ───────────────────────────────────────────────────────────────

function formToPayload(form: PaymentForm): PaymentPayload {
  return {
    contract_id: Number(form.contractId) || 0,
    amount: Number(form.amount) || 0,
    payment_type: form.paymentType as PaymentType,
    status: form.status as PaymentStatus,
    due_date: form.dueDate,
    payment_date: form.paymentDate || null,
    reference_number: form.referenceNumber || null,
    notes: form.notes || null,
  };
}

function paymentToForm(item: PaymentApi): PaymentForm {
  return {
    contractId: String(item.contract_id),
    amount: String(item.amount),
    paymentType: item.payment_type,
    dueDate: item.due_date || "",
    paymentDate: item.payment_date || "",
    status: item.status,
    referenceNumber: item.reference_number || "",
    notes: item.notes || "",
  };
}

// ─── Backend Error Field Map ────────────────────────────────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof PaymentForm> = {
  contract_id: "contractId",
  amount: "amount",
  payment_type: "paymentType",
  due_date: "dueDate",
  payment_date: "paymentDate",
  status: "status",
  reference_number: "referenceNumber",
  notes: "notes",
};

type FormErrors = Partial<Record<keyof PaymentForm, string>>;

function mapBackendErrors(errors: Record<string, string[]>): FormErrors {
  const mapped: FormErrors = {};
  for (const [key, msgs] of Object.entries(errors)) {
    const field = BACKEND_FIELD_MAP[key];
    if (field) mapped[field] = msgs[0];
  }
  return mapped;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function usePaymentsView() {
  // ── Data from backend (paginated) ──
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const queryParams: Record<string, unknown> = { page };
  if (searchQuery) queryParams.search = searchQuery;
  if (statusFilter !== "all") queryParams.status = statusFilter;
  if (typeFilter !== "all") queryParams.payment_type = typeFilter;

  const { data: response, isLoading, isError } = usePaymentList(queryParams);
  const { data: contractsResponse } = useContractList({ per_page: 100 });

  const items = response?.data ?? [];
  const meta = response?.meta;
  const availableContracts = contractsResponse?.data ?? [];

  // ── Mutations ──
  const createMutation = useCreatePayment();
  const updateMutation = useUpdatePayment();
  const deleteMutation = useDeletePayment();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PaymentApi | null>(null);
  const [form, setForm] = useState<PaymentForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  // ── Derived state ──
  const filteredItems = items; // Server-side filtering

  const totalReceived = items
    .filter((p) => p.status === "received")
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = items
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);

  const quickStats: Stat[] = [
    {
      label: "Total Payments",
      value: meta?.total ?? items.length,
      color: "primary",
    },
    {
      label: "Received",
      value: formatCurrency(totalReceived),
      color: "primary",
    },
    { label: "Pending", value: formatCurrency(totalPending), color: "muted" },
    {
      label: "Overdue",
      value: items.filter((p) => p.status === "overdue").length,
      color: "muted",
    },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Payment" : "Add Payment";
  const formDescription = isEditing
    ? "Update payment details."
    : "Record a new payment or invoice.";
  const canSubmitForm = Boolean(
    form.contractId && form.amount && form.paymentType && form.dueDate,
  );

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateStatusFilter = (s: string) => setStatusFilter(s);
  const updateTypeFilter = (t: string) => setTypeFilter(t);

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

  const openEditForm = (payment: PaymentApi) => {
    setEditingItem(payment);
    setForm(paymentToForm(payment));
    setFormErrors({});
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof PaymentForm>(
    field: K,
    value: PaymentForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitPaymentForm = () => {
    if (!form.contractId || !form.amount || !form.dueDate) {
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
            toast.success("Payment updated successfully");
          },
          onError: (err) => {
            if (isValidationError(err)) {
              setFormErrors(mapBackendErrors(err.response.data.errors));
            }
            toast.error(
              isValidationError(err)
                ? err.response.data.message
                : "Failed to update payment",
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
          toast.success("Payment created successfully");
        },
        onError: (err) => {
          if (isValidationError(err)) {
            setFormErrors(mapBackendErrors(err.response.data.errors));
          }
          toast.error(
            isValidationError(err)
              ? err.response.data.message
              : "Failed to create payment",
          );
        },
      });
    }
  };

  // ── Delete ──
  const requestDeletePayment = (p: PaymentApi) => {
    deleteDialog.requestConfirm(String(p.id), {
      title: "Delete payment?",
      description: `This will permanently remove payment ${p.reference_number || `#${p.id}`}.`,
    });
  };

  const confirmDeletePayment = () => {
    deleteDialog.confirm((id) => {
      deleteMutation.mutate(Number(id), {
        onSuccess: () => toast.success("Payment deleted"),
        onError: () => toast.error("Failed to delete payment"),
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
    statusOptions: PAYMENT_STATUSES,
    typeFilter,
    updateTypeFilter,
    typeOptions: PAYMENT_TYPES,
    availableContracts,
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
    submitPaymentForm,
    // Delete
    deleteDialog,
    requestDeletePayment,
    confirmDeletePayment,
    isLoading,
    isError,
    isSubmitting,
    page,
    setPage,
    meta,
  };
}

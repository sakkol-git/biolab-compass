/* ═══════════════════════════════════════════════════════════════════════════
 * useLabServicesView — State + logic for the Lab Services page.
 *
 * API-backed via React Query (labServiceService).
 * Follows the golden hook standard: formToPayload, BACKEND_FIELD_MAP,
 * mapBackendErrors, useConfirmDialog for delete, quickStats as Stat[].
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    useCreateLabService,
    useDeleteLabService,
    useLabServiceList,
    useUpdateLabService,
} from "@/features/business/services";
import { useConfirmDialog } from "@/shared/components/ConfirmDialog";
import type { Stat } from "@/shared/components/QuickStats";
import type { ViewMode } from "@/shared/components/ViewToggle";
import type { LabServiceApi, LabServicePayload } from "@/shared/types";
import { isValidationError, mapBackendErrors } from "@/shared/types/api-error";
import {
    LAB_SERVICE_STATUSES,
    SERVICE_PAYMENT_STATUSES,
} from "@/shared/types/enums";
import { useMemo, useState } from "react";
import { toast } from "sonner";

// ── Form shape (all strings for controlled inputs) ───────────────────────

export interface LabServiceForm {
  serviceTitle: string;
  serviceDescription: string;
  clientName: string;
  clientContact: string;
  status: string;
  paymentStatus: string;
  startDate: string;
  endDate: string;
  serviceFee: string;
  assignedStaff: string; // comma-separated
}

const EMPTY_FORM: LabServiceForm = {
  serviceTitle: "",
  serviceDescription: "",
  clientName: "",
  clientContact: "",
  status: "pending",
  paymentStatus: "unpaid",
  startDate: "",
  endDate: "",
  serviceFee: "",
  assignedStaff: "",
};

// ── Backend field → form field mapping for 422 errors ────────────────────

const BACKEND_FIELD_MAP: Record<string, keyof LabServiceForm> = {
  service_title: "serviceTitle",
  service_description: "serviceDescription",
  client_name: "clientName",
  client_contact: "clientContact",
  status: "status",
  payment_status: "paymentStatus",
  start_date: "startDate",
  end_date: "endDate",
  service_fee: "serviceFee",
  assigned_staff: "assignedStaff",
};

// ── Status color maps (exported for LabServices.tsx) ─────────────────────

export const STATUS_COLORS: Record<string, string> = {
  pending: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  in_progress: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  completed:
    "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  delivered:
    "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
};

export const PAYMENT_COLORS: Record<string, string> = {
  unpaid: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950",
  partial: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  paid: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
};

// ── Converters ───────────────────────────────────────────────────────────

function formToPayload(f: LabServiceForm): LabServicePayload {
  return {
    service_title: f.serviceTitle.trim(),
    service_description: f.serviceDescription.trim() || null,
    client_name: f.clientName.trim(),
    client_contact: f.clientContact.trim() || null,
    status: f.status as LabServicePayload["status"],
    payment_status: f.paymentStatus as LabServicePayload["payment_status"],
    start_date: f.startDate || null,
    end_date: f.endDate || null,
    service_fee: f.serviceFee ? Number(f.serviceFee) : undefined,
    assigned_staff: f.assignedStaff
      ? f.assignedStaff
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined,
  };
}

function serviceToForm(item: LabServiceApi): LabServiceForm {
  return {
    serviceTitle: item.service_title,
    serviceDescription: item.service_description ?? "",
    clientName: item.client_name,
    clientContact: item.client_contact ?? "",
    status: item.status,
    paymentStatus: item.payment_status,
    startDate: item.start_date ?? "",
    endDate: item.end_date ?? "",
    serviceFee: item.service_fee?.toString() ?? "",
    assignedStaff: item.assigned_staff?.join(", ") ?? "",
  };
}

// ═════════════════════════════════════════════════════════════════════════
// HOOK
// ═════════════════════════════════════════════════════════════════════════

export function useLabServicesView() {
  // ── View state ──
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // ── Form state ──
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<LabServiceForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof LabServiceForm, string>>
  >({});

  // ── API queries & mutations ──
  const queryParams = {
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
  };
  const { data: listData, isLoading, isError } = useLabServiceList(queryParams);
  const createMut = useCreateLabService();
  const updateMut = useUpdateLabService();
  const deleteMut = useDeleteLabService();

  const items = listData?.data ?? [];

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  // ── Filtered items (client-side search on top of server-side) ──
  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (i) =>
        i.service_title.toLowerCase().includes(q) ||
        i.client_name.toLowerCase().includes(q) ||
        i.service_code.toLowerCase().includes(q) ||
        (i.service_description ?? "").toLowerCase().includes(q),
    );
  }, [items, searchQuery]);

  // ── Quick stats ──
  const quickStats: Stat[] = [
    { label: "Total Services", value: items.length, color: "primary" },
    {
      label: "Pending",
      value: items.filter((i) => i.status === "pending").length,
      color: "warning",
    },
    {
      label: "In Progress",
      value: items.filter((i) => i.status === "in_progress").length,
      color: "primary",
    },
    {
      label: "Completed",
      value: items.filter(
        (i) => i.status === "completed" || i.status === "delivered",
      ).length,
      color: "primary",
    },
  ];

  const totalRevenue = items.reduce((sum, i) => sum + (i.service_fee ?? 0), 0);
  const paidRevenue = items
    .filter((i) => i.payment_status === "paid")
    .reduce((sum, i) => sum + (i.service_fee ?? 0), 0);

  // ── Form helpers ──
  const updateFormField = <K extends keyof LabServiceForm>(
    key: K,
    value: LabServiceForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (formErrors[key])
      setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setFormOpen(true);
  };

  const openEditForm = (item: LabServiceApi) => {
    setEditingId(item.id);
    setForm(serviceToForm(item));
    setFormErrors({});
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormErrors({});
  };

  const isEditing = editingId !== null;
  const isSubmitting = createMut.isPending || updateMut.isPending;
  const canSubmitForm =
    form.serviceTitle.trim() !== "" && form.clientName.trim() !== "";

  const formTitle = isEditing ? "Edit Lab Service" : "New Lab Service";
  const formDescription = isEditing
    ? "Update service details."
    : "Create a new lab service request.";

  const handleSave = async () => {
    const payload = formToPayload(form);
    try {
      if (editingId) {
        await updateMut.mutateAsync({ id: editingId, payload });
        toast.success(`Service "${form.serviceTitle}" updated`);
      } else {
        await createMut.mutateAsync(payload);
        toast.success(`Lab service "${form.serviceTitle}" created`);
      }
      closeForm();
    } catch (err) {
      if (isValidationError(err)) {
        setFormErrors(
          mapBackendErrors<keyof LabServiceForm>(err, BACKEND_FIELD_MAP),
        );
        toast.error("Please fix the highlighted errors");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  // ── Delete flow ──
  const requestDeleteService = (item: LabServiceApi) => {
    deleteDialog.requestConfirm(item.id, {
      title: `Delete ${item.service_title}?`,
      description: `This will permanently remove service ${item.service_code}.`,
    });
  };

  const confirmDeleteService = () => {
    deleteDialog.confirm(async (id) => {
      try {
        await deleteMut.mutateAsync(id as number);
        toast.success("Lab service deleted");
      } catch {
        toast.error("Failed to delete lab service");
      }
    });
  };

  // ── Option arrays ──
  const statusOptions = LAB_SERVICE_STATUSES as readonly string[];
  const paymentStatusOptions = SERVICE_PAYMENT_STATUSES as readonly string[];

  return {
    // View
    viewMode,
    setViewMode,
    searchQuery,
    updateSearchQuery: setSearchQuery,
    statusFilter,
    updateStatusFilter: setStatusFilter,

    // Data
    items,
    filteredItems,
    quickStats,
    totalRevenue,
    paidRevenue,
    isLoading,
    isError,

    // Form
    formOpen,
    editingId,
    isEditing,
    form,
    formErrors,
    updateFormField,
    openCreateForm,
    openEditForm,
    closeForm,
    handleSave,
    formTitle,
    formDescription,
    canSubmitForm,
    isSubmitting,

    // Delete
    deleteDialog,
    requestDeleteService,
    confirmDeleteService,

    // Options
    statusOptions,
    paymentStatusOptions,
  } as const;
}

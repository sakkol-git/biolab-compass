/* ═══════════════════════════════════════════════════════════════════════════
 * useLabServicesView — State + logic for the Lab Services page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Stat } from "@/components/shared/QuickStats";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { labServicesData } from "@/data/mockLabServiceData";
import { usePersistedState } from "@/lib/persistence";
import {
    collectErrors,
    type FieldErrors,
    isValid,
    required,
    sanitizeForm,
    throttleSubmit,
} from "@/lib/validation";
import type {
    LabService,
    LabServiceStatus,
    ServicePaymentStatus,
} from "@/types/business";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export interface LabServiceForm {
  serviceTitle: string;
  clientName: string;
  clientContact: string;
  serviceDescription: string;
  assignedStaff: string;
  startDate: string;
  endDate: string;
  status: LabServiceStatus;
  resultSummary: string;
  serviceFee: string;
  paymentStatus: ServicePaymentStatus;
  notes: string;
}

const EMPTY_FORM: LabServiceForm = {
  serviceTitle: "",
  clientName: "",
  clientContact: "",
  serviceDescription: "",
  assignedStaff: "",
  startDate: "",
  endDate: "",
  status: "Pending",
  resultSummary: "",
  serviceFee: "",
  paymentStatus: "Unpaid",
  notes: "",
};

export const STATUS_COLORS: Record<string, string> = {
  Pending: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  "In Progress": "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  Completed:
    "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  Delivered:
    "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
};

export const PAYMENT_COLORS: Record<string, string> = {
  Unpaid: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950",
  Partial: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  Paid: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
};

export function useLabServicesView() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LabServiceForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<
    FieldErrors<keyof LabServiceForm>
  >({});
  const [items, setItems] = usePersistedState<LabService[]>(
    "lab_services",
    labServicesData,
  );

  // ── Delete confirmation ──
  const deleteDialog = useConfirmDialog();

  const filteredItems = useMemo(() => {
    let result = items;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.serviceTitle.toLowerCase().includes(q) ||
          i.clientName.toLowerCase().includes(q) ||
          i.serviceCode.toLowerCase().includes(q) ||
          i.serviceDescription.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((i) => i.status === statusFilter);
    }
    return result;
  }, [items, searchQuery, statusFilter]);

  const stats: Stat[] = [
    { label: "Total Services", value: items.length, color: "primary" },
    {
      label: "Pending",
      value: items.filter((i) => i.status === "Pending").length,
      color: "warning",
    },
    {
      label: "In Progress",
      value: items.filter((i) => i.status === "In Progress").length,
      color: "primary",
    },
    {
      label: "Completed",
      value: items.filter(
        (i) => i.status === "Completed" || i.status === "Delivered",
      ).length,
      color: "primary",
    },
  ];

  const totalRevenue = items.reduce((sum, i) => sum + (i.serviceFee ?? 0), 0);
  const paidRevenue = items
    .filter((i) => i.paymentStatus === "Paid")
    .reduce((sum, i) => sum + (i.serviceFee ?? 0), 0);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditForm = (item: LabService) => {
    setEditingId(item.id);
    setForm({
      serviceTitle: item.serviceTitle,
      clientName: item.clientName,
      clientContact: item.clientContact ?? "",
      serviceDescription: item.serviceDescription,
      assignedStaff: item.assignedStaff.join(", "),
      startDate: item.startDate ?? "",
      endDate: item.endDate ?? "",
      status: item.status,
      resultSummary: item.resultSummary ?? "",
      serviceFee: item.serviceFee?.toString() ?? "",
      paymentStatus: item.paymentStatus,
      notes: item.notes ?? "",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    const throttleErr = throttleSubmit("lab_service_form", 1000);
    if (throttleErr) {
      toast.error(throttleErr);
      return;
    }

    const clean = sanitizeForm(form);
    const errors = collectErrors<keyof LabServiceForm>({
      serviceTitle: required(clean.serviceTitle, "Service title"),
      clientName: required(clean.clientName, "Client name"),
      serviceDescription: required(clean.serviceDescription, "Description"),
      clientContact: undefined,
      assignedStaff: undefined,
      startDate: undefined,
      endDate: undefined,
      status: undefined,
      resultSummary: undefined,
      serviceFee: undefined,
      paymentStatus: undefined,
      notes: undefined,
    });
    if (!isValid(errors)) {
      setFormErrors(errors);
      toast.error("Please fix the highlighted errors");
      return;
    }
    setFormErrors({});

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                serviceTitle: clean.serviceTitle,
                clientName: clean.clientName,
                clientContact: clean.clientContact || undefined,
                serviceDescription: clean.serviceDescription,
                assignedStaff: clean.assignedStaff
                  ? clean.assignedStaff.split(",").map((s) => s.trim())
                  : [],
                startDate: clean.startDate || undefined,
                endDate: clean.endDate || undefined,
                status: clean.status,
                resultSummary: clean.resultSummary || undefined,
                serviceFee: clean.serviceFee
                  ? Number(clean.serviceFee)
                  : undefined,
                paymentStatus: clean.paymentStatus,
                notes: clean.notes || undefined,
              }
            : item,
        ),
      );
      toast.success(`Service "${clean.serviceTitle}" updated`);
    } else {
      const newId = `SVC-${String(items.length + 1).padStart(3, "0")}`;
      setItems((prev) => [
        ...prev,
        {
          id: newId,
          serviceCode: newId,
          serviceTitle: clean.serviceTitle,
          clientName: clean.clientName,
          clientContact: clean.clientContact || undefined,
          serviceDescription: clean.serviceDescription,
          assignedStaff: clean.assignedStaff
            ? clean.assignedStaff.split(",").map((s) => s.trim())
            : [],
          startDate: clean.startDate || undefined,
          endDate: clean.endDate || undefined,
          status: clean.status,
          resultSummary: clean.resultSummary || undefined,
          serviceFee: clean.serviceFee ? Number(clean.serviceFee) : undefined,
          paymentStatus: clean.paymentStatus,
          notes: clean.notes || undefined,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      toast.success(`Lab service "${clean.serviceTitle}" created`);
    }
    setDialogOpen(false);
  };

  const requestDeleteService = (item: LabService) => {
    deleteDialog.requestConfirm(item.id, {
      title: `Delete ${item.serviceTitle}?`,
      description: `This will permanently remove service ${item.serviceCode}.`,
    });
  };

  const confirmDeleteService = () => {
    deleteDialog.confirm((id) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Lab service deleted");
    });
  };

  return {
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dialogOpen,
    setDialogOpen,
    editingId,
    form,
    formErrors,
    setForm,
    items,
    filteredItems,
    stats,
    totalRevenue,
    paidRevenue,
    openCreateForm,
    openEditForm,
    handleSave,
    deleteDialog,
    requestDeleteService,
    confirmDeleteService,
  } as const;
}

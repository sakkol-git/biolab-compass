/* ═══════════════════════════════════════════════════════════════════════════
 * useLabServicesView — State + logic for the Lab Services page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import type { Stat } from "@/components/shared/QuickStats";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { labServicesData } from "@/data/mockLabServiceData";
import { toast } from "@/hooks/use-toast";
import type {
    LabService,
    LabServiceStatus,
    ServicePaymentStatus,
} from "@/types/business";
import { useMemo, useState } from "react";

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
  const [items, setItems] = useState<LabService[]>(labServicesData);

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
    if (!form.serviceTitle || !form.clientName || !form.serviceDescription) {
      toast({
        title: "Error",
        description: "Please fill required fields",
        variant: "destructive",
      });
      return;
    }
    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                serviceTitle: form.serviceTitle,
                clientName: form.clientName,
                clientContact: form.clientContact || undefined,
                serviceDescription: form.serviceDescription,
                assignedStaff: form.assignedStaff
                  ? form.assignedStaff.split(",").map((s) => s.trim())
                  : [],
                startDate: form.startDate || undefined,
                endDate: form.endDate || undefined,
                status: form.status,
                resultSummary: form.resultSummary || undefined,
                serviceFee: form.serviceFee
                  ? Number(form.serviceFee)
                  : undefined,
                paymentStatus: form.paymentStatus,
                notes: form.notes || undefined,
              }
            : item,
        ),
      );
      toast({
        title: "Updated",
        description: `Service "${form.serviceTitle}" updated`,
      });
    } else {
      const newId = `SVC-${String(items.length + 1).padStart(3, "0")}`;
      setItems((prev) => [
        ...prev,
        {
          id: newId,
          serviceCode: newId,
          serviceTitle: form.serviceTitle,
          clientName: form.clientName,
          clientContact: form.clientContact || undefined,
          serviceDescription: form.serviceDescription,
          assignedStaff: form.assignedStaff
            ? form.assignedStaff.split(",").map((s) => s.trim())
            : [],
          startDate: form.startDate || undefined,
          endDate: form.endDate || undefined,
          status: form.status,
          resultSummary: form.resultSummary || undefined,
          serviceFee: form.serviceFee ? Number(form.serviceFee) : undefined,
          paymentStatus: form.paymentStatus,
          notes: form.notes || undefined,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      toast({
        title: "Created",
        description: `Lab service "${form.serviceTitle}" created`,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "Lab service removed" });
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
    setForm,
    items,
    filteredItems,
    stats,
    totalRevenue,
    paidRevenue,
    openCreateForm,
    openEditForm,
    handleSave,
    handleDelete,
  } as const;
}

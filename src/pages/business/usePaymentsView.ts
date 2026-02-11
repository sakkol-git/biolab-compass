/* ═══════════════════════════════════════════════════════════════════════════
 * usePaymentsView — All state + logic for the Payments page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { paymentsData as initialPayments, contractsData } from "@/data/mockBusinessData";
import { formatCurrency } from "@/lib/calculator";
import { useCRUD } from "@/hooks/useCRUD";
import { ID_GENERATORS } from "@/lib/idGenerator";
import type { PaymentStatus, PaymentType, Payment } from "@/types/business";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface PaymentForm {
  contractId: string;
  amount: number;
  paymentType: PaymentType;
  paymentMethod: string;
  dueDate: string;
  paymentDate: string;
  status: PaymentStatus;
  referenceNumber: string;
  notes: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: PaymentForm = {
  contractId: "", amount: 0, paymentType: "Deposit", paymentMethod: "",
  dueDate: "", paymentDate: "", status: "Pending", referenceNumber: "", notes: "",
};

const STATUS_OPTIONS: PaymentStatus[] = ["Received", "Pending", "Overdue", "Cancelled"];
const TYPE_OPTIONS: PaymentType[] = ["Deposit", "Milestone", "Final", "Refund"];

// ─── Hook ──────────────────────────────────────────────────────────────────

export function usePaymentsView() {
  const paymentsCRUD = useCRUD<Payment>({
    entityName: "payment",
    idGenerator: ID_GENERATORS.payment,
    toastMessages: {
      created: (p) => `Payment ${p.id} created`,
      updated: (p) => `Payment ${p.referenceNumber} updated`,
    },
    onBeforeCreate: (dto) => {
      const contract = contractsData.find((c) => c.id === (dto as any).contractId);
      if (!contract) return {};
      return { contractCode: contract.contractCode, clientName: contract.clientName, currency: "USD" };
    },
    onBeforeUpdate: (_id, dto) => {
      const contract = contractsData.find((c) => c.id === (dto as any).contractId);
      if (!contract) return {};
      return { contractCode: contract.contractCode, clientName: contract.clientName };
    },
  }, initialPayments);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Payment | null>(null);
  const [form, setForm] = useState<PaymentForm>(EMPTY_FORM);

  // ── Derived ──
  const payments = paymentsCRUD.items;

  const filteredPayments = payments.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.clientName.toLowerCase().includes(q) || p.contractCode.toLowerCase().includes(q) || p.referenceNumber.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    const matchesType = typeFilter === "all" || p.paymentType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const kpiStats = useMemo(() => {
    const totalReceived = payments.filter((p) => p.status === "Received").reduce((s, p) => s + p.amount, 0);
    const totalPending = payments.filter((p) => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
    const receivedCount = payments.filter((p) => p.status === "Received").length;
    const pendingCount = payments.filter((p) => p.status === "Pending").length;
    const grandTotal = totalReceived + totalPending;
    const collectionRate = grandTotal > 0 ? ((totalReceived / grandTotal) * 100).toFixed(0) : "0";

    return {
      totalReceived, totalPending, receivedCount, pendingCount,
      grandTotal, collectionRate,
      formatted: {
        totalReceived: formatCurrency(totalReceived),
        totalPending: formatCurrency(totalPending),
        grandTotal: formatCurrency(grandTotal),
      },
    };
  }, [payments]);

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Payment" : "Add Payment";
  const formDescription = isEditing ? "Update payment details." : "Record a new payment or invoice.";
  const canSubmitForm = Boolean(
    form.contractId && form.amount && form.paymentType && form.paymentMethod && form.dueDate && form.status,
  );

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateStatusFilter = (s: string) => setStatusFilter(s);
  const updateTypeFilter = (t: string) => setTypeFilter(t);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (payment: Payment) => {
    setEditingItem(payment);
    setForm({
      contractId: payment.contractId, amount: payment.amount,
      paymentType: payment.paymentType, paymentMethod: payment.paymentMethod,
      dueDate: payment.dueDate, paymentDate: payment.paymentDate || "",
      status: payment.status, referenceNumber: payment.referenceNumber, notes: payment.notes,
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof PaymentForm>(field: K, value: PaymentForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitPaymentForm = () => {
    if (editingItem) {
      paymentsCRUD.update(editingItem.id, form);
    } else {
      paymentsCRUD.create(form as any);
    }
    setFormOpen(false);
    setForm(EMPTY_FORM);
    setEditingItem(null);
  };

  return {
    filteredPayments, totalCount: payments.length, kpiStats,
    searchQuery, updateSearchQuery,
    statusFilter, updateStatusFilter, statusOptions: STATUS_OPTIONS,
    typeFilter, updateTypeFilter, typeOptions: TYPE_OPTIONS,
    availableContracts: contractsData,
    formOpen, isEditing, formTitle, formDescription, form, canSubmitForm,
    openCreateForm, openEditForm, closeForm, updateFormField, submitPaymentForm,
  };
}

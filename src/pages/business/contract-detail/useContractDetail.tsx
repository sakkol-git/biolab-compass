// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT DETAIL — Data Loading Hook (Phase 3)
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Receipt,
  Sprout,
  DollarSign,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Circle,
  Calendar,
  FileText,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  contractStatusStyles,
  paymentStatusStyles,
  milestoneStatusStyles,
  statusBadge,
} from "@/lib/status-styles";
import {
  contractsData,
  contractMilestonesData,
  paymentsData,
  clientsData,
} from "@/data/mockBusinessData";
import { formatCurrency } from "@/lib/calculator";
import type { ContractPageConfig, DetailSection, MilestoneRow, PaymentRow } from "./types";
import { progressBarClass, CONTRACT_ICON_COLOR, buildActions } from "./domain";

// ─── Milestone Status Icons ──────────────────────────────────────────────

const milestoneIcon = (status: string): React.ReactNode => {
  switch (status) {
    case "Completed":
      return React.createElement(CheckCircle2, { className: "h-4 w-4 text-emerald-600" });
    case "On Track":
      return React.createElement(Circle, { className: "h-4 w-4 text-primary" });
    case "At Risk":
      return React.createElement(AlertTriangle, { className: "h-4 w-4 text-amber-500" });
    case "Pending":
      return React.createElement(Clock, { className: "h-4 w-4 text-muted-foreground" });
    case "Missed":
      return React.createElement(AlertTriangle, { className: "h-4 w-4 text-destructive" });
    default:
      return React.createElement(Clock, { className: "h-4 w-4 text-muted-foreground" });
  }
};

// ─── Config Assembly ─────────────────────────────────────────────────────

function assembleConfig(
  contractId: string
): ContractPageConfig | null {
  const contract = contractsData.find((c) => c.id === contractId);
  if (!contract) return null;

  const milestones = contractMilestonesData[contractId] || [];
  const payments = paymentsData.filter((p) => p.contractId === contractId);
  const client = clientsData.find((cl) => cl.id === contract.clientId);

  const totalPaid = payments
    .filter((p) => p.status === "Received")
    .reduce((s, p) => s + p.amount, 0);
  const totalPending = payments
    .filter((p) => p.status === "Pending")
    .reduce((s, p) => s + p.amount, 0);

  // ── Build milestone rows ──
  const milestoneRows: MilestoneRow[] = milestones.map((ms) => ({
    id: ms.id,
    statusIcon: milestoneIcon(ms.status),
    milestoneName: ms.milestoneName,
    targetDate: ms.targetDate,
    actualDate: ms.actualDate || null,
    projectedCount: ms.projectedCount,
    actualCount: ms.actualCount ?? null,
    statusBadge: React.createElement(
      "span",
      { className: cn(statusBadge(milestoneStatusStyles, ms.status, false)) },
      ms.status
    ),
  }));

  // ── Build payment rows ──
  const paymentRows: PaymentRow[] = payments.map((pay) => ({
    id: pay.id,
    paymentType: pay.paymentType,
    amount: formatCurrency(pay.amount),
    paymentMethod: pay.paymentMethod,
    dueDate: pay.dueDate,
    paymentDate: pay.paymentDate || null,
    statusBadge: React.createElement(
      "span",
      { className: cn(statusBadge(paymentStatusStyles, pay.status, false)) },
      pay.status
    ),
    notes: pay.notes,
  }));

  // ── Main sections ──
  const mainSections: DetailSection[] = [];

  if (milestoneRows.length > 0) {
    mainSections.push({
      kind: "milestones" as const,
      title: "Milestones",
      icon: Target,
      rows: milestoneRows,
    });
  }

  if (paymentRows.length > 0) {
    mainSections.push({
      kind: "payments" as const,
      title: "Payments",
      icon: DollarSign,
      headerAction: React.createElement(
        "div",
        { className: "flex items-center gap-4 text-xs font-medium" },
        React.createElement("span", { className: "text-emerald-600" }, `Paid: ${formatCurrency(totalPaid)}`),
        React.createElement("span", { className: "text-amber-600" }, `Pending: ${formatCurrency(totalPending)}`)
      ),
      rows: paymentRows,
    });
  }

  if (milestoneRows.length === 0 && paymentRows.length === 0) {
    mainSections.push({
      kind: "empty-activity" as const,
      title: "Activity",
      icon: Calendar,
    });
  }

  // ── Sidebar sections ──
  const sidebarSections: DetailSection[] = [
    {
      kind: "contract-details" as const,
      title: "Contract Details",
      icon: FileText,
      fields: [
        { label: "Contract Date", value: contract.contractDate },
        { label: "Delivery Deadline", value: contract.deliveryDeadline },
        ...(contract.actualDeliveryDate
          ? [{ label: "Actual Delivery", value: contract.actualDeliveryDate }]
          : []),
        { label: "Terms", value: contract.terms },
        { label: "Managed By", value: contract.managedBy },
      ],
    },
  ];

  if (client) {
    sidebarSections.push({
      kind: "client-info" as const,
      title: "Client Information",
      icon: Building2,
      fields: [
        { label: "Company", value: client.companyName },
        { label: "Contact", value: client.contactName },
        { label: "Email", value: client.email },
        { label: "Phone", value: client.phone },
        { label: "Type", value: client.clientType },
        { label: "Address", value: client.address },
      ],
    });
  }

  sidebarSections.push({
    kind: "species-info" as const,
    title: "Species",
    icon: Sprout,
    fields: [
      { label: "Common Name", value: contract.commonName },
      { label: "Scientific Name", value: contract.speciesName },
    ],
  });

  return {
    header: {
      backTo: "/business/contracts",
      backLabel: "Contracts",
      icon: Receipt,
      iconColor: CONTRACT_ICON_COLOR,
      title: contract.contractCode,
      subtitle: `${contract.clientName} — ${contract.commonName} (${contract.speciesName})`,
      id: contract.contractCode,
    },
    valueBanner: {
      totalValue: formatCurrency(contract.totalValue),
      currency: contract.currency,
      deliveredLabel: `${contract.quantityDelivered.toLocaleString()} / ${contract.quantityOrdered.toLocaleString()}`,
      progressPct: contract.progressPct,
      progressBarClass: progressBarClass(contract.progressPct),
      deadline: contract.deliveryDeadline,
    },
    kpiStrip: [
      { label: "Qty Ordered", value: contract.quantityOrdered.toLocaleString(), icon: Sprout, color: "hsl(145, 63%, 32%)" },
      { label: "Qty Delivered", value: contract.quantityDelivered.toLocaleString(), icon: TrendingUp, color: "hsl(175, 65%, 35%)" },
      { label: "Unit Price", value: formatCurrency(contract.unitPrice), icon: DollarSign, color: "hsl(38, 92%, 50%)" },
      { label: "Paid", value: formatCurrency(totalPaid), icon: CheckCircle2, color: "hsl(145, 63%, 32%)" },
      { label: "Pending", value: formatCurrency(totalPending), icon: Clock, color: "hsl(38, 92%, 50%)" },
      { label: "Progress", value: `${contract.progressPct}%`, icon: Target, color: "hsl(210, 60%, 50%)" },
    ],
    actions: buildActions(),
    statusBadge: React.createElement(
      "span",
      { className: cn(statusBadge(contractStatusStyles, contract.status)) },
      contract.status
    ),
    mainSections,
    sidebarSections,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────

export type UseContractDetailResult =
  | { state: "loading"; id: string | undefined; config: null }
  | { state: "not-found"; id: string | undefined; config: null }
  | { state: "ready"; id: string; config: ContractPageConfig };

export function useContractDetail(): UseContractDetailResult {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [id]);

  const config = useMemo(
    () => (id ? assembleConfig(id) : null),
    [id, loading] // eslint-disable-line react-hooks/exhaustive-deps
  );

  if (loading) return { state: "loading", id, config: null };
  if (!config) return { state: "not-found", id, config: null };
  return { state: "ready", id: id!, config };
}

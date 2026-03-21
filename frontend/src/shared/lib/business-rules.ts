/* ═══════════════════════════════════════════════════════════════════════════
 * business-rules — Contract, payment, and stock reservation business logic.
 *
 * Addresses: BL-006, BL-007, BL-008
 * ═══════════════════════════════════════════════════════════════════════════ */

import type {
    Contract,
    ContractMilestone,
    ContractStatus,
    MilestoneStatus,
    Payment,
} from "@/features/business/types";

// ─── BL-006: Auto-calculate contract status from milestones ─────────────────

export function calculateContractStatus(
  milestones: ContractMilestone[],
  currentStatus: ContractStatus,
): ContractStatus {
  if (milestones.length === 0) return currentStatus;
  if (currentStatus === "Cancelled" || currentStatus === "Delivered")
    return currentStatus;

  const allCompleted = milestones.every((m) => m.status === "Completed");
  const anyMissed = milestones.some((m) => m.status === "Missed");
  const anyAtRisk = milestones.some((m) => m.status === "At Risk");

  if (allCompleted) return "Ready";
  if (anyMissed || anyAtRisk) return "In Production"; // flagged
  return currentStatus;
}

export function calculateProgressPct(milestones: ContractMilestone[]): number {
  if (milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.status === "Completed").length;
  return Math.round((completed / milestones.length) * 100);
}

export function getMilestoneWarnings(
  milestones: ContractMilestone[],
): string[] {
  const warnings: string[] = [];
  const today = new Date();
  for (const m of milestones) {
    if (m.status === "Missed") {
      warnings.push(`Milestone "${m.milestoneName}" was missed`);
    }
    if (m.status === "At Risk") {
      warnings.push(`Milestone "${m.milestoneName}" is at risk`);
    }
    if (
      m.status === "Pending" &&
      m.targetDate &&
      new Date(m.targetDate) < today
    ) {
      warnings.push(`Milestone "${m.milestoneName}" is overdue`);
    }
  }
  return warnings;
}

// ─── BL-007: Payment validation against contract ────────────────────────────

export function getTotalPayments(
  payments: Payment[],
  contractId: string,
): number {
  return payments
    .filter((p) => p.contractId === contractId && p.status !== "Cancelled")
    .reduce((sum, p) => sum + p.amount, 0);
}

export type PaymentBalanceStatus = "Unpaid" | "Partial" | "Paid" | "Overpaid";

export function getPaymentBalanceStatus(
  totalPaid: number,
  contractValue: number,
): PaymentBalanceStatus {
  if (totalPaid <= 0) return "Unpaid";
  if (totalPaid < contractValue) return "Partial";
  if (totalPaid === contractValue) return "Paid";
  return "Overpaid";
}

export function validatePaymentAmount(
  newPaymentAmount: number,
  existingPayments: Payment[],
  contract: Contract,
): string | undefined {
  if (newPaymentAmount <= 0) return "Payment amount must be positive";
  const totalPaid = getTotalPayments(existingPayments, contract.id);
  const remaining = contract.totalValue - totalPaid;
  if (newPaymentAmount > remaining) {
    return `Payment of $${newPaymentAmount.toLocaleString()} exceeds remaining balance of $${remaining.toLocaleString()}`;
  }
  return undefined;
}

// ─── BL-008: Stock reservation checks ───────────────────────────────────────

export interface StockReservation {
  speciesName: string;
  totalAvailable: number;
  totalReserved: number;
  availableForContracts: number;
}

export function calculateStockReservation(
  speciesName: string,
  totalStock: number,
  activeContracts: Contract[],
): StockReservation {
  const reserved = activeContracts
    .filter(
      (c) =>
        c.speciesName === speciesName &&
        c.status !== "Cancelled" &&
        c.status !== "Delivered",
    )
    .reduce((sum, c) => sum + (c.quantityOrdered - c.quantityDelivered), 0);

  return {
    speciesName,
    totalAvailable: totalStock,
    totalReserved: reserved,
    availableForContracts: Math.max(0, totalStock - reserved),
  };
}

export function validateContractQuantity(
  requestedQuantity: number,
  availableStock: number,
  reservedStock: number,
): string | undefined {
  const available = availableStock - reservedStock;
  if (requestedQuantity > available) {
    return `Insufficient stock: ${requestedQuantity} requested but only ${available} available (${reservedStock} reserved by other contracts)`;
  }
  return undefined;
}

// ─── Milestone Status Helper ────────────────────────────────────────────────

export function inferMilestoneStatus(
  targetDate: string,
  actualCount: number | undefined,
  projectedCount: number,
): MilestoneStatus {
  const today = new Date();
  const target = new Date(targetDate);

  if (actualCount !== undefined && actualCount >= projectedCount)
    return "Completed";
  if (
    target < today &&
    (actualCount === undefined || actualCount < projectedCount)
  )
    return "Missed";
  if (
    actualCount !== undefined &&
    actualCount < projectedCount * 0.7 &&
    target > today
  ) {
    return "At Risk";
  }
  if (target > today) return "On Track";
  return "Pending";
}

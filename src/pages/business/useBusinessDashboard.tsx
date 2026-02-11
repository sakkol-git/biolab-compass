// ═══════════════════════════════════════════════════════════════════════════
// useBusinessDashboard — Logic Extraction Hook (Phase 3)
// ═══════════════════════════════════════════════════════════════════════════
//
// Owns ALL data fetching, computation, and configuration assembly.
// The UI layer receives a fully-formed `BusinessDashboardConfig` and
// does zero computation of its own.
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import {
  BarChart3, DollarSign, Receipt, Handshake, TrendingUp,
  Package, Target, PieChart as PieChartIcon,
} from "lucide-react";
import { contractsData, clientsData, paymentsData } from "@/data/mockBusinessData";
import { formatCurrency } from "@/lib/calculator";
import type { BusinessDashboardConfig, PaymentRow } from "./types";
import type { PaymentStatus } from "@/types/business";

// ─── Explicit Return Type ──────────────────────────────────────────────────

export interface UseBusinessDashboardResult {
  config: BusinessDashboardConfig;
}

// ─── Pure Helper Functions (no side effects) ───────────────────────────────

function buildDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function computeKpiStats() {
  const activeContracts = contractsData.filter((c) =>
    ["Signed", "In Production", "Ready"].includes(c.status)
  ).length;

  const totalDelivered = contractsData.filter((c) => c.status === "Delivered").length;

  const totalRevenue = paymentsData
    .filter((p) => p.status === "Received")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = paymentsData
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const overduePayments = paymentsData
    .filter((p) => p.status === "Overdue")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalContractValue = contractsData.reduce((sum, c) => sum + c.totalValue, 0);

  const pendingInvoiceCount = paymentsData.filter((p) => p.status === "Pending").length;

  const denominatorForRate = totalRevenue + pendingPayments + overduePayments;
  const collectionRate = denominatorForRate > 0
    ? (totalRevenue / denominatorForRate) * 100
    : 0;

  return {
    activeContracts,
    totalDelivered,
    totalRevenue,
    pendingPayments,
    totalContractValue,
    pendingInvoiceCount,
    collectionRate,
    totalClients: clientsData.length,
  };
}

function buildRevenueByClientType() {
  const aggregated: Record<string, number> = {};
  clientsData.forEach((cl) => {
    aggregated[cl.clientType] = (aggregated[cl.clientType] ?? 0) + cl.totalValue;
  });
  return Object.entries(aggregated).map(([label, value]) => ({ label, value }));
}

function buildPaymentStatusDistribution() {
  const statuses: PaymentStatus[] = ["Pending", "Received", "Overdue", "Cancelled"];
  return statuses
    .map((status) => {
      const matching = paymentsData.filter((p) => p.status === status);
      return {
        name: status,
        value: matching.length,
        amount: matching.reduce((sum, p) => sum + p.amount, 0),
      };
    })
    .filter((slice) => slice.value > 0);
}

function buildContractValueBySpecies() {
  const aggregated: Record<string, number> = {};
  contractsData.forEach((c) => {
    aggregated[c.commonName] = (aggregated[c.commonName] ?? 0) + c.totalValue;
  });
  return Object.entries(aggregated).map(([label, value]) => ({ label, value }));
}

function buildRecentPayments(count: number): PaymentRow[] {
  return paymentsData.slice(0, count).map((p) => ({
    id: p.id,
    contractId: p.contractId,
    paymentDate: p.paymentDate,
    paymentMethod: p.paymentMethod,
    status: p.status,
    amount: p.amount,
  }));
}

const currencyAxisFormatter = (v: number) => `$${(v / 1000).toFixed(0)}k`;

const PAYMENT_COLORS: Record<string, string> = {
  Pending: "hsl(40, 96%, 50%)",
  Received: "hsl(145, 63%, 42%)",
  Overdue: "hsl(0, 72%, 51%)",
  Cancelled: "hsl(0, 0%, 60%)",
};

// ─── The Hook ──────────────────────────────────────────────────────────────

export function useBusinessDashboard(): UseBusinessDashboardResult {
  const config = useMemo<BusinessDashboardConfig>(() => {
    const kpis = computeKpiStats();

    const recentContracts = [...contractsData]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);

    const topClients = [...clientsData]
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 4);

    return {
      // ── Page Header ──
      header: {
        icon: BarChart3,
        title: "Business Overview",
        subtitle:
          "Contract pipeline, revenue tracking, and client management for seedling production.",
        dateLabel: buildDateLabel(),
      },

      // ── Global (above tabs) ──
      globalWidgets: [
        {
          type: "kpi-row",
          stats: [
            {
              title: "Active Contracts",
              value: kpis.activeContracts,
              subtitle: `${kpis.totalDelivered} delivered`,
              icon: <Receipt className="h-4 w-4 text-primary" />,
              trend: { value: 18, label: "this quarter", positive: true },
            },
            {
              title: "Revenue Received",
              value: formatCurrency(kpis.totalRevenue),
              subtitle: "Collected to date",
              icon: <DollarSign className="h-4 w-4 text-primary" />,
              trend: { value: 24, label: "vs last quarter", positive: true },
            },
            {
              title: "Pipeline Value",
              value: formatCurrency(kpis.totalContractValue),
              subtitle: `${contractsData.length} total contracts`,
              icon: <TrendingUp className="h-4 w-4 text-primary" />,
            },
            {
              title: "Pending Payments",
              value: formatCurrency(kpis.pendingPayments),
              subtitle: `${kpis.pendingInvoiceCount} invoices`,
              icon: <Target className="h-4 w-4 text-primary" />,
            },
            {
              title: "Collection Rate",
              value: `${kpis.collectionRate.toFixed(0)}%`,
              subtitle: "Revenue efficiency",
              icon: <PieChartIcon className="h-4 w-4 text-primary" />,
            },
            {
              title: "Total Clients",
              value: kpis.totalClients,
              subtitle: "Active client base",
              icon: <Handshake className="h-4 w-4 text-primary" />,
              trend: { value: 2, label: "new this month", positive: true },
            },
          ],
        },
      ],

      // ── Tabs ──
      tabs: [
        {
          id: "overview",
          label: "Overview",
          icon: BarChart3,
          widgets: [
            {
              type: "pipeline",
              title: "Contract Pipeline",
              navigateTo: "/business/contracts",
              contracts: contractsData,
            },
            {
              type: "contract-grid",
              title: "Recent Contracts",
              navigateTo: "/business/contracts",
              contracts: recentContracts,
            },
            {
              type: "client-ranking",
              title: "Top Clients",
              clients: topClients,
            },
            {
              type: "quick-links",
              links: [
                {
                  title: "Production Planner",
                  description: "Forecast production timelines",
                  icon: Package,
                  url: "/business/production",
                },
                {
                  title: "Clients",
                  description: "Manage client relationships",
                  icon: Handshake,
                  url: "/business/clients",
                },
                {
                  title: "Payments",
                  description: "Track invoices and payments",
                  icon: DollarSign,
                  url: "/business/payments",
                },
              ],
            },
          ],
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: TrendingUp,
          widgets: [
            {
              type: "bar-chart",
              title: "Revenue by Client Type",
              data: buildRevenueByClientType(),
              fill: "hsl(var(--primary))",
              formatValue: formatCurrency,
              yAxisFormatter: currencyAxisFormatter,
            },
            {
              type: "pie-chart",
              title: "Payment Status Distribution",
              data: buildPaymentStatusDistribution(),
              colors: PAYMENT_COLORS,
              formatValue: formatCurrency,
            },
            {
              type: "bar-chart",
              title: "Contract Value by Species",
              data: buildContractValueBySpecies(),
              fill: "hsl(175, 65%, 35%)",
              formatValue: formatCurrency,
              yAxisFormatter: currencyAxisFormatter,
            },
            {
              type: "payment-list",
              title: "Recent Payments",
              payments: buildRecentPayments(6),
            },
            {
              type: "contracts-table",
              title: "All Contracts",
              contracts: contractsData,
            },
          ],
        },
      ],
    };
  }, []);

  return { config };
}

// ═══════════════════════════════════════════════════════════════════════════
// useBusinessDashboard — Logic Extraction Hook (Phase 4: Live API)
// ═══════════════════════════════════════════════════════════════════════════
//
// Fetches ALL data via the service layer (React Query).
// Returns a fully-formed `BusinessDashboardConfig` plus loading state.
// Zero mock data.
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useMemo } from "react";
import {
  BarChart3, DollarSign, Receipt, Handshake, TrendingUp,
  Package, Target, PieChart as PieChartIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  useContractStats,
  useContractList,
} from "@/features/business/services";
import { useClientList, useClientStats } from "@/features/business/services";
import { usePaymentList, usePaymentStats } from "@/features/business/services";
import { mapContract, mapClient, mapPayment, toTitleCase } from "@/shared/lib/api-mappers";
import { formatCurrency } from "@/shared/lib/calculator";
import type { BusinessDashboardConfig, PaymentRow } from "./types";

// ─── Explicit Return Type ──────────────────────────────────────────────────

export interface UseBusinessDashboardResult {
  config: BusinessDashboardConfig | null;
  isLoading: boolean;
}

// ─── Pure Helpers ──────────────────────────────────────────────────────────

function buildDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const currencyAxisFormatter = (v: number) => `$${(v / 1000).toFixed(0)}k`;

const PAYMENT_COLORS: Record<string, string> = {
  Pending: "hsl(40, 96%, 50%)",
  Received: "hsl(145, 63%, 42%)",
  Overdue: "hsl(0, 72%, 51%)",
  Cancelled: "hsl(0, 0%, 60%)",
  pending: "hsl(40, 96%, 50%)",
  received: "hsl(145, 63%, 42%)",
  overdue: "hsl(0, 72%, 51%)",
  cancelled: "hsl(0, 0%, 60%)",
};

// ─── The Hook ──────────────────────────────────────────────────────────────

export function useBusinessDashboard(): UseBusinessDashboardResult {
  // ── API Queries ──────────────────────────────────────────────
  const { data: contractStats, isLoading: csLoading, error: csError } = useContractStats();
  const { data: contractsPage, isLoading: conLoading } = useContractList({ per_page: 100 });
  const { data: clientsPage, isLoading: cliLoading } = useClientList({ per_page: 100 });
  const { data: clientStats } = useClientStats();
  const { data: paymentsPage, isLoading: payLoading } = usePaymentList({ per_page: 100 });
  const { data: paymentStats } = usePaymentStats();

  const isLoading = csLoading || conLoading || cliLoading || payLoading;

  useEffect(() => {
    if (csError) toast.error("Failed to load contract statistics");
  }, [csError]);

  const config = useMemo<BusinessDashboardConfig | null>(() => {
    if (isLoading || !contractStats) return null;

    // Map API → display types
    const contracts = (contractsPage?.data ?? []).map(mapContract);
    const clients = (clientsPage?.data ?? []).map(mapClient);
    const payments = (paymentsPage?.data ?? []).map(mapPayment);

    // ── KPIs from stats ──────────────────────────────────────
    const totalRevenue = paymentStats?.total_received ?? 0;
    const pendingPayments = paymentStats?.total_pending ?? 0;
    const overdueCount = paymentStats?.overdue_count ?? 0;
    const totalContractValue = contractStats.total_revenue + contractStats.total_pending;
    const collectionRate =
      totalRevenue + pendingPayments > 0
        ? (totalRevenue / (totalRevenue + pendingPayments)) * 100
        : 0;
    const totalClients = clientStats?.total_clients ?? clients.length;

    const recentContracts = [...contracts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4);

    const topClients = [...clients]
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 4);

    // ── Revenue by client type ──────────────────────────────
    const revenueByType: Record<string, number> = {};
    clients.forEach((cl) => {
      revenueByType[cl.clientType] = (revenueByType[cl.clientType] ?? 0) + cl.totalValue;
    });
    const revenueByClientType = Object.entries(revenueByType).map(([label, value]) => ({ label, value }));

    // ── Payment status distribution ─────────────────────────
    const payStatusCounts: Record<string, { count: number; amount: number }> = {};
    payments.forEach((p) => {
      const entry = payStatusCounts[p.status] ?? { count: 0, amount: 0 };
      entry.count += 1;
      entry.amount += p.amount;
      payStatusCounts[p.status] = entry;
    });
    const paymentStatusDist = Object.entries(payStatusCounts)
      .filter(([, v]) => v.count > 0)
      .map(([name, v]) => ({ name, value: v.count, amount: v.amount }));

    // ── Contract value by species ───────────────────────────
    const valueBySpecies: Record<string, number> = {};
    contracts.forEach((c) => {
      const key = c.commonName || "Unknown";
      valueBySpecies[key] = (valueBySpecies[key] ?? 0) + c.totalValue;
    });
    const contractValueBySpecies = Object.entries(valueBySpecies).map(([label, value]) => ({ label, value }));

    // ── Recent payments for table ───────────────────────────
    const recentPayments: PaymentRow[] = payments.slice(0, 6).map((p) => ({
      id: p.id,
      contractId: p.contractId,
      paymentDate: p.paymentDate,
      paymentMethod: p.paymentMethod,
      status: p.status,
      amount: p.amount,
    }));

    return {
      header: {
        icon: BarChart3,
        title: "Business Overview",
        subtitle: "Contract pipeline, revenue tracking, and client management for seedling production.",
        dateLabel: buildDateLabel(),
      },

      globalWidgets: [
        {
          type: "kpi-row",
          stats: [
            {
              title: "Active Contracts",
              value: contractStats.active_contracts,
              subtitle: `${contractStats.total_contracts} total`,
              icon: <Receipt className="h-4 w-4 text-primary" />,
            },
            {
              title: "Revenue Received",
              value: formatCurrency(totalRevenue),
              subtitle: "Collected to date",
              icon: <DollarSign className="h-4 w-4 text-primary" />,
            },
            {
              title: "Pipeline Value",
              value: formatCurrency(totalContractValue),
              subtitle: `${contractStats.total_contracts} total contracts`,
              icon: <TrendingUp className="h-4 w-4 text-primary" />,
            },
            {
              title: "Pending Payments",
              value: formatCurrency(pendingPayments),
              subtitle: `${overdueCount} overdue`,
              icon: <Target className="h-4 w-4 text-primary" />,
            },
            {
              title: "Collection Rate",
              value: `${collectionRate.toFixed(0)}%`,
              subtitle: "Revenue efficiency",
              icon: <PieChartIcon className="h-4 w-4 text-primary" />,
            },
            {
              title: "Total Clients",
              value: totalClients,
              subtitle: "Active client base",
              icon: <Handshake className="h-4 w-4 text-primary" />,
            },
          ],
        },
      ],

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
              contracts,
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
              data: revenueByClientType,
              fill: "hsl(var(--primary))",
              formatValue: formatCurrency,
              yAxisFormatter: currencyAxisFormatter,
            },
            {
              type: "pie-chart",
              title: "Payment Status Distribution",
              data: paymentStatusDist,
              colors: PAYMENT_COLORS,
              formatValue: formatCurrency,
            },
            {
              type: "bar-chart",
              title: "Contract Value by Species",
              data: contractValueBySpecies,
              fill: "hsl(175, 65%, 35%)",
              formatValue: formatCurrency,
              yAxisFormatter: currencyAxisFormatter,
            },
            {
              type: "payment-list",
              title: "Recent Payments",
              payments: recentPayments,
            },
            {
              type: "contracts-table",
              title: "All Contracts",
              contracts,
            },
          ],
        },
      ],
    };
  }, [isLoading, contractStats, contractsPage, clientsPage, clientStats, paymentsPage, paymentStats]);

  return { config, isLoading };
}

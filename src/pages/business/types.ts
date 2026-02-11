// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS DASHBOARD — Type Contracts (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════
//
// Every UI block on the Business dashboard is described by a discriminated
// union member. The rendering engine never knows about specific widgets —
// it only reads the `type` discriminant and delegates to the registry.
// ═══════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Contract, Client, Payment, PaymentStatus } from "@/types/business";

// ─── Atomic Data Shapes ────────────────────────────────────────────────────

export interface KpiStat {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  trend?: { value: number; label: string; positive: boolean };
}

export interface QuickLink {
  title: string;
  description: string;
  icon: LucideIcon;
  url: string;
}

export interface BarChartDataPoint {
  label: string;
  value: number;
}

export interface PieSlice {
  name: string;
  value: number;
  amount: number;
}

export interface PaymentRow {
  id: string;
  contractId: string;
  paymentDate: string;
  paymentMethod: string;
  status: PaymentStatus;
  amount: number;
}

// ─── Widget Configurations (Discriminated Union) ───────────────────────────

export interface KpiRowWidget {
  type: "kpi-row";
  stats: KpiStat[];
}

export interface PipelineWidget {
  type: "pipeline";
  title: string;
  navigateTo: string;
  contracts: Contract[];
}

export interface ContractGridWidget {
  type: "contract-grid";
  title: string;
  navigateTo: string;
  contracts: Contract[];
}

export interface ClientRankingWidget {
  type: "client-ranking";
  title: string;
  clients: Client[];
}

export interface QuickLinksWidget {
  type: "quick-links";
  links: QuickLink[];
}

export interface BarChartWidget {
  type: "bar-chart";
  title: string;
  data: BarChartDataPoint[];
  fill: string;
  formatValue: (value: number) => string;
  yAxisFormatter?: (value: number) => string;
}

export interface PieChartWidget {
  type: "pie-chart";
  title: string;
  data: PieSlice[];
  colors: Record<string, string>;
  formatValue: (value: number) => string;
}

export interface PaymentListWidget {
  type: "payment-list";
  title: string;
  payments: PaymentRow[];
}

export interface ContractsTableWidget {
  type: "contracts-table";
  title: string;
  contracts: Contract[];
}

// ─── The Union ─────────────────────────────────────────────────────────────

export type DashboardWidget =
  | KpiRowWidget
  | PipelineWidget
  | ContractGridWidget
  | ClientRankingWidget
  | QuickLinksWidget
  | BarChartWidget
  | PieChartWidget
  | PaymentListWidget
  | ContractsTableWidget;

// ─── Tab Layout ────────────────────────────────────────────────────────────

export interface DashboardTab {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Widgets rendered in document order within the tab */
  widgets: DashboardWidget[];
}

// ─── Page Header ───────────────────────────────────────────────────────────

export interface DashboardHeader {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  dateLabel: string;
}

// ─── Full Page Configuration ───────────────────────────────────────────────

export interface BusinessDashboardConfig {
  header: DashboardHeader;
  /** Widgets rendered above the tabs (e.g. KPI row) */
  globalWidgets: DashboardWidget[];
  tabs: DashboardTab[];
}

// ═══════════════════════════════════════════════════════════════════════════
// WIDGET REGISTRY — Polymorphism Over Conditionals (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════
//
// Maps every DashboardWidget['type'] discriminant to its renderer component.
// TypeScript enforces exhaustiveness: adding a new union member without
// registering it here produces a compile-time error.
// ═══════════════════════════════════════════════════════════════════════════

import type { ComponentType } from "react";
import type {
  DashboardWidget,
  KpiRowWidget,
  PipelineWidget,
  ContractGridWidget,
  ClientRankingWidget,
  QuickLinksWidget,
  BarChartWidget,
  PieChartWidget,
  PaymentListWidget,
  ContractsTableWidget,
} from "./types";

import KpiRowRenderer from "./widgets/KpiRowRenderer";
import PipelineRenderer from "./widgets/PipelineRenderer";
import ContractGridRenderer from "./widgets/ContractGridRenderer";
import ClientRankingRenderer from "./widgets/ClientRankingRenderer";
import QuickLinksRenderer from "./widgets/QuickLinksRenderer";
import BarChartRenderer from "./widgets/BarChartRenderer";
import PieChartRenderer from "./widgets/PieChartRenderer";
import PaymentListRenderer from "./widgets/PaymentListRenderer";
import ContractsTableRenderer from "./widgets/ContractsTableRenderer";

// ─── Type-safe mapping: widget type → component expecting `{ config: T }` ──

type WidgetRendererMap = {
  [K in DashboardWidget["type"]]: ComponentType<{
    config: Extract<DashboardWidget, { type: K }>;
  }>;
};

/**
 * The single source of truth for widget → renderer mapping.
 *
 * Adding a new member to `DashboardWidget` without a corresponding
 * entry here will cause a TypeScript error on `satisfies`.
 */
export const WIDGET_REGISTRY: WidgetRendererMap = {
  "kpi-row": KpiRowRenderer,
  "pipeline": PipelineRenderer,
  "contract-grid": ContractGridRenderer,
  "client-ranking": ClientRankingRenderer,
  "quick-links": QuickLinksRenderer,
  "bar-chart": BarChartRenderer,
  "pie-chart": PieChartRenderer,
  "payment-list": PaymentListRenderer,
  "contracts-table": ContractsTableRenderer,
} satisfies WidgetRendererMap;

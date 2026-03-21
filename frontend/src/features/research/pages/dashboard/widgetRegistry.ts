// ═══════════════════════════════════════════════════════════════════════════
// WIDGET REGISTRY — Polymorphism Over Conditionals (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════
//
// Maps every ResearchWidget['type'] discriminant to its renderer component.
// TypeScript enforces exhaustiveness: adding a new union member without
// registering it here produces a compile-time error via `satisfies`.
// ═══════════════════════════════════════════════════════════════════════════

import type { ComponentType } from "react";
import type { ResearchWidget } from "./types";

import KpiRowRenderer from "./widgets/KpiRowRenderer";
import RecentExperimentsRenderer from "./widgets/RecentExperimentsRenderer";
import StatusPieRenderer from "./widgets/StatusPieRenderer";
import TopSpeciesRenderer from "./widgets/TopSpeciesRenderer";
import GrowthStageRenderer from "./widgets/GrowthStageRenderer";
import QuickLinksRenderer from "./widgets/QuickLinksRenderer";
import BarChartRenderer from "./widgets/BarChartRenderer";
import HealthScoreGridRenderer from "./widgets/HealthScoreGridRenderer";
import SpeciesTableRenderer from "./widgets/SpeciesTableRenderer";

// ─── Type-safe mapping: widget type → component expecting `{ config: T }` ──

type WidgetRendererMap = {
  [K in ResearchWidget["type"]]: ComponentType<{
    config: Extract<ResearchWidget, { type: K }>;
  }>;
};

/**
 * The single source of truth for widget → renderer mapping.
 *
 * Adding a new member to `ResearchWidget` without a corresponding
 * entry here will cause a TypeScript error on `satisfies`.
 */
export const WIDGET_REGISTRY: WidgetRendererMap = {
  "kpi-row": KpiRowRenderer,
  "recent-experiments": RecentExperimentsRenderer,
  "status-pie": StatusPieRenderer,
  "top-species": TopSpeciesRenderer,
  "growth-stage": GrowthStageRenderer,
  "quick-links": QuickLinksRenderer,
  "bar-chart": BarChartRenderer,
  "health-score-grid": HealthScoreGridRenderer,
  "species-table": SpeciesTableRenderer,
} satisfies WidgetRendererMap;

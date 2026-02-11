// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH DASHBOARD — Type Contracts (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════
//
// Every UI block on the Research Dashboard is described by a discriminated
// union member. The rendering engine reads the `type` discriminant and
// delegates to the registry — zero knowledge of implementations.
// ═══════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Experiment, SpeciesGrowthProfile } from "@/types/research";

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
  count?: number;
}

export interface StatusSlice {
  name: string;
  value: number;
  fill: string;
}

export interface BarChartDataPoint {
  label: string;
  value: number;
}

export interface HealthScoreEntry {
  experimentId: string;
  experimentCode: string;
  commonName: string;
  score: number;
}

export interface StageCount {
  stage: string;
  count: number;
}

// ─── Widget Configurations (Discriminated Union) ───────────────────────────

/** KPI summary row rendered above the tabs */
export interface KpiRowWidget {
  type: "kpi-row";
  stats: KpiStat[];
}

/** Recent experiments list with status badges */
export interface RecentExperimentsWidget {
  type: "recent-experiments";
  title: string;
  navigateTo: string;
  experiments: Experiment[];
}

/** Experiment status donut chart */
export interface StatusPieWidget {
  type: "status-pie";
  title: string;
  data: StatusSlice[];
}

/** Top species ranked by multiplication rate */
export interface TopSpeciesWidget {
  type: "top-species";
  title: string;
  species: SpeciesGrowthProfile[];
}

/** Growth stage distribution */
export interface GrowthStageWidget {
  type: "growth-stage";
  title: string;
  stages: StageCount[];
}

/** Navigational quick-access cards */
export interface QuickLinksWidget {
  type: "quick-links";
  links: QuickLink[];
}

/** Bar chart for analytics comparisons */
export interface BarChartWidget {
  type: "bar-chart";
  title: string;
  titleIcon: LucideIcon;
  data: BarChartDataPoint[];
  fill: string;
  yAxisDomain?: [number | string, number | string];
  formatValue: (value: number) => string;
  valueLabel: string;
}

/** Health score grid for experiment cards */
export interface HealthScoreGridWidget {
  type: "health-score-grid";
  title: string;
  titleIcon: LucideIcon;
  entries: HealthScoreEntry[];
}

/** Species performance data table */
export interface SpeciesTableWidget {
  type: "species-table";
  title: string;
  profiles: SpeciesGrowthProfile[];
}

// ─── The Union ─────────────────────────────────────────────────────────────

export type ResearchWidget =
  | KpiRowWidget
  | RecentExperimentsWidget
  | StatusPieWidget
  | TopSpeciesWidget
  | GrowthStageWidget
  | QuickLinksWidget
  | BarChartWidget
  | HealthScoreGridWidget
  | SpeciesTableWidget;

// ─── Tab Layout ────────────────────────────────────────────────────────────

export interface DashboardTab {
  id: string;
  label: string;
  icon: LucideIcon;
  /** Widgets rendered in document order within the tab */
  widgets: ResearchWidget[];
}

// ─── Page Header ───────────────────────────────────────────────────────────

export interface DashboardHeader {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  dateLabel: string;
}

// ─── Full Page Configuration ───────────────────────────────────────────────

export interface ResearchDashboardConfig {
  header: DashboardHeader;
  /** Widgets rendered above the tabs (e.g. KPI row) */
  globalWidgets: ResearchWidget[];
  tabs: DashboardTab[];
}

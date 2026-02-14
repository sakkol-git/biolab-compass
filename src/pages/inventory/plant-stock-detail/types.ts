// ═══════════════════════════════════════════════════════════════════════════
// PLANT STOCK DETAIL — Domain Types & Configuration Contracts (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════
//
// Mirrors the Equipment/Species type architecture exactly:
// - Shared atomic shapes (KpiStat, InfoField, ActionButton, etc.)
// - Closed discriminated union for every renderable section
// - Page-level config that bundles header + hero + KPI + sections
// - Registry contract enforced via `satisfies`
// ═══════════════════════════════════════════════════════════════════════════

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type {
    ActionButton,
    DetailHeaderConfig,
    HeroImageConfig, InfoField, KpiStat
} from "@/components/detail/detail-types";

import type {
    ActionButton,
    DetailHeaderConfig,
    HeroImageConfig,
    InfoField,
    KpiStat,
} from "@/components/detail/detail-types";

// ─── Domain-Specific Data Shapes ─────────────────────────────────────────

export interface GrowthMilestone {
  date: string;
  event: string;
}

export interface EnvironmentalReading {
  date: string;
  temp: string;
  humidity: string;
  light: string;
}

// ─── Section Configurations (Discriminated Union) ────────────────────────

export interface BatchInfoSection {
  readonly kind: "batch-info";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
  statusBadge: ReactNode;
  notes: string | null;
}

export interface HealthScoreSection {
  readonly kind: "health-score";
  title: string;
  icon: LucideIcon;
  score: number;
  description: string;
}

export interface GrowthMilestonesSection {
  readonly kind: "growth-milestones";
  title: string;
  icon: LucideIcon;
  milestones: GrowthMilestone[];
}

export interface EnvironmentalLogSection {
  readonly kind: "environmental-log";
  title: string;
  icon: LucideIcon;
  readings: EnvironmentalReading[];
}

export interface ParentSpeciesSection {
  readonly kind: "parent-species";
  title: string;
  icon: LucideIcon;
  commonName: string;
  scientificName: string;
  href: string;
}

export interface QuickInfoSection {
  readonly kind: "quick-info";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export type DetailSection =
  | BatchInfoSection
  | HealthScoreSection
  | GrowthMilestonesSection
  | EnvironmentalLogSection
  | ParentSpeciesSection
  | QuickInfoSection;

// ─── Page-Level Configuration ────────────────────────────────────────────

export interface StockPageConfig {
  header: DetailHeaderConfig;
  heroImage: HeroImageConfig | null;
  kpiStrip: KpiStat[];
  actions: ActionButton[];
  mainSections: DetailSection[];
  sidebarSections: DetailSection[];
}

// ─── Registry Contract ───────────────────────────────────────────────────

export type SectionRendererMap = {
  [K in DetailSection["kind"]]: React.ComponentType<{
    section: Extract<DetailSection, { kind: K }>;
  }>;
};

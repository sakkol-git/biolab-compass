// ═══════════════════════════════════════════════════════════════════════════
// PLANT SPECIES DETAIL — Domain Types & Configuration Contracts (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════
//
// Mirrors the Equipment Detail type architecture exactly:
// - Shared atomic shapes (KpiStat, InfoField, ActionButton, etc.)
// - Closed discriminated union for every renderable section
// - Page-level config that bundles header + hero + KPI + sections
// - Registry contract enforced via `satisfies`
// ═══════════════════════════════════════════════════════════════════════════

import type { LucideIcon } from "lucide-react";

export type {
  KpiStat,
  InfoField,
  ActionButton,
  DetailHeaderConfig,
  HeroImageConfig,
} from "@/components/detail/detail-types";

import type {
  KpiStat,
  InfoField,
  ActionButton,
  DetailHeaderConfig,
  HeroImageConfig,
} from "@/components/detail/detail-types";

// ─── Domain-Specific Data Shapes ─────────────────────────────────────────

export interface BatchEntry {
  id: string;
  stage: string;
  quantity: number;
  location: string;
  startDate: string;
}

// ─── Section Configurations (Discriminated Union) ────────────────────────

export interface BotanicalDescriptionSection {
  readonly kind: "botanical-description";
  title: string;
  icon: LucideIcon;
  description: string;
  fields: InfoField[];
}

export interface AssociatedBatchesSection {
  readonly kind: "associated-batches";
  title: string;
  icon: LucideIcon;
  batches: BatchEntry[];
  viewAllHref: string;
}

export interface CareRequirementsSection {
  readonly kind: "care-requirements";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface TagsSection {
  readonly kind: "tags";
  title: string;
  icon: LucideIcon;
  tags: string[];
}

export type DetailSection =
  | BotanicalDescriptionSection
  | AssociatedBatchesSection
  | CareRequirementsSection
  | TagsSection;

// ─── Page-Level Configuration ────────────────────────────────────────────

export interface SpeciesPageConfig {
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

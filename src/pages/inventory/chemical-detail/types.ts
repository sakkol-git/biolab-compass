// ═══════════════════════════════════════════════════════════════════════════
// CHEMICAL DETAIL — Domain Types & Configuration Contracts (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════
//
// Mirrors the Equipment/Species/Batch type architecture exactly:
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

export interface UsageRecord {
  date: string;
  user: string;
  amountUsed: string;
  purpose: string;
}

// ─── Section Configurations (Discriminated Union) ────────────────────────

export interface ChemicalPropertiesSection {
  readonly kind: "chemical-properties";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface SafetyHazardSection {
  readonly kind: "safety-hazard";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
  ghsTags: string[];
  notes: string | null;
}

export interface UsageRecordsSection {
  readonly kind: "usage-records";
  title: string;
  icon: LucideIcon;
  records: UsageRecord[];
}

export interface StorageRequirementsSection {
  readonly kind: "storage-requirements";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface SupplierDetailsSection {
  readonly kind: "supplier-details";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface DatesSection {
  readonly kind: "dates";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export type DetailSection =
  | ChemicalPropertiesSection
  | SafetyHazardSection
  | UsageRecordsSection
  | StorageRequirementsSection
  | SupplierDetailsSection
  | DatesSection;

// ─── Page-Level Configuration ────────────────────────────────────────────

export interface ChemicalPageConfig {
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

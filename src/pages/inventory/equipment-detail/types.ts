// ═══════════════════════════════════════════════════════════════════════════
// EQUIPMENT DETAIL — Domain Types & Configuration Contracts (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════
//
// Types ARE the architecture.
//
// This file defines the closed-world discriminated union for every
// renderable section on the Equipment Detail page. The union is
// exhaustive: adding a new section type here will cause compile-time
// errors in the registry and renderer until fully implemented.
//
// Zero runtime dispatch. Zero optional props (unless semantically optional).
// ═══════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
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

export interface SpecificationEntry {
  label: string;
  value: string;
}

export interface MaintenanceRecord {
  date: string;
  type: string;
  technician: string;
  notes: string;
  cost: string;
}

export interface UsageRecord {
  date: string;
  user: string;
  duration: string;
  purpose: string;
}

export interface StatusAlert {
  icon: LucideIcon;
  borderClass: string;
  bgClass: string;
  title: ReactNode;
  subtitle: string;
}

// ─── Section Configurations (Discriminated Union) ────────────────────────

export interface SpecificationsSection {
  readonly kind: "specifications";
  title: string;
  icon: LucideIcon;
  coreFields: InfoField[];
  specifications: SpecificationEntry[];
}

export interface MaintenanceHistorySection {
  readonly kind: "maintenance-history";
  title: string;
  icon: LucideIcon;
  records: MaintenanceRecord[];
}

export interface UsageLogSection {
  readonly kind: "usage-log";
  title: string;
  icon: LucideIcon;
  records: UsageRecord[];
}

export interface FinancialSection {
  readonly kind: "financial";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface LocationStatusSection {
  readonly kind: "location-status";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface NotesSection {
  readonly kind: "notes";
  title: string;
  icon: LucideIcon;
  content: string;
}

export type DetailSection =
  | SpecificationsSection
  | MaintenanceHistorySection
  | UsageLogSection
  | FinancialSection
  | LocationStatusSection
  | NotesSection;

// ─── Page-Level Configuration ────────────────────────────────────────────

export interface EquipmentPageConfig {
  header: DetailHeaderConfig;
  heroImage: HeroImageConfig | null;
  kpiStrip: KpiStat[];
  alerts: StatusAlert[];
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

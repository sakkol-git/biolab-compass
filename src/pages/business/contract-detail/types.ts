// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT DETAIL — Domain Types & Configuration Contracts (Phase 1)
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
} from "@/components/detail/detail-types";

// ─── Domain-Specific Data Shapes ─────────────────────────────────────────

export interface MilestoneRow {
  id: string;
  statusIcon: ReactNode;
  milestoneName: string;
  targetDate: string;
  actualDate: string | null;
  projectedCount: number;
  actualCount: number | null;
  statusBadge: ReactNode;
}

export interface PaymentRow {
  id: string;
  paymentType: string;
  amount: string;
  paymentMethod: string;
  dueDate: string;
  paymentDate: string | null;
  statusBadge: ReactNode;
  notes: string;
}

export interface ValueBannerConfig {
  totalValue: string;
  currency: string;
  deliveredLabel: string;
  progressPct: number;
  progressBarClass: string;
  deadline: string;
}

// ─── Section Configurations (Discriminated Union) ────────────────────────

export interface MilestonesSection {
  readonly kind: "milestones";
  title: string;
  icon: LucideIcon;
  rows: MilestoneRow[];
}

export interface PaymentsSection {
  readonly kind: "payments";
  title: string;
  icon: LucideIcon;
  headerAction: ReactNode;
  rows: PaymentRow[];
}

export interface ContractDetailsSection {
  readonly kind: "contract-details";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface ClientInfoSection {
  readonly kind: "client-info";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface SpeciesInfoSection {
  readonly kind: "species-info";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface EmptyActivitySection {
  readonly kind: "empty-activity";
  title: string;
  icon: LucideIcon;
}

export type DetailSection =
  | MilestonesSection
  | PaymentsSection
  | ContractDetailsSection
  | ClientInfoSection
  | SpeciesInfoSection
  | EmptyActivitySection;

// ─── Page-Level Configuration ────────────────────────────────────────────

export interface ContractPageConfig {
  header: DetailHeaderConfig;
  valueBanner: ValueBannerConfig;
  kpiStrip: KpiStat[];
  actions: ActionButton[];
  statusBadge: ReactNode;
  mainSections: DetailSection[];
  sidebarSections: DetailSection[];
}

// ─── Registry Contract ───────────────────────────────────────────────────

export type SectionRendererMap = {
  [K in DetailSection["kind"]]: React.ComponentType<{
    section: Extract<DetailSection, { kind: K }>;
  }>;
};

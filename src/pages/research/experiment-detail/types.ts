// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAIL — Domain Types & Configuration Contracts (Phase 1)
// ═══════════════════════════════════════════════════════════════════════════
//
// Mirrors Chemical/Contract type architecture exactly:
// - Shared atomic shapes (KpiStat, InfoField, ActionButton, etc.)
// - Closed discriminated union for every renderable section
// - Page-level config that bundles header + hero + KPI + sections
// - Registry contract enforced via `satisfies`
//
// UNIQUE to ExperimentDetail:
// - Interactive form state (showLogForm, handleAddLog, logs)
//   lives in the hook and is passed via the config's section data.
// - GrowthChart & GrowthLogForm are referenced as opaque blobs
//   of data; the renderers instantiate the actual components.
// ═══════════════════════════════════════════════════════════════════════════

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { GrowthLog, GrowthStage } from "@/types/research";

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

export interface TeamMember {
  name: string;
  initial: string;
}

// ─── Growth Log Row (pre-formatted for table) ────────────────────────────

export interface GrowthLogRow {
  id: string;
  week: string;
  logDate: string;
  seedlingCount: string;
  aliveCount: string;
  deadCount: number;
  newPropagations: number;
  survivalRatePct: number;
  healthScore: number;
  healthScoreColor: string;
  growthStageBadge: ReactNode;
  observations: string;
}

// ─── Section Configurations (Discriminated Union) ────────────────────────

export interface GrowthCurveSection {
  readonly kind: "growth-curve";
  title: string;
  icon: LucideIcon;
  logs: GrowthLog[];
}

export interface GrowthLogFormSection {
  readonly kind: "growth-log-form";
  title: string;
  icon: LucideIcon;
  experimentId: string;
  nextWeekNumber: number;
  showForm: boolean;
  onSubmit: (logData: Omit<GrowthLog, "id" | "createdAt">) => void;
  onCancel: () => void;
  /** When set, the form operates in "edit" mode and pre-fills all fields. */
  editingLog?: GrowthLog;
  className?: string;
}

export interface GrowthLogTableSection {
  readonly kind: "growth-log-table";
  title: string;
  icon: LucideIcon;
  rows: GrowthLogRow[];
  /** Callback fired when the user clicks the Edit icon on a row. */
  onEdit?: (id: string) => void;
  /** Callback fired when the user clicks the Delete icon on a row. */
  onDelete?: (id: string) => void;
  /** Action button to display in section header (e.g., Add Growth Log). */
  action?: ActionButton;
}

export interface ExperimentDetailsSection {
  readonly kind: "experiment-details";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface ObjectiveSection {
  readonly kind: "objective";
  title: string;
  icon: LucideIcon;
  text: string;
}

export interface TeamSection {
  readonly kind: "team";
  title: string;
  icon: LucideIcon;
  members: TeamMember[];
}

export interface TagsSection {
  readonly kind: "tags";
  title: string;
  icon: LucideIcon;
  tags: string[];
}

export interface ConclusionSection {
  readonly kind: "conclusion";
  title: string;
  icon: LucideIcon;
  text: string;
  className?: string;
}

// ─── Union of ALL Section Types ──────────────────────────────────────────

export type DetailSection =
  | GrowthCurveSection
  | GrowthLogFormSection
  | GrowthLogTableSection
  | ExperimentDetailsSection
  | ObjectiveSection
  | TeamSection
  | TagsSection
  | ConclusionSection;

// ─── Page-Level Configuration ────────────────────────────────────────────

export interface ExperimentPageConfig {
  header: DetailHeaderConfig;
  heroImage: string | null;
  statusBadge: ReactNode;
  kpiStrip: KpiStat[];
  actions: ActionButton[];
  mainSections: DetailSection[];
  sidebarSections: DetailSection[];
}

// ─── Section Registry Contract ───────────────────────────────────────────

export type SectionRendererMap = {
  [K in DetailSection["kind"]]: React.ComponentType<{
    section: Extract<DetailSection, { kind: K }>;
  }>;
};

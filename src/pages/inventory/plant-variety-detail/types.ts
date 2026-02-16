// ═══════════════════════════════════════════════════════════════════════════
// PLANT VARIETY DETAIL — Domain Types & Configuration Contracts
// ═══════════════════════════════════════════════════════════════════════════

import type { PlantSample } from "@/types/inventory";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type {
    ActionButton,
    DetailHeaderConfig,
    HeroImageConfig,
    InfoField,
    KpiStat
} from "@/components/detail/detail-types";

import type {
    ActionButton,
    DetailHeaderConfig,
    HeroImageConfig,
    InfoField,
    KpiStat,
} from "@/components/detail/detail-types";

// ─── Section Configurations (Discriminated Union) ────────────────────────

export interface VarietyInfoSection {
  readonly kind: "variety-info";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
  statusBadge: ReactNode;
}

export interface OwnershipSection {
  readonly kind: "ownership";
  title: string;
  icon: LucideIcon;
  fields: InfoField[];
}

export interface TraitsSection {
  readonly kind: "traits";
  title: string;
  icon: LucideIcon;
  traits: string[];
}

export interface GeneticInfoSection {
  readonly kind: "genetic-info";
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

export interface ImagesSection {
  readonly kind: "images";
  title: string;
  icon: LucideIcon;
  images: string[];
}

export interface SamplesListSection {
  readonly kind: "samples-list";
  title: string;
  icon: LucideIcon;
  samples: PlantSample[];
}

// ─── Combined Section Union ──────────────────────────────────────────────

export type DetailSection =
  | VarietyInfoSection
  | OwnershipSection
  | TraitsSection
  | GeneticInfoSection
  | NotesSection
  | ImagesSection
  | SamplesListSection;

// ─── Page Configuration ──────────────────────────────────────────────────

export interface VarietyPageConfig {
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

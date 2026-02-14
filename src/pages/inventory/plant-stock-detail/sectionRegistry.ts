// ═══════════════════════════════════════════════════════════════════════════
// PLANT STOCK DETAIL — Compile-Time Component Registry (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════
//
// `satisfies SectionRendererMap` guarantees:
//  1. Every discriminator key in DetailSection has a renderer
//  2. Each renderer receives the correctly-narrowed props
//  3. Adding a new union member WITHOUT a renderer → compile error
// ═══════════════════════════════════════════════════════════════════════════

import type { SectionRendererMap } from "./types";

import BatchInfoSectionRenderer from "./sections/BatchInfoSectionRenderer";
import EnvironmentalLogSectionRenderer from "./sections/EnvironmentalLogSectionRenderer";
import GrowthMilestonesSectionRenderer from "./sections/GrowthMilestonesSectionRenderer";
import HealthScoreSectionRenderer from "./sections/HealthScoreSectionRenderer";
import ParentSpeciesSectionRenderer from "./sections/ParentSpeciesSectionRenderer";
import QuickInfoSectionRenderer from "./sections/QuickInfoSectionRenderer";

export const sectionRegistry = {
  "batch-info": BatchInfoSectionRenderer,
  "health-score": HealthScoreSectionRenderer,
  "growth-milestones": GrowthMilestonesSectionRenderer,
  "environmental-log": EnvironmentalLogSectionRenderer,
  "parent-species": ParentSpeciesSectionRenderer,
  "quick-info": QuickInfoSectionRenderer,
} satisfies SectionRendererMap;

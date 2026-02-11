// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAIL — Section Registry (Phase 4a)
// ═══════════════════════════════════════════════════════════════════════════
//
// Maps each discriminated union `kind` to its concrete renderer component.
// The `satisfies SectionRendererMap` constraint guarantees compile-time
// exhaustiveness: add a new union member → compiler forces a new entry here.
// ═══════════════════════════════════════════════════════════════════════════

import GrowthCurveRenderer from "./sections/GrowthCurveRenderer";
import GrowthLogFormRenderer from "./sections/GrowthLogFormRenderer";
import GrowthLogTableRenderer from "./sections/GrowthLogTableRenderer";
import ExperimentDetailsRenderer from "./sections/ExperimentDetailsRenderer";
import ObjectiveRenderer from "./sections/ObjectiveRenderer";
import TeamRenderer from "./sections/TeamRenderer";
import TagsRenderer from "./sections/TagsRenderer";
import ConclusionRenderer from "./sections/ConclusionRenderer";
import type { SectionRendererMap } from "./types";

export const sectionRegistry = {
  "growth-curve": GrowthCurveRenderer,
  "growth-log-form": GrowthLogFormRenderer,
  "growth-log-table": GrowthLogTableRenderer,
  "experiment-details": ExperimentDetailsRenderer,
  objective: ObjectiveRenderer,
  team: TeamRenderer,
  tags: TagsRenderer,
  conclusion: ConclusionRenderer,
} satisfies SectionRendererMap;

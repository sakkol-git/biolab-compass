// ═══════════════════════════════════════════════════════════════════════════
// PLANT SPECIES DETAIL — Compile-Time Component Registry (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════
//
// `satisfies SectionRendererMap` guarantees:
//  1. Every discriminator key in DetailSection has a renderer
//  2. Each renderer receives the correctly-narrowed props
//  3. Adding a new union member WITHOUT a renderer → compile error
// ═══════════════════════════════════════════════════════════════════════════

import type { SectionRendererMap } from "./types";

import BotanicalDescriptionRenderer from "./sections/BotanicalDescriptionRenderer";
import AssociatedBatchesRenderer from "./sections/AssociatedBatchesRenderer";
import CareRequirementsRenderer from "./sections/CareRequirementsRenderer";
import TagsSectionRenderer from "./sections/TagsSectionRenderer";

export const sectionRegistry = {
  "botanical-description": BotanicalDescriptionRenderer,
  "associated-batches": AssociatedBatchesRenderer,
  "care-requirements": CareRequirementsRenderer,
  tags: TagsSectionRenderer,
} satisfies SectionRendererMap;

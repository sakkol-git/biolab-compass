// ═══════════════════════════════════════════════════════════════════════════
// EQUIPMENT DETAIL — Compile-Time Component Registry (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════
//
// Zero runtime dispatch. Zero switch statements. Zero casting.
//
// The `satisfies SectionRendererMap` assertion guarantees:
//  1. Every discriminator key in DetailSection has a renderer
//  2. Each renderer receives the correctly-narrowed props
//  3. Adding a new union member WITHOUT a renderer entry → compile error
//  4. Removing a section type WITHOUT removing the registry key → compile error
//
// To add a new section:
//  1. Add the new member to `DetailSection` union in types.ts
//  2. Create a renderer component in sections/
//  3. Add the mapping here — the compiler will FORCE this step
// ═══════════════════════════════════════════════════════════════════════════

import type { SectionRendererMap } from "./types";

import SpecificationsSectionRenderer from "./sections/SpecificationsSectionRenderer";
import MaintenanceHistorySectionRenderer from "./sections/MaintenanceHistorySectionRenderer";
import UsageLogSectionRenderer from "./sections/UsageLogSectionRenderer";
import FinancialSectionRenderer from "./sections/FinancialSectionRenderer";
import LocationStatusSectionRenderer from "./sections/LocationStatusSectionRenderer";
import NotesSectionRenderer from "./sections/NotesSectionRenderer";

export const sectionRegistry = {
  specifications: SpecificationsSectionRenderer,
  "maintenance-history": MaintenanceHistorySectionRenderer,
  "usage-log": UsageLogSectionRenderer,
  financial: FinancialSectionRenderer,
  "location-status": LocationStatusSectionRenderer,
  notes: NotesSectionRenderer,
} satisfies SectionRendererMap;

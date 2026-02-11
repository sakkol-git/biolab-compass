// ═══════════════════════════════════════════════════════════════════════════
// CHEMICAL DETAIL — Section Registry (Phase 5)
// ═══════════════════════════════════════════════════════════════════════════

import type { SectionRendererMap } from "./types";
import ChemicalPropertiesRenderer from "./sections/ChemicalPropertiesRenderer";
import SafetyHazardRenderer from "./sections/SafetyHazardRenderer";
import UsageRecordsRenderer from "./sections/UsageRecordsRenderer";
import StorageRequirementsRenderer from "./sections/StorageRequirementsRenderer";
import SupplierDetailsRenderer from "./sections/SupplierDetailsRenderer";
import DatesRenderer from "./sections/DatesRenderer";

export const sectionRegistry = {
  "chemical-properties": ChemicalPropertiesRenderer,
  "safety-hazard": SafetyHazardRenderer,
  "usage-records": UsageRecordsRenderer,
  "storage-requirements": StorageRequirementsRenderer,
  "supplier-details": SupplierDetailsRenderer,
  dates: DatesRenderer,
} satisfies SectionRendererMap;

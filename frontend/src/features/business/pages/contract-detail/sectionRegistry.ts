// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT DETAIL — Section Registry (Phase 5)
// ═══════════════════════════════════════════════════════════════════════════

import type { SectionRendererMap } from "./types";
import MilestonesRenderer from "./sections/MilestonesRenderer";
import PaymentsRenderer from "./sections/PaymentsRenderer";
import ContractDetailsRenderer from "./sections/ContractDetailsRenderer";
import ClientInfoRenderer from "./sections/ClientInfoRenderer";
import SpeciesInfoRenderer from "./sections/SpeciesInfoRenderer";
import EmptyActivityRenderer from "./sections/EmptyActivityRenderer";

export const sectionRegistry = {
  milestones: MilestonesRenderer,
  payments: PaymentsRenderer,
  "contract-details": ContractDetailsRenderer,
  "client-info": ClientInfoRenderer,
  "species-info": SpeciesInfoRenderer,
  "empty-activity": EmptyActivityRenderer,
} satisfies SectionRendererMap;

// ═══════════════════════════════════════════════════════════════════════════
// PLANT BATCH DETAIL — Stateless Rendering Engine
// ═══════════════════════════════════════════════════════════════════════════

import {
  DetailLayout,
  createSectionDispatch,
} from "@/components/detail/DetailLayout";
import { sectionRegistry } from "./sectionRegistry";
import type { BatchPageConfig, DetailSection } from "./types";

const renderSection = createSectionDispatch<DetailSection>(sectionRegistry);

const BatchDetailRenderer = ({ config }: { config: BatchPageConfig }) => (
  <DetailLayout<DetailSection>
    header={config.header}
    actions={config.actions}
    heroImage={config.heroImage}
    kpiStrip={config.kpiStrip}
    mainSections={config.mainSections}
    sidebarSections={config.sidebarSections}
    renderSection={renderSection}
  />
);

export default BatchDetailRenderer;

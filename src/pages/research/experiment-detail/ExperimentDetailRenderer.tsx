// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAIL — Stateless Rendering Engine
// ═══════════════════════════════════════════════════════════════════════════

import {
  DetailLayout,
  createSectionDispatch,
} from "@/components/detail/DetailLayout";
import { sectionRegistry } from "./sectionRegistry";
import type { ExperimentPageConfig, DetailSection } from "./types";

const renderSection = createSectionDispatch<DetailSection>(sectionRegistry);

const ExperimentDetailRenderer = ({ config }: { config: ExperimentPageConfig }) => (
  <DetailLayout<DetailSection>
    header={config.header}
    actions={config.actions}
    statusBadge={config.statusBadge}
    heroImage={config.heroImage}
    kpiStrip={config.kpiStrip}
    kpiColumns="6"
    mainSections={config.mainSections}
    sidebarSections={config.sidebarSections}
    renderSection={renderSection}
  />
);

export default ExperimentDetailRenderer;

// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH DASHBOARD — Composition Root
// ═══════════════════════════════════════════════════════════════════════════
//
// This file contains ZERO business logic and ZERO hardcoded UI.
// It is the thinnest possible shell: hook → config → renderer.
//
// To add a new widget:
//   1. Add a new member to the ResearchWidget union      (dashboard/types.ts)
//   2. Create a renderer component                       (dashboard/widgets/)
//   3. Register it in WIDGET_REGISTRY                    (dashboard/widgetRegistry.ts)
//   4. Add the config entry in useResearchDashboard      (dashboard/useResearchDashboard.tsx)
//   — No changes needed here.
// ═══════════════════════════════════════════════════════════════════════════

import AppLayout from "@/components/layout/AppLayout";
import ResearchDashboardRenderer from "./dashboard/ResearchDashboardRenderer";
import { useResearchDashboard } from "./dashboard/useResearchDashboard";

const Research = () => {
  const { config } = useResearchDashboard();

  return (
    <AppLayout>
      <ResearchDashboardRenderer config={config} />
    </AppLayout>
  );
};

export default Research;

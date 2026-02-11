// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS DASHBOARD — Composition Root
// ═══════════════════════════════════════════════════════════════════════════
//
// This file contains ZERO business logic and ZERO hardcoded UI.
// It is the thinnest possible shell: hook → config → renderer.
//
// To add a new widget:
//   1. Add a new member to the DashboardWidget union    (types.ts)
//   2. Create a renderer component                      (widgets/)
//   3. Register it in WIDGET_REGISTRY                   (widgetRegistry.ts)
//   4. Add the config entry in useBusinessDashboard     (useBusinessDashboard.tsx)
//   — No changes needed here.
// ═══════════════════════════════════════════════════════════════════════════

import AppLayout from "@/components/layout/AppLayout";
import BusinessDashboardRenderer from "./DashboardRenderer";
import { useBusinessDashboard } from "./useBusinessDashboard";

const Business = () => {
  const { config } = useBusinessDashboard();

  return (
    <AppLayout>
      <BusinessDashboardRenderer config={config} />
    </AppLayout>
  );
};

export default Business;

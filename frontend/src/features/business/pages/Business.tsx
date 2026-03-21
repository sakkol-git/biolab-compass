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

import AppLayout from "@/core/layouts/AppLayout";
import { Loader2 } from "lucide-react";
import BusinessDashboardRenderer from "./DashboardRenderer";
import { useBusinessDashboard } from "./useBusinessDashboard";

const Business = () => {
  const { config, isLoading } = useBusinessDashboard();

  if (isLoading || !config) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <BusinessDashboardRenderer config={config} />
    </AppLayout>
  );
};

export default Business;

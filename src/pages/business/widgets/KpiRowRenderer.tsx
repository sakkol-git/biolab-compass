// ═══════════════════════════════════════════════════════════════════════════
// KPI ROW WIDGET
// Renders a grid of StatCard components from configuration data.
// ═══════════════════════════════════════════════════════════════════════════

import StatCard from "@/components/dashboard/StatCard";
import type { KpiRowWidget } from "../types";

interface KpiRowRendererProps {
  config: KpiRowWidget;
}

const KpiRowRenderer = ({ config }: KpiRowRendererProps) => (
  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
    {config.stats.map((stat) => (
      <StatCard
        key={stat.title}
        title={stat.title}
        value={stat.value}
        subtitle={stat.subtitle}
        icon={stat.icon}
        trend={stat.trend}
      />
    ))}
  </div>
);

export default KpiRowRenderer;

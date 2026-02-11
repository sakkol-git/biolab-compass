import type { KpiRowWidget } from "../types";
import StatCard from "@/components/dashboard/StatCard";

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

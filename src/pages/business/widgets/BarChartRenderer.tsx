// ═══════════════════════════════════════════════════════════════════════════
// BAR CHART WIDGET
// Recharts BarChart driven by config data, fill color, and formatters.
// ═══════════════════════════════════════════════════════════════════════════

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { chartTooltipStyle, chartGridProps } from "@/lib/chart-theme";
import type { BarChartWidget } from "../types";

interface BarChartRendererProps {
  config: BarChartWidget;
}

const BarChartRenderer = ({ config }: BarChartRendererProps) => (
  <div className="bg-card border border-border shadow-sm p-5 rounded-xl">
    <h3 className="text-sm font-medium text-muted-foreground mb-4">
      {config.title}
    </h3>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={config.data}
        margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid {...chartGridProps} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fontWeight: 500 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          tick={{ fontSize: 11, fontWeight: 600 }}
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={config.yAxisFormatter}
        />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(v: number) => [config.formatValue(v), "Value"]}
        />
        <Bar
          dataKey="value"
          fill={config.fill}
          stroke="hsl(var(--border))"
          strokeWidth={2}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartRenderer;

// ═══════════════════════════════════════════════════════════════════════════
// PIE CHART WIDGET
// Payment status donut chart with legend.
// ═══════════════════════════════════════════════════════════════════════════

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import { chartTooltipStyle } from "@/lib/chart-theme";
import type { PieChartWidget } from "../types";

interface PieChartRendererProps {
  config: PieChartWidget;
}

const PieChartRenderer = ({ config }: PieChartRendererProps) => (
  <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
    <h3 className="text-sm font-medium text-muted-foreground mb-4">
      {config.title}
    </h3>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={config.data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="amount"
          stroke="hsl(var(--border))"
          strokeWidth={2}
        >
          {config.data.map((entry) => (
            <Cell
              key={entry.name}
              fill={config.colors[entry.name] ?? "hsl(var(--muted))"}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value: number, name: string) => [
            config.formatValue(value),
            name,
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex flex-wrap gap-3 mt-2 justify-center">
      {config.data.map((slice) => (
        <div
          key={slice.name}
          className="flex items-center gap-2 text-xs font-medium"
        >
          <div
            className="w-3 h-3 rounded-sm"
            style={{
              backgroundColor: config.colors[slice.name] ?? "hsl(var(--muted))",
            }}
          />
          <span className="text-muted-foreground">
            {slice.name}: {config.formatValue(slice.amount)}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default PieChartRenderer;

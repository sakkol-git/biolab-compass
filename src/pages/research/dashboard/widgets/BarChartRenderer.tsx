import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { chartTooltipStyle, chartGridProps } from "@/lib/chart-theme";
import type { BarChartWidget } from "../types";

interface BarChartRendererProps {
  config: BarChartWidget;
}

const BarChartRenderer = ({ config }: BarChartRendererProps) => {
  const Icon = config.titleIcon;

  return (
    <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        <Icon className="h-4 w-4 inline mr-1.5 text-primary" />
        {config.title}
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={config.data.map((d) => ({ name: d.label, value: d.value }))}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid {...chartGridProps} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fontWeight: 600 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            domain={config.yAxisDomain}
            tick={{ fontSize: 11, fontWeight: 600 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(v: number) => [config.formatValue(v), config.valueLabel]}
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
};

export default BarChartRenderer;

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { chartTooltipStyle, chartGridProps } from "@/lib/chart-theme";
import type { GrowthLog } from "@/types/research";

interface GrowthChartProps {
  logs: GrowthLog[];
  title?: string;
  showTarget?: number;
  className?: string;
}

const GrowthChart = ({ logs, title = "Growth Curve", showTarget, className }: GrowthChartProps) => {
  const chartData = logs.map((log) => ({
    week: `W${log.weekNumber}`,
    weekNum: log.weekNumber,
    alive: log.aliveCount,
    total: log.seedlingCount,
    survival: log.survivalRatePct,
    health: log.healthScore,
  }));

  return (
    <div className={className}>
      {title && (
        <h4 className="text-sm font-medium tracking-wider text-muted-foreground mb-4">{title}</h4>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid {...chartGridProps} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fontWeight: 600 }}
            stroke="hsl(var(--muted-foreground))"
          />
          <YAxis
            tick={{ fontSize: 11, fontWeight: 600 }}
            stroke="hsl(var(--muted-foreground))"
            tickFormatter={(v) => v.toLocaleString()}
          />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              name === "alive" ? "Alive Count" : name === "total" ? "Total Count" : name,
            ]}
          />
          <Line
            type="monotone"
            dataKey="alive"
            stroke="hsl(145, 63%, 32%)"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "hsl(145, 63%, 32%)", strokeWidth: 2, stroke: "#fff" }}
            activeDot={{ r: 6 }}
            name="alive"
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="hsl(175, 65%, 35%)"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3, fill: "hsl(175, 65%, 35%)" }}
            name="total"
          />
          {showTarget && (
            <ReferenceLine
              y={showTarget}
              stroke="hsl(0, 72%, 51%)"
              strokeDasharray="8 4"
              label={{ value: `Target: ${showTarget.toLocaleString()}`, position: "right", fontSize: 11, fontWeight: 700, fill: "hsl(0, 72%, 51%)" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-3 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[hsl(145,63%,32%)]" />
          <span className="text-muted-foreground">Alive Count</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-[hsl(175,65%,35%)] border-dashed" style={{ borderTopWidth: 2, borderTopStyle: "dashed" }} />
          <span className="text-muted-foreground">Total Count</span>
        </div>
        {showTarget && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-[hsl(0,72%,51%)]" style={{ borderTopWidth: 2, borderTopStyle: "dashed" }} />
            <span className="text-muted-foreground">Target</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrowthChart;

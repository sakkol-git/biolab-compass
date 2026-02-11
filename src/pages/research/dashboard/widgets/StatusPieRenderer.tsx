import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";
import { chartTooltipStyle } from "@/lib/chart-theme";
import type { StatusPieWidget } from "../types";

interface StatusPieRendererProps {
  config: StatusPieWidget;
}

const StatusPieRenderer = ({ config }: StatusPieRendererProps) => (
  <div className="bg-card rounded-xl p-5 border border-border shadow-sm">
    <h3 className="text-sm font-medium text-muted-foreground mb-4">
      {config.title}
    </h3>
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie
          data={config.data}
          cx="50%"
          cy="50%"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={3}
          dataKey="value"
          stroke="hsl(var(--border))"
          strokeWidth={2}
        >
          {config.data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value: number, name: string) => [value, name]}
        />
      </PieChart>
    </ResponsiveContainer>
    <div className="flex flex-wrap gap-3 mt-2 justify-center">
      {config.data.map((s) => (
        <div key={s.name} className="flex items-center gap-2 text-xs font-medium">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.fill }} />
          <span className="text-muted-foreground">{s.name}: {s.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default StatusPieRenderer;

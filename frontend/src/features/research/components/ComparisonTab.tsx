/* ═══════════════════════════════════════════════════════════════════════════
 * ComparisonTab — Species-comparison bar charts (GrowthAnalysis tab #1).
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import { chartGridProps, chartTooltipStyle } from "@/shared/lib/chart-theme";
import ChartCard from "./ChartCard";

// ─── Chart Config ──────────────────────────────────────────────────────────

const AXIS_TICK = { fontSize: 11, fontWeight: 600 };
const AXIS_STROKE = "hsl(var(--muted-foreground))";
const PRIMARY_FILL = "hsl(var(--primary))";
const GREEN_FILL = "hsl(145, 63%, 32%)";
const TEAL_FILL = "hsl(175, 65%, 35%)";
const BORDER_STROKE = "hsl(var(--border))";

// ─── Types ─────────────────────────────────────────────────────────────────

export type ComparisonDatum = {
  name: string;
  multiplication: number;
  survival: number;
  experiments: number;
};

// ─── Component ─────────────────────────────────────────────────────────────

const ComparisonTab = ({ data }: { data: ComparisonDatum[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <ChartCard title="Avg Multiplication Rate by Species">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid {...chartGridProps} />
          <XAxis dataKey="name" tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <YAxis tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(v: number) => [`${v}×`, "Mult. Rate"]}
          />
          <Bar
            dataKey="multiplication"
            fill={PRIMARY_FILL}
            stroke={BORDER_STROKE}
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Avg Survival Rate by Species">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid {...chartGridProps} />
          <XAxis dataKey="name" tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <YAxis domain={[80, 100]} tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(v: number) => [`${v}%`, "Survival"]}
          />
          <Bar
            dataKey="survival"
            fill={GREEN_FILL}
            stroke={BORDER_STROKE}
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard
      title="Multiplication Rate vs Experiments"
      className="lg:col-span-2"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid {...chartGridProps} />
          <XAxis dataKey="name" tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <YAxis tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          <Bar
            dataKey="multiplication"
            name="Multiplication Rate (×)"
            fill={PRIMARY_FILL}
            stroke={BORDER_STROKE}
            strokeWidth={2}
          />
          <Bar
            dataKey="experiments"
            name="Experiments"
            fill={TEAL_FILL}
            stroke={BORDER_STROKE}
            strokeWidth={2}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

export default ComparisonTab;

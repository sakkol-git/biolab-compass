/* ═══════════════════════════════════════════════════════════════════════════
 * RadarTab — Per-species radar chart profiles (GrowthAnalysis tab #3).
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";

import ChartCard from "./ChartCard";

// ─── Chart Config ──────────────────────────────────────────────────────────

const PRIMARY_FILL = "hsl(var(--primary))";
const BORDER_STROKE = "hsl(var(--border))";

// ─── Types ─────────────────────────────────────────────────────────────────

export type RadarDatum = {
  species: string;
  Multiplication: number;
  Survival: number;
  Speed: number;
  Consistency: number;
  Experiments: number;
};

// ─── Component ─────────────────────────────────────────────────────────────

const RadarTab = ({ data }: { data: RadarDatum[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {data.map((sp) => (
      <ChartCard key={sp.species} title={sp.species}>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart
            data={[
              { metric: "Multiplication", value: sp.Multiplication },
              { metric: "Survival", value: sp.Survival },
              { metric: "Speed", value: sp.Speed },
              { metric: "Consistency", value: sp.Consistency },
              { metric: "Data Points", value: sp.Experiments },
            ]}
          >
            <PolarGrid stroke={BORDER_STROKE} />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fontSize: 10, fontWeight: 600 }}
            />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
            <Radar
              dataKey="value"
              stroke={PRIMARY_FILL}
              fill={PRIMARY_FILL}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    ))}
  </div>
);

export default RadarTab;

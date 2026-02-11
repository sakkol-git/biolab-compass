/* ═══════════════════════════════════════════════════════════════════════════
 * GrowthAnalysis — Species comparisons, growth trends, and insights.
 *
 * All state lives in useGrowthAnalysisView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { TrendingUp, Activity, BarChart3 } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import GrowthChart from "@/components/research/GrowthChart";
import { chartTooltipStyle, chartGridProps } from "@/lib/chart-theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Hook ──────────────────────────────────────────────────────────────────
import { useGrowthAnalysisView } from "./useGrowthAnalysisView";

// ─── Chart Config ──────────────────────────────────────────────────────────
const AXIS_TICK = { fontSize: 11, fontWeight: 600 };
const AXIS_STROKE = "hsl(var(--muted-foreground))";
const PRIMARY_FILL = "hsl(var(--primary))";
const GREEN_FILL = "hsl(145, 63%, 32%)";
const TEAL_FILL = "hsl(175, 65%, 35%)";
const BORDER_STROKE = "hsl(var(--border))";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const GrowthAnalysis = () => {
  const view = useGrowthAnalysisView();

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={TrendingUp}
          title="Growth Analysis"
          description="Species comparisons, growth trends, and performance insights"
        />

        <Tabs defaultValue="comparison" className="space-y-6">
          <TabsList className="bg-muted/50 p-1 rounded-lg">
            <TabsTrigger value="comparison" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4" /> Species Comparison
            </TabsTrigger>
            <TabsTrigger value="curves" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="h-4 w-4" /> Growth Curves
            </TabsTrigger>
            <TabsTrigger value="radar" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="h-4 w-4" /> Species Profiles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-6">
            <ComparisonTab data={view.comparisonData} />
          </TabsContent>

          <TabsContent value="curves" className="space-y-4">
            <CurvesTab view={view} />
          </TabsContent>

          <TabsContent value="radar" className="space-y-6">
            <RadarTab data={view.radarData} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default GrowthAnalysis;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Comparison Tab ────────────────────────────────────────────────────── */

type ComparisonDatum = { name: string; multiplication: number; survival: number; cycle: number; yield: number };

const ComparisonTab = ({ data }: { data: ComparisonDatum[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <ChartCard title="Avg Multiplication Rate by Species">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid {...chartGridProps} />
          <XAxis dataKey="name" tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <YAxis tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}×`, "Mult. Rate"]} />
          <Bar dataKey="multiplication" fill={PRIMARY_FILL} stroke={BORDER_STROKE} strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Avg Survival Rate by Species">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid {...chartGridProps} />
          <XAxis dataKey="name" tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <YAxis domain={[80, 100]} tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, "Survival"]} />
          <Bar dataKey="survival" fill={GREEN_FILL} stroke={BORDER_STROKE} strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>

    <ChartCard title="Multiplication Rate vs Survival Rate" className="lg:col-span-2">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid {...chartGridProps} />
          <XAxis dataKey="name" tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <YAxis tick={AXIS_TICK} stroke={AXIS_STROKE} />
          <Tooltip contentStyle={chartTooltipStyle} />
          <Legend />
          <Bar dataKey="multiplication" name="Multiplication Rate (×)" fill={PRIMARY_FILL} stroke={BORDER_STROKE} strokeWidth={2} />
          <Bar dataKey="cycle" name="Cycle Duration (wks)" fill={TEAL_FILL} stroke={BORDER_STROKE} strokeWidth={2} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  </div>
);

/* ─── Curves Tab ────────────────────────────────────────────────────────── */

const CurvesTab = ({ view }: { view: ReturnType<typeof useGrowthAnalysisView> }) => (
  <>
    <ExperimentSelector
      experiments={view.experimentsWithLogs}
      selectedId={view.selectedExpId}
      onChange={view.updateSelectedExperiment}
    />

    {view.experimentLogs.length > 0 ? (
      <ChartCard>
        <GrowthChart logs={view.experimentLogs} title={`${view.selectedExpId} Growth Curve`} />
      </ChartCard>
    ) : (
      <div className="bg-card rounded-xl p-12 border border-border/60 text-center">
        <TrendingUp className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm font-normal text-muted-foreground/70">No growth data for this experiment</p>
      </div>
    )}

    <HealthScoreComparison scores={view.healthScores} />
  </>
);

const ExperimentSelector = ({ experiments, selectedId, onChange }: {
  experiments: { id: string; experimentCode: string; title: string }[];
  selectedId: string;
  onChange: (id: string) => void;
}) => (
  <div className="flex items-center gap-3">
    <Select value={selectedId} onValueChange={onChange}>
      <SelectTrigger className="w-80"><SelectValue placeholder="Select experiment" /></SelectTrigger>
      <SelectContent>
        {experiments.map((exp) => (
          <SelectItem key={exp.id} value={exp.id}>{exp.experimentCode} — {exp.title}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const HealthScoreComparison = ({ scores }: { scores: { code: string; healthScore: number; stage: string; week: number }[] }) => (
  <ChartCard title="Health Score Comparison (Latest Week)">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {scores.map((s) => (
        <div key={s.code} className="bg-muted/30 rounded-lg p-3 text-center">
          <p className="text-xs font-normal text-muted-foreground/70">{s.code}</p>
          <p className="text-2xl font-medium text-foreground tabular-nums mt-1">{s.healthScore}/10</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.stage} — W{s.week}</p>
        </div>
      ))}
    </div>
  </ChartCard>
);

/* ─── Radar Tab ─────────────────────────────────────────────────────────── */

type RadarDatum = { species: string; Multiplication: number; Survival: number; Speed: number; Consistency: number; Experiments: number };

const RadarTab = ({ data }: { data: RadarDatum[] }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {data.map((sp) => (
      <ChartCard key={sp.species} title={sp.species}>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={[
            { metric: "Multiplication", value: sp.Multiplication },
            { metric: "Survival", value: sp.Survival },
            { metric: "Speed", value: sp.Speed },
            { metric: "Consistency", value: sp.Consistency },
            { metric: "Data Points", value: sp.Experiments },
          ]}>
            <PolarGrid stroke={BORDER_STROKE} />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fontWeight: 600 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
            <Radar dataKey="value" stroke={PRIMARY_FILL} fill={PRIMARY_FILL} fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>
    ))}
  </div>
);

/* ─── Shared Chart Card ─────────────────────────────────────────────────── */

const ChartCard = ({ title, className, children }: { title?: string; className?: string; children: React.ReactNode }) => (
  <div className={`bg-card rounded-xl p-5 border border-border/60 ${className || ""}`}>
    {title && <h3 className="text-sm font-normal text-muted-foreground/70 mb-4">{title}</h3>}
    {children}
  </div>
);

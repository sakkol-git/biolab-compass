/* ═══════════════════════════════════════════════════════════════════════════
 * CurvesTab — Growth curves + health-score panel (GrowthAnalysis tab #2).
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import GrowthChart from "@/features/research/components/GrowthChart";
import { TrendingUp } from "lucide-react";
import { useGrowthAnalysisView } from "../pages/useGrowthAnalysisView";
import ChartCard from "./ChartCard";

// ─── Props ─────────────────────────────────────────────────────────────────

interface CurvesTabProps {
  view: ReturnType<typeof useGrowthAnalysisView>;
}

// ─── Component ─────────────────────────────────────────────────────────────

const CurvesTab = ({ view }: CurvesTabProps) => (
  <>
    <ExperimentSelector
      experiments={view.experimentsWithLogs}
      selectedId={view.selectedExpId}
      onChange={view.updateSelectedExperiment}
    />

    {view.curveLoading && (
      <div className="bg-card rounded-xl p-12 border border-border/60 text-center">
        <p className="text-sm font-normal text-muted-foreground/70">
          Loading growth curve data…
        </p>
      </div>
    )}

    {!view.curveLoading && view.experimentLogs.length > 0 ? (
      <ChartCard>
        <GrowthChart
          logs={view.experimentLogs}
          title={`${view.selectedExpId} Growth Curve`}
        />
      </ChartCard>
    ) : !view.curveLoading ? (
      <div className="bg-card rounded-xl p-12 border border-border/60 text-center">
        <TrendingUp className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm font-normal text-muted-foreground/70">
          No growth data for this experiment
        </p>
      </div>
    ) : null}

    <HealthScoreComparison scores={view.healthScores} />
  </>
);

export default CurvesTab;

// ─── ExperimentSelector ────────────────────────────────────────────────────

const ExperimentSelector = ({
  experiments,
  selectedId,
  onChange,
}: {
  experiments: { id: string; experimentCode: string; title: string }[];
  selectedId: string;
  onChange: (id: string) => void;
}) => (
  <div className="flex items-center gap-3">
    <Select value={selectedId} onValueChange={onChange}>
      <SelectTrigger className="w-80">
        <SelectValue placeholder="Select experiment" />
      </SelectTrigger>
      <SelectContent>
        {experiments.map((exp) => (
          <SelectItem key={exp.id} value={exp.id}>
            {exp.experimentCode} — {exp.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

// ─── HealthScoreComparison ─────────────────────────────────────────────────

const HealthScoreComparison = ({
  scores,
}: {
  scores: { code: string; healthScore: number; stage: string; week: number }[];
}) => (
  <ChartCard title="Health Score Comparison (Latest Week)">
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {scores.map((s) => (
        <div key={s.code} className="bg-muted/30 rounded-lg p-3 text-center">
          <p className="text-xs font-normal text-muted-foreground/70">
            {s.code}
          </p>
          <p className="text-2xl font-medium text-foreground tabular-nums mt-1">
            {s.healthScore}/10
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {s.stage} — W{s.week}
          </p>
        </div>
      ))}
    </div>
  </ChartCard>
);

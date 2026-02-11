/* ═══════════════════════════════════════════════════════════════════════════
 * ProductionCalculator — Forecasting widget for seedling production.
 *
 * All state lives in useProductionCalculator(). This file is pure JSX.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import {
  Calculator, Sprout, Clock, Building2, DollarSign, AlertTriangle,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

// ─── Internal Components ───────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { chartTooltipStyle, chartGridProps } from "@/lib/chart-theme";
import { formatNumber, formatCurrency } from "@/lib/calculator";

// ─── Hook ──────────────────────────────────────────────────────────────────
import { useProductionCalculator } from "./useProductionCalculator";

// ─── Types ─────────────────────────────────────────────────────────────────
import type { ProductionForecast } from "@/types/business";
import type { SpeciesGrowthProfile } from "@/types/research";

interface ProductionCalculatorProps {
  onForecastGenerated?: (forecast: ProductionForecast) => void;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const ProductionCalculator = ({ onForecastGenerated }: ProductionCalculatorProps) => {
  const vm = useProductionCalculator(onForecastGenerated);

  return (
    <div className="space-y-6">
      <InputSection vm={vm} />
      <ResultsSection
        forecast={vm.forecast}
        hasCalculated={vm.hasCalculated}
        lowConfidence={vm.lowConfidence}
        selectedProfile={vm.selectedProfile}
      />
    </div>
  );
};

export default ProductionCalculator;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Input Section ─────────────────────────────────────────────────────── */

type VM = ReturnType<typeof useProductionCalculator>;

const InputSection = ({ vm }: { vm: VM }) => (
  <div className="bg-card rounded-xl p-6 border border-border/60 shadow-md">
    <div className="flex items-center gap-2 mb-4">
      <Calculator className="h-5 w-5 text-muted-foreground/60" />
      <h3 className="text-sm font-medium tracking-wider">Production Calculator</h3>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <SpeciesSelector
        value={vm.selectedSpecies}
        onChange={vm.setSelectedSpecies}
        options={vm.speciesOptions}
      />
      <QuantityInput value={vm.quantity} onChange={vm.setQuantity} />
      <div className="flex items-end">
        <Button
          className="w-full gap-2 font-medium"
          onClick={vm.generateForecast}
          disabled={!vm.canCalculate}
        >
          <Calculator className="h-4 w-4" />
          Calculate Forecast
        </Button>
      </div>
    </div>

    {vm.selectedProfile && <SpeciesProfileSummary profile={vm.selectedProfile} />}
  </div>
);

const SpeciesSelector = ({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { speciesId: string; commonName: string; speciesName: string }[];
}) => (
  <div className="space-y-2">
    <Label>Crop Species *</Label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue placeholder="Select species" /></SelectTrigger>
      <SelectContent>
        {options.map((p) => (
          <SelectItem key={p.speciesId} value={p.speciesId}>
            {p.commonName} ({p.speciesName})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const QuantityInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="space-y-2">
    <Label>Desired Quantity *</Label>
    <Input
      type="number"
      min="1"
      placeholder="e.g. 10000"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const SpeciesProfileSummary = ({ profile }: { profile: SpeciesGrowthProfile }) => {
  const stats = [
    { label: "Avg Multiplication", value: `${profile.avgMultiplicationRate}×` },
    { label: "Avg Survival", value: `${profile.avgSurvivalRate}%` },
    { label: "Avg Cycle", value: `${profile.avgCycleDurationWeeks} wks` },
    { label: "Experiments", value: `${profile.totalExperiments}` },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-muted/50 rounded-lg p-3">
          <p className="text-xs font-normal text-muted-foreground/70">{s.label}</p>
          <p className="text-lg font-medium text-foreground tabular-nums">{s.value}</p>
        </div>
      ))}
    </div>
  );
};

/* ─── Results Section ───────────────────────────────────────────────────── */

const ResultsSection = ({ forecast, hasCalculated, lowConfidence, selectedProfile }: {
  forecast: ProductionForecast | null;
  hasCalculated: boolean;
  lowConfidence: boolean;
  selectedProfile: SpeciesGrowthProfile | null;
}) => {
  if (!hasCalculated || !forecast) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      {lowConfidence && selectedProfile && (
        <LowConfidenceAlert completedExperiments={selectedProfile.completedExperiments} />
      )}
      <KpiCards forecast={forecast} />
      <TimelineChart forecast={forecast} />
      <ForecastSummary forecast={forecast} />
    </div>
  );
};

const LowConfidenceAlert = ({ completedExperiments }: { completedExperiments: number }) => (
  <div className="bg-amber-50 border border-amber-300 rounded-lg p-4 flex items-start gap-3 shadow-sm">
    <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
    <div>
      <p className="text-sm font-medium text-amber-800">Low Data Confidence</p>
      <p className="text-xs text-amber-700 mt-0.5">
        Only {completedExperiments} completed experiment(s) for this species. Minimum 3 recommended for accurate forecasting.
      </p>
    </div>
  </div>
);

/* ─── KPI Cards ─────────────────────────────────────────────────────────── */

const KpiCards = ({ forecast }: { forecast: ProductionForecast }) => {
  const cards = [
    { icon: Sprout, label: "Initial Stock", value: formatNumber(forecast.recommendedInitialStock), sub: "mother plants needed" },
    { icon: Clock, label: "Est. Time", value: <>{forecast.estimatedWeeks} <span className="text-base">wks</span></>, sub: `90% CI: ${forecast.confidenceLowerWeeks}–${forecast.confidenceUpperWeeks} weeks` },
    { icon: Building2, label: "Greenhouses", value: forecast.resourceRequirements.greenhouses, sub: "facility units required" },
    { icon: DollarSign, label: "Est. Cost", value: formatCurrency(forecast.resourceRequirements.estimatedCost), sub: "production cost" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div key={c.label} className="bg-card rounded-xl p-4 border border-border/60 shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-4 w-4 text-muted-foreground/50" />
              <span className="text-xs font-normal tracking-wider text-muted-foreground/70">{c.label}</span>
            </div>
            <p className="text-2xl font-medium text-foreground tabular-nums">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.sub}</p>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Timeline Chart ────────────────────────────────────────────────────── */

const TimelineChart = ({ forecast }: { forecast: ProductionForecast }) => (
  <div className="bg-card rounded-xl p-5 border border-border/60 shadow-md">
    <h4 className="text-sm font-normal tracking-wider text-muted-foreground/70 mb-4">
      Projected Production Timeline
    </h4>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={forecast.weeklyMilestones} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid {...chartGridProps} />
        <XAxis
          dataKey="week"
          tick={{ fontSize: 11, fontWeight: 600 }}
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(v) => `W${v}`}
        />
        <YAxis
          tick={{ fontSize: 11, fontWeight: 600 }}
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(v: number) => v.toLocaleString()}
        />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(v: number) => [v.toLocaleString(), "Projected"]}
        />
        <Line
          type="monotone"
          dataKey="projected"
          stroke="hsl(145, 63%, 32%)"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "hsl(145, 63%, 32%)", strokeWidth: 2, stroke: "#fff" }}
        />
        <ReferenceLine
          y={forecast.desiredQuantity}
          stroke="hsl(0, 72%, 51%)"
          strokeDasharray="8 4"
          label={{
            value: `Target: ${formatNumber(forecast.desiredQuantity)}`,
            position: "right",
            fontSize: 11,
            fontWeight: 700,
            fill: "hsl(0, 72%, 51%)",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/* ─── Forecast Summary ──────────────────────────────────────────────────── */

const ForecastSummary = ({ forecast }: { forecast: ProductionForecast }) => {
  const entries = [
    { label: "Species", value: forecast.commonName },
    { label: "Method", value: forecast.propagationMethod },
    { label: "Cycles Needed", value: forecast.estimatedCycles },
    { label: "Survival Rate", value: `${forecast.estimatedSurvivalRate}%` },
    { label: "Multiplication Rate", value: `${forecast.estimatedMultiplicationRate}×` },
    { label: "Labor Hours", value: `${forecast.resourceRequirements.laborHours} hrs` },
  ];

  return (
  <div className="bg-card rounded-xl p-5 border border-border/60 shadow-md">
    <h4 className="text-sm font-normal tracking-wider text-muted-foreground/70 mb-3">Forecast Summary</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        {entries.map((e) => (
          <div key={e.label}>
            <span className="text-xs font-normal text-muted-foreground/70">{e.label}</span>
            <p className="font-medium text-foreground">{e.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

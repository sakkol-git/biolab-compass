/* ═══════════════════════════════════════════════════════════════════════════
 * SampleTracking — Species growth profiles and aggregated statistics.
 *
 * Read-only page. No state. Pure declarative JSX with named sub-components.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { Sprout, TrendingUp, Activity, FlaskConical, Clock, BarChart3 } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

// ─── Data ──────────────────────────────────────────────────────────────────
import { speciesGrowthProfiles } from "@/data/mockResearchData";

// ─── Derived ───────────────────────────────────────────────────────────────
const sorted = [...speciesGrowthProfiles].sort((a, b) => b.avgMultiplicationRate - a.avgMultiplicationRate);

const summaryStats = [
  { label: "Species Tracked", value: speciesGrowthProfiles.length },
  { label: "Total Experiments", value: speciesGrowthProfiles.reduce((s, p) => s + p.totalExperiments, 0) },
  { label: "Avg Mult. Rate", value: `${(speciesGrowthProfiles.reduce((s, p) => s + p.avgMultiplicationRate, 0) / speciesGrowthProfiles.length).toFixed(1)}×`, highlight: "primary" },
  { label: "Avg Survival", value: `${(speciesGrowthProfiles.reduce((s, p) => s + p.avgSurvivalRate, 0) / speciesGrowthProfiles.length).toFixed(1)}%`, highlight: "emerald" },
];

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const SampleTracking = () => (
  <AppLayout>
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        icon={Sprout}
        title="Sample Tracking"
        description="Species growth profiles and aggregated statistics from completed experiments."
      />

      <SummaryRow stats={summaryStats} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {sorted.map((sp, idx) => (
          <SpeciesProfileCard key={sp.speciesId} profile={sp} isTopYield={idx === 0} />
        ))}
      </div>
    </div>
  </AppLayout>
);

export default SampleTracking;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Summary Row ───────────────────────────────────────────────────────── */

const SummaryRow = ({ stats }: { stats: { label: string; value: string | number; highlight?: string }[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <div key={stat.label} className="bg-card rounded-xl p-4 border border-border/60">
        <p className="text-xs font-normal text-muted-foreground/70">{stat.label}</p>
        <p className={cn(
          "text-2xl font-medium tabular-nums mt-1",
          stat.highlight === "primary" ? "text-primary" : stat.highlight === "emerald" ? "text-emerald-600" : "text-foreground",
        )}>{stat.value}</p>
      </div>
    ))}
  </div>
);

/* ─── Species Profile Card ──────────────────────────────────────────────── */

type GrowthProfile = typeof speciesGrowthProfiles[number];

const SpeciesProfileCard = ({ profile: sp, isTopYield }: { profile: GrowthProfile; isTopYield: boolean }) => (
  <div className="bg-card rounded-xl border border-border/60 hover:bg-muted/30 transition-colors">
    <CardHeader commonName={sp.commonName} speciesName={sp.speciesName} isTopYield={isTopYield} />
    <StatsGrid profile={sp} />
    <CardFooter profile={sp} />
  </div>
);

const CardHeader = ({ commonName, speciesName, isTopYield }: { commonName: string; speciesName: string; isTopYield: boolean }) => (
  <div className="p-5 border-b border-border/40">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-medium text-foreground">{commonName}</h3>
        <p className="text-xs text-muted-foreground/60 italic">{speciesName}</p>
      </div>
      {isTopYield && (
        <span className="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground border border-primary rounded-lg">
          Top Yield
        </span>
      )}
    </div>
  </div>
);

const StatsGrid = ({ profile: sp }: { profile: GrowthProfile }) => (
  <div className="p-5 grid grid-cols-2 gap-4">
    <MetricCell
      icon={TrendingUp}
      label="Avg Multiplication"
      value={`${sp.avgMultiplicationRate}×`}
      detail={`Best: ${sp.bestMultiplicationRate}× / Worst: ${sp.worstMultiplicationRate}×`}
    />
    <MetricCell
      icon={Activity}
      iconClass="text-emerald-500"
      label="Avg Survival"
      value={`${sp.avgSurvivalRate}%`}
      detail={`σ = ${sp.stdDevSurvival}%`}
    />
    <MetricCell
      icon={Clock}
      label="Cycle Duration"
      value={<>{sp.avgCycleDurationWeeks} <span className="text-sm font-medium">wks</span></>}
    />
    <MetricCell
      icon={FlaskConical}
      label="Experiments"
      value={<>{sp.completedExperiments}<span className="text-sm text-muted-foreground font-medium">/{sp.totalExperiments}</span></>}
      detail="completed / total"
    />
  </div>
);

const MetricCell = ({ icon: Icon, iconClass, label, value, detail }: {
  icon: React.ElementType;
  iconClass?: string;
  label: string;
  value: React.ReactNode;
  detail?: string;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      <Icon className={cn("h-3.5 w-3.5", iconClass || "text-muted-foreground/50")} />
      <span className="text-xs font-normal text-muted-foreground/70">{label}</span>
    </div>
    <p className="text-xl font-medium text-foreground tabular-nums">{value}</p>
    {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
  </div>
);

const CardFooter = ({ profile: sp }: { profile: GrowthProfile }) => {
  const confidence = sp.completedExperiments >= 3 ? "HIGH" : sp.completedExperiments >= 2 ? "MEDIUM" : "LOW";
  const confidenceColor = sp.completedExperiments >= 3 ? "bg-emerald-500" : sp.completedExperiments >= 2 ? "bg-amber-500" : "bg-red-400";
  const confidenceWidth = `${Math.min((sp.completedExperiments / 3) * 100, 100)}%`;

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="text-xs font-normal text-muted-foreground/70">Propagation Methods</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sp.propagationMethods.map((m) => (
          <span key={m} className="text-xs font-normal px-2 py-1 bg-muted/50 text-muted-foreground/70 rounded-lg">{m}</span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">Last calculated: {sp.lastCalculated}</p>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-1">
          <span>DATA CONFIDENCE</span>
          <span>{confidence}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-lg">
          <div className={cn("h-full transition-all", confidenceColor)} style={{ width: confidenceWidth }} />
        </div>
      </div>
    </div>
  );
};

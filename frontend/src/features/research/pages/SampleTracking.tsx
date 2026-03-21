/* ═══════════════════════════════════════════════════════════════════════════
 * SampleTracking — Species growth profiles fetched from the API.
 *
 * Uses the speciesAnalyticsService to load live data.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import {
    Activity,
    BarChart3,
    Clock,
    FlaskConical,
    Loader2,
    Sprout,
    TrendingUp,
} from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/core/layouts/AppLayout";
import PageHeader from "@/shared/components/PageHeader";
import { cn } from "@/shared/lib/utils";

// ─── Services & Mappers ────────────────────────────────────────────────────
import { useSpeciesGrowthProfiles } from "@/features/research/services";
import type { SpeciesGrowthProfile } from "@/features/research/types";
import { mapSpeciesProfile } from "@/shared/lib/api-mappers";
import { useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const SampleTracking = () => {
  const { data: rawProfiles, isLoading } = useSpeciesGrowthProfiles();

  const profiles = useMemo(
    () => (rawProfiles ?? []).map(mapSpeciesProfile),
    [rawProfiles],
  );

  const sorted = useMemo(
    () =>
      [...profiles].sort(
        (a, b) => b.avgMultiplicationRate - a.avgMultiplicationRate,
      ),
    [profiles],
  );

  const summaryStats = useMemo(
    () => [
      { label: "Species Tracked", value: profiles.length },
      {
        label: "Total Experiments",
        value: profiles.reduce((s, p) => s + p.totalExperiments, 0),
      },
      {
        label: "Avg Mult. Rate",
        value:
          profiles.length > 0
            ? `${(profiles.reduce((s, p) => s + p.avgMultiplicationRate, 0) / profiles.length).toFixed(1)}×`
            : "—",
        highlight: "primary",
      },
      {
        label: "Avg Survival",
        value:
          profiles.length > 0
            ? `${(profiles.reduce((s, p) => s + p.avgSurvivalRate, 0) / profiles.length).toFixed(1)}%`
            : "—",
        highlight: "emerald",
      },
    ],
    [profiles],
  );

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="page-content">
        <PageHeader
          icon={Sprout}
          title="Sample Tracking"
          description="Species growth profiles and aggregated statistics from completed experiments."
        />

        <SummaryRow stats={summaryStats} />

        {sorted.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No species data available yet. Complete some experiments to see
            profiles here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {sorted.map((sp, idx) => (
              <SpeciesProfileCard
                key={sp.speciesId}
                profile={sp}
                isTopYield={idx === 0}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default SampleTracking;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Summary Row ───────────────────────────────────────────────────────── */

const SummaryRow = ({
  stats,
}: {
  stats: { label: string; value: string | number; highlight?: string }[];
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className="bg-card rounded-xl p-4 border border-border/60"
      >
        <p className="text-xs font-normal text-muted-foreground/70">
          {stat.label}
        </p>
        <p
          className={cn(
            "text-2xl font-medium tabular-nums mt-1",
            stat.highlight === "primary"
              ? "text-primary"
              : stat.highlight === "emerald"
                ? "text-emerald-600"
                : "text-foreground",
          )}
        >
          {stat.value}
        </p>
      </div>
    ))}
  </div>
);

/* ─── Species Profile Card ──────────────────────────────────────────────── */

const SpeciesProfileCard = ({
  profile: sp,
  isTopYield,
}: {
  profile: SpeciesGrowthProfile;
  isTopYield: boolean;
}) => (
  <div className="bg-card rounded-xl border border-border/60 hover:bg-muted/30 transition-colors">
    <CardHeader
      commonName={sp.commonName}
      speciesName={sp.speciesName}
      isTopYield={isTopYield}
    />
    <StatsGrid profile={sp} />
    <CardFooter profile={sp} />
  </div>
);

const CardHeader = ({
  commonName,
  speciesName,
  isTopYield,
}: {
  commonName: string;
  speciesName: string;
  isTopYield: boolean;
}) => (
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

const StatsGrid = ({ profile: sp }: { profile: SpeciesGrowthProfile }) => (
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
      value={
        <>
          {sp.avgCycleDurationWeeks}{" "}
          <span className="text-sm font-medium">wks</span>
        </>
      }
    />
    <MetricCell
      icon={FlaskConical}
      label="Experiments"
      value={
        <>
          {sp.completedExperiments}
          <span className="text-sm text-muted-foreground font-medium">
            /{sp.totalExperiments}
          </span>
        </>
      }
      detail="completed / total"
    />
  </div>
);

const MetricCell = ({
  icon: Icon,
  iconClass,
  label,
  value,
  detail,
}: {
  icon: React.ElementType;
  iconClass?: string;
  label: string;
  value: React.ReactNode;
  detail?: string;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-1">
      <Icon
        className={cn("h-3.5 w-3.5", iconClass || "text-muted-foreground/50")}
      />
      <span className="text-xs font-normal text-muted-foreground/70">
        {label}
      </span>
    </div>
    <p className="text-xl font-medium text-foreground tabular-nums">{value}</p>
    {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
  </div>
);

const CardFooter = ({ profile: sp }: { profile: SpeciesGrowthProfile }) => {
  const confidence =
    sp.completedExperiments >= 3
      ? "HIGH"
      : sp.completedExperiments >= 2
        ? "MEDIUM"
        : "LOW";
  const confidenceColor =
    sp.completedExperiments >= 3
      ? "bg-emerald-500"
      : sp.completedExperiments >= 2
        ? "bg-amber-500"
        : "bg-red-400";
  const confidenceWidth = `${Math.min((sp.completedExperiments / 3) * 100, 100)}%`;

  return (
    <div className="px-5 pb-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="h-3.5 w-3.5 text-muted-foreground/50" />
        <span className="text-xs font-normal text-muted-foreground/70">
          Propagation Methods
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sp.propagationMethods.map((m) => (
          <span
            key={m}
            className="text-xs font-normal px-2 py-1 bg-muted/50 text-muted-foreground/70 rounded-lg"
          >
            {m}
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Last calculated: {sp.lastCalculated}
      </p>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground mb-1">
          <span>DATA CONFIDENCE</span>
          <span>{confidence}</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-lg">
          <div
            className={cn("h-full transition-all", confidenceColor)}
            style={{ width: confidenceWidth }}
          />
        </div>
      </div>
    </div>
  );
};

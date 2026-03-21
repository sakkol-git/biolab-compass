// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH DASHBOARD — Custom Hook (Phase 3 → Phase 4: Live API)
// ═══════════════════════════════════════════════════════════════════════════
//
// Fetches ALL data via the service layer (React Query).
// Returns a memoized `ResearchDashboardConfig` plus loading/error state.
// Zero mock data — every number comes from the backend.
// ═══════════════════════════════════════════════════════════════════════════

import {
    useExperimentHealthScores,
    useExperimentList,
    useExperimentStats,
    useGrowthStageDistribution,
    useProtocolList,
    useSpeciesGrowthProfiles,
} from "@/features/research/services";
import {
    mapExperiment,
    mapSpeciesProfile,
    toTitleCase,
} from "@/shared/lib/api-mappers";
import { experimentStatusColors } from "@/shared/lib/status-styles";
import {
    Activity,
    Award,
    Beaker,
    BookOpen,
    FileText,
    Microscope,
    Sprout,
    Target,
    TestTubes,
    TrendingUp,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import type {
    BarChartDataPoint,
    HealthScoreEntry,
    KpiStat,
    ResearchDashboardConfig,
    StageCount,
    StatusSlice,
} from "./types";

// ─── Return Type ───────────────────────────────────────────────────────────

export interface UseResearchDashboardResult {
  config: ResearchDashboardConfig | null;
  isLoading: boolean;
}

// ─── Pure Helpers ──────────────────────────────────────────────────────────

function buildDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── The Hook ──────────────────────────────────────────────────────────────

export function useResearchDashboard(): UseResearchDashboardResult {
  // ── API Queries ──────────────────────────────────────────────────
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useExperimentStats();

  const {
    data: experimentsPage,
    isLoading: expLoading,
    error: expError,
  } = useExperimentList({ per_page: 100 });

  const { data: protocolsPage, isLoading: protLoading } = useProtocolList({
    per_page: 1,
  });

  const { data: speciesProfiles, isLoading: speciesLoading } =
    useSpeciesGrowthProfiles();

  const { data: healthScoresRaw, isLoading: healthLoading } =
    useExperimentHealthScores();

  const { data: stageDistRaw, isLoading: stageLoading } =
    useGrowthStageDistribution();

  const isLoading =
    statsLoading ||
    expLoading ||
    protLoading ||
    speciesLoading ||
    healthLoading ||
    stageLoading;

  // ── Error toasts ────────────────────────────────────────────────
  useEffect(() => {
    if (statsError) toast.error("Failed to load experiment statistics");
    if (expError) toast.error("Failed to load experiments");
  }, [statsError, expError]);

  // ── Config Assembly ──────────────────────────────────────────────
  const config = useMemo<ResearchDashboardConfig | null>(() => {
    if (isLoading || !stats) return null;

    // Map API → display types
    const experiments = (experimentsPage?.data ?? []).map(mapExperiment);
    const profiles = (speciesProfiles ?? []).map(mapSpeciesProfile);
    const totalProtocols = protocolsPage?.meta?.total ?? 0;

    // ── KPIs (from stats endpoint) ─────────────────────────────
    const kpiStats: KpiStat[] = [
      {
        title: "Active Experiments",
        value: stats.active,
        subtitle: `${stats.completed} completed`,
        icon: <TestTubes className="h-5 w-5 text-primary" />,
      },
      {
        title: "Total Seedlings",
        value: stats.total_seedlings.toLocaleString(),
        subtitle: "Across all experiments",
        icon: <Sprout className="h-5 w-5 text-primary" />,
      },
      {
        title: "Avg Survival Rate",
        value: `${(stats.avg_survival_rate ?? 0).toFixed(1)}%`,
        subtitle: "Completed experiments",
        icon: <Activity className="h-5 w-5 text-primary" />,
      },
      {
        title: "Protocols",
        value: totalProtocols,
        subtitle: `${stats.species_count} species tracked`,
        icon: <BookOpen className="h-5 w-5 text-primary" />,
      },
      {
        title: "Total Experiments",
        value: stats.total,
        subtitle: `${stats.planning} in planning`,
        icon: <FileText className="h-5 w-5 text-primary" />,
      },
      {
        title: "Avg Mult. Rate",
        value: `${(stats.avg_multiplication_rate ?? 0).toFixed(1)}×`,
        subtitle: "Across all species",
        icon: <TrendingUp className="h-5 w-5 text-primary" />,
      },
    ];

    // ── Status distribution (from experiments list) ────────────
    const statusCounts: Record<string, number> = {};
    experiments.forEach((e) => {
      statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
    });
    const statusDist: StatusSlice[] = Object.entries(statusCounts)
      .filter(([, v]) => v > 0)
      .map(([name, value]) => ({
        name,
        value,
        fill: experimentStatusColors[name] ?? "hsl(var(--muted-foreground))",
      }));

    // ── Species analytics ──────────────────────────────────────
    const topSpecies = [...profiles]
      .sort((a, b) => b.avgMultiplicationRate - a.avgMultiplicationRate)
      .slice(0, 4);

    const speciesComparison: BarChartDataPoint[] = profiles.map((sp) => ({
      label: sp.commonName,
      value: sp.avgMultiplicationRate,
    }));

    const survivalBySpecies: BarChartDataPoint[] = profiles.map((sp) => ({
      label: sp.commonName,
      value: sp.avgSurvivalRate,
    }));

    // ── Method distribution ────────────────────────────────────
    const methodCounts: Record<string, number> = {};
    experiments.forEach((e) => {
      methodCounts[e.propagationMethod] =
        (methodCounts[e.propagationMethod] || 0) + 1;
    });
    const methodDist: BarChartDataPoint[] = Object.entries(methodCounts).map(
      ([label, value]) => ({ label, value }),
    );

    // ── Health scores ──────────────────────────────────────────
    const healthScores: HealthScoreEntry[] = (healthScoresRaw ?? []).map(
      (hs) => ({
        experimentId: String(hs.experiment_id),
        experimentCode: hs.experiment_code,
        commonName: hs.species,
        score: hs.health_score ?? 0,
      }),
    );

    // ── Growth stages ──────────────────────────────────────────
    const stages: StageCount[] = Object.entries(stageDistRaw ?? {}).map(
      ([stage, count]) => ({ stage: toTitleCase(stage), count }),
    );

    // ── Recent experiments ─────────────────────────────────────
    const recentExperiments = [...experiments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);

    // ── Assemble Config ────────────────────────────────────────
    return {
      header: {
        icon: Microscope,
        title: "Research Overview",
        subtitle:
          "Track experiments, monitor growth data, and manage protocols across your lab.",
        dateLabel: buildDateLabel(),
      },

      globalWidgets: [{ type: "kpi-row", stats: kpiStats }],

      tabs: [
        {
          id: "overview",
          label: "Overview",
          icon: Microscope,
          widgets: [
            {
              type: "recent-experiments",
              title: "Recent Experiments",
              navigateTo: "/research/experiments",
              experiments: recentExperiments,
            },
            {
              type: "status-pie",
              title: "Experiment Status",
              data: statusDist,
            },
            {
              type: "top-species",
              title: "Top Species by Yield",
              species: topSpecies,
            },
            {
              type: "growth-stage",
              title: "Current Growth Stages",
              stages,
            },
            {
              type: "quick-links",
              links: [
                {
                  title: "Experiments",
                  description: "Manage propagation experiments",
                  icon: TestTubes,
                  url: "/research/experiments",
                  count: stats.total,
                },
                {
                  title: "Protocols",
                  description: "SOPs and procedures",
                  icon: BookOpen,
                  url: "/research/protocols",
                  count: totalProtocols,
                },
                {
                  title: "Growth Analysis",
                  description: "Charts and trends",
                  icon: TrendingUp,
                  url: "/research/analysis",
                },
                {
                  title: "Sample Tracking",
                  description: "Species growth profiles",
                  icon: Sprout,
                  url: "/research/samples",
                  count: profiles.length,
                },
              ],
            },
          ],
        },
        {
          id: "analytics",
          label: "Analytics",
          icon: TrendingUp,
          widgets: [
            {
              type: "bar-chart",
              title: "Species Multiplication Rates",
              titleIcon: Award,
              data: speciesComparison,
              fill: "hsl(var(--primary))",
              formatValue: (v: number) => `${v}×`,
              valueLabel: "Mult. Rate",
            },
            {
              type: "bar-chart",
              title: "Survival Rate by Species",
              titleIcon: Target,
              data: survivalBySpecies,
              fill: "hsl(145, 63%, 32%)",
              yAxisDomain: [80, 100],
              formatValue: (v: number) => `${v}%`,
              valueLabel: "Survival",
            },
            {
              type: "bar-chart",
              title: "Experiments by Propagation Method",
              titleIcon: Beaker,
              data: methodDist,
              fill: "hsl(175, 65%, 35%)",
              formatValue: (v: number) => String(v),
              valueLabel: "Experiments",
            },
            {
              type: "health-score-grid",
              title: "Latest Health Scores",
              titleIcon: Activity,
              entries: healthScores,
            },
            {
              type: "species-table",
              title: "Full Species Performance Data",
              profiles,
            },
          ],
        },
      ],
    };
  }, [
    isLoading,
    stats,
    experimentsPage,
    protocolsPage,
    speciesProfiles,
    healthScoresRaw,
    stageDistRaw,
  ]);

  return { config, isLoading };
}

// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH DASHBOARD — Custom Hook (Phase 3)
// ═══════════════════════════════════════════════════════════════════════════
//
// Owns ALL business logic: KPI computation, data aggregation, sorting,
// and full page configuration assembly.
//
// The hook returns a memoized `ResearchDashboardConfig` — the single
// data structure consumed by the rendering engine.
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import {
  Microscope, TestTubes, BookOpen, TrendingUp, Sprout,
  Activity, FileText, Award, Target, Beaker,
} from "lucide-react";
import { experimentStatusColors } from "@/lib/status-styles";
import {
  experimentsData, growthLogsData, protocolsData, speciesGrowthProfiles,
} from "@/data/mockResearchData";
import type {
  ResearchDashboardConfig,
  KpiStat,
  StatusSlice,
  BarChartDataPoint,
  HealthScoreEntry,
  StageCount,
} from "./types";

// ─── Pure Helpers ──────────────────────────────────────────────────────────

function buildDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function computeKpiStats(): KpiStat[] {
  const activeExperiments = experimentsData.filter((e) => e.status === "Active").length;
  const completedExperiments = experimentsData.filter((e) => e.status === "Completed").length;
  const totalCurrentSeedlings = experimentsData.reduce((sum, e) => sum + e.currentCount, 0);
  const avgSurvival = experimentsData
    .filter((e) => e.avgSurvivalRate)
    .reduce((sum, e, _, arr) => sum + (e.avgSurvivalRate || 0) / arr.length, 0);
  const activeProtocols = protocolsData.filter((p) => p.status === "Active").length;
  const totalGrowthLogs = Object.values(growthLogsData).reduce((sum, logs) => sum + logs.length, 0);
  const avgMultiplicationRate =
    speciesGrowthProfiles.reduce((s, sp) => s + sp.avgMultiplicationRate, 0) /
    speciesGrowthProfiles.length;

  return [
    {
      title: "Active Experiments",
      value: activeExperiments,
      subtitle: `${completedExperiments} completed`,
      icon: <TestTubes className="h-5 w-5 text-primary" />,
      trend: { value: 15, label: "this quarter", positive: true },
    },
    {
      title: "Total Seedlings",
      value: totalCurrentSeedlings.toLocaleString(),
      subtitle: "Across all experiments",
      icon: <Sprout className="h-5 w-5 text-primary" />,
      trend: { value: 23, label: "vs last month", positive: true },
    },
    {
      title: "Avg Survival Rate",
      value: `${avgSurvival.toFixed(1)}%`,
      subtitle: "Completed experiments",
      icon: <Activity className="h-5 w-5 text-primary" />,
      trend: { value: 2.1, label: "improvement", positive: true },
    },
    {
      title: "Active Protocols",
      value: activeProtocols,
      subtitle: `${protocolsData.length} total`,
      icon: <BookOpen className="h-5 w-5 text-primary" />,
    },
    {
      title: "Growth Logs",
      value: totalGrowthLogs,
      subtitle: "Data points recorded",
      icon: <FileText className="h-5 w-5 text-primary" />,
    },
    {
      title: "Avg Mult. Rate",
      value: `${avgMultiplicationRate.toFixed(1)}×`,
      subtitle: "Across all species",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
  ];
}

function buildStatusDistribution(): StatusSlice[] {
  return ["Planning", "Active", "Paused", "Completed", "Failed"]
    .map((s) => ({
      name: s,
      value: experimentsData.filter((e) => e.status === s).length,
      fill: experimentStatusColors[s],
    }))
    .filter((d) => d.value > 0);
}

function buildSpeciesComparison(): BarChartDataPoint[] {
  return speciesGrowthProfiles.map((sp) => ({
    label: sp.commonName,
    value: sp.avgMultiplicationRate,
  }));
}

function buildSurvivalBySpecies(): BarChartDataPoint[] {
  return speciesGrowthProfiles.map((sp) => ({
    label: sp.commonName,
    value: sp.avgSurvivalRate,
  }));
}

function buildMethodDistribution(): BarChartDataPoint[] {
  const methodCounts: Record<string, number> = {};
  experimentsData.forEach((e) => {
    methodCounts[e.propagationMethod] = (methodCounts[e.propagationMethod] || 0) + 1;
  });
  return Object.entries(methodCounts).map(([label, value]) => ({ label, value }));
}

function buildHealthScores(): HealthScoreEntry[] {
  return experimentsData
    .filter((e) => growthLogsData[e.id]?.length > 0)
    .map((exp) => {
      const logs = growthLogsData[exp.id];
      const lastLog = logs[logs.length - 1];
      return {
        experimentId: exp.id,
        experimentCode: exp.experimentCode,
        commonName: exp.commonName,
        score: lastLog.healthScore,
      };
    });
}

function buildGrowthStages(): StageCount[] {
  const stageCounts: Record<string, number> = {};
  experimentsData.forEach((e) => {
    const logs = growthLogsData[e.id];
    if (logs?.length) {
      const lastLog = logs[logs.length - 1];
      stageCounts[lastLog.growthStage] = (stageCounts[lastLog.growthStage] || 0) + 1;
    }
  });
  return Object.entries(stageCounts).map(([stage, count]) => ({ stage, count }));
}

// ─── Return Type ───────────────────────────────────────────────────────────

export interface UseResearchDashboardResult {
  config: ResearchDashboardConfig;
}

// ─── The Hook ──────────────────────────────────────────────────────────────

export function useResearchDashboard(): UseResearchDashboardResult {
  const config = useMemo<ResearchDashboardConfig>(() => {
    const kpiStats = computeKpiStats();
    const statusDist = buildStatusDistribution();
    const topSpecies = [...speciesGrowthProfiles]
      .sort((a, b) => b.avgMultiplicationRate - a.avgMultiplicationRate)
      .slice(0, 4);
    const recentExperiments = [...experimentsData]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      header: {
        icon: Microscope,
        title: "Research Overview",
        subtitle: "Track experiments, monitor growth data, and manage protocols across your lab.",
        dateLabel: buildDateLabel(),
      },

      globalWidgets: [
        { type: "kpi-row", stats: kpiStats },
      ],

      tabs: [
        // ─── Overview Tab ────────────────────────────────
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
              stages: buildGrowthStages(),
            },
            {
              type: "quick-links",
              links: [
                {
                  title: "Experiments",
                  description: "Manage propagation experiments",
                  icon: TestTubes,
                  url: "/research/experiments",
                  count: experimentsData.length,
                },
                {
                  title: "Protocols",
                  description: "SOPs and procedures",
                  icon: BookOpen,
                  url: "/research/protocols",
                  count: protocolsData.length,
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
                  count: speciesGrowthProfiles.length,
                },
              ],
            },
          ],
        },
        // ─── Analytics Tab ───────────────────────────────
        {
          id: "analytics",
          label: "Analytics",
          icon: TrendingUp,
          widgets: [
            {
              type: "bar-chart",
              title: "Species Multiplication Rates",
              titleIcon: Award,
              data: buildSpeciesComparison(),
              fill: "hsl(var(--primary))",
              formatValue: (v: number) => `${v}×`,
              valueLabel: "Mult. Rate",
            },
            {
              type: "bar-chart",
              title: "Survival Rate by Species",
              titleIcon: Target,
              data: buildSurvivalBySpecies(),
              fill: "hsl(145, 63%, 32%)",
              yAxisDomain: [80, 100],
              formatValue: (v: number) => `${v}%`,
              valueLabel: "Survival",
            },
            {
              type: "bar-chart",
              title: "Experiments by Propagation Method",
              titleIcon: Beaker,
              data: buildMethodDistribution(),
              fill: "hsl(175, 65%, 35%)",
              formatValue: (v: number) => String(v),
              valueLabel: "Experiments",
            },
            {
              type: "health-score-grid",
              title: "Latest Health Scores",
              titleIcon: Activity,
              entries: buildHealthScores(),
            },
            {
              type: "species-table",
              title: "Full Species Performance Data",
              profiles: speciesGrowthProfiles,
            },
          ],
        },
      ],
    };
  }, []);

  return { config };
}

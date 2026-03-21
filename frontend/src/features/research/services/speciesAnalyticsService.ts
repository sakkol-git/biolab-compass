// ─── Species Analytics Service ────────────────────────────────────────────
// Read-only analytics endpoints — no CRUD.
// Wraps the /species-analytics/* routes.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import type {
    ExperimentHealthScore,
    GrowthComparisonItem,
    GrowthCurveDataPoint,
    GrowthStageDistribution,
    SpeciesGrowthProfileApi,
} from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

// ── Query Keys ────────────────────────────────────────────────────────────

export const speciesAnalyticsKeys = {
  all: ["species-analytics"] as const,
  profiles: () => [...speciesAnalyticsKeys.all, "profiles"] as const,
  comparison: () => [...speciesAnalyticsKeys.all, "comparison"] as const,
  growthCurve: (experimentId: number) =>
    [...speciesAnalyticsKeys.all, "growth-curve", experimentId] as const,
  stageDistribution: () =>
    [...speciesAnalyticsKeys.all, "stage-distribution"] as const,
  healthScores: () => [...speciesAnalyticsKeys.all, "health-scores"] as const,
};

// ── HTTP Service ──────────────────────────────────────────────────────────

export const speciesAnalyticsService = {
  /** GET /species-analytics/profiles */
  profiles: (): Promise<SpeciesGrowthProfileApi[]> =>
    api
      .get<{ data: SpeciesGrowthProfileApi[] }>("/species-analytics/profiles")
      .then((r) => r.data.data),

  /** GET /species-analytics/comparison */
  comparison: (): Promise<GrowthComparisonItem[]> =>
    api
      .get<{ data: GrowthComparisonItem[] }>("/species-analytics/comparison")
      .then((r) => r.data.data),

  /** GET /species-analytics/growth-curve/:experimentId */
  growthCurve: (experimentId: number): Promise<GrowthCurveDataPoint[]> =>
    api
      .get<{
        data: GrowthCurveDataPoint[];
      }>(`/species-analytics/growth-curve/${experimentId}`)
      .then((r) => r.data.data),

  /** GET /species-analytics/stage-distribution */
  stageDistribution: (): Promise<GrowthStageDistribution> =>
    api
      .get<{
        data: GrowthStageDistribution;
      }>("/species-analytics/stage-distribution")
      .then((r) => r.data.data),

  /** GET /species-analytics/health-scores */
  healthScores: (): Promise<ExperimentHealthScore[]> =>
    api
      .get<{
        data: ExperimentHealthScore[];
      }>("/species-analytics/health-scores")
      .then((r) => r.data.data),
};

// ── React Query Hooks ─────────────────────────────────────────────────────

/** Species-level growth profiles (aggregated experiment metrics). */
export function useSpeciesGrowthProfiles() {
  return useQuery<SpeciesGrowthProfileApi[]>({
    queryKey: speciesAnalyticsKeys.profiles(),
    queryFn: () => speciesAnalyticsService.profiles(),
  });
}

/** Comparison chart data across species. */
export function useGrowthComparison() {
  return useQuery<GrowthComparisonItem[]>({
    queryKey: speciesAnalyticsKeys.comparison(),
    queryFn: () => speciesAnalyticsService.comparison(),
  });
}

/** Time-series growth data for a single experiment. */
export function useGrowthCurve(experimentId: number | undefined) {
  return useQuery<GrowthCurveDataPoint[]>({
    queryKey: speciesAnalyticsKeys.growthCurve(experimentId!),
    queryFn: () => speciesAnalyticsService.growthCurve(experimentId!),
    enabled: !!experimentId,
  });
}

/** Distribution of growth stages across active experiments. */
export function useGrowthStageDistribution() {
  return useQuery<GrowthStageDistribution>({
    queryKey: speciesAnalyticsKeys.stageDistribution(),
    queryFn: () => speciesAnalyticsService.stageDistribution(),
  });
}

/** Health scores for all active experiments. */
export function useExperimentHealthScores() {
  return useQuery<ExperimentHealthScore[]>({
    queryKey: speciesAnalyticsKeys.healthScores(),
    queryFn: () => speciesAnalyticsService.healthScores(),
  });
}

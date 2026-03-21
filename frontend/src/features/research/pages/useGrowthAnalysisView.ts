/* ═══════════════════════════════════════════════════════════════════════════
 * useGrowthAnalysisView — All state + derived data for Growth Analysis.
 *
 * Connects to the /species-analytics/* endpoints via React Query.
 * This is a read-only analytics dashboard — no CRUD.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useMemo, useState } from "react";

import {
  useExperimentHealthScores,
  useExperimentList,
  useGrowthComparison,
  useGrowthCurve,
  useSpeciesGrowthProfiles,
} from "@/features/research/services";

export function useGrowthAnalysisView() {
  const [selectedExpId, setSelectedExpId] = useState<number | undefined>(
    undefined,
  );

  // ── API data ──
  const { data: comparisonRaw, isLoading: comparisonLoading } =
    useGrowthComparison();

  const { data: profilesRaw, isLoading: profilesLoading } =
    useSpeciesGrowthProfiles();

  const { data: healthRaw, isLoading: healthLoading } =
    useExperimentHealthScores();

  const { data: experimentsResponse, isLoading: experimentsLoading } =
    useExperimentList({ per_page: 100, status: "active" });

  const { data: curveRaw, isLoading: curveLoading } =
    useGrowthCurve(selectedExpId);

  // ── Derived data ──
  const comparisonData = useMemo(
    () =>
      (comparisonRaw ?? []).map((item) => ({
        name: item.species,
        multiplication: item.multiplication_rate,
        survival: item.survival_rate,
        experiments: item.experiments,
      })),
    [comparisonRaw],
  );

  const radarData = useMemo(
    () =>
      (profilesRaw ?? []).map((sp) => ({
        species: sp.common_name,
        Multiplication: Math.min((sp.avg_multiplication_rate / 12) * 100, 100),
        Survival: sp.avg_survival_rate,
        Speed: sp.avg_cycle_days
          ? Math.max(0, ((140 - sp.avg_cycle_days) / 140) * 100)
          : 50,
        Consistency:
          sp.max_multiplication_rate > 0
            ? Math.max(
                0,
                100 -
                  ((sp.max_multiplication_rate - sp.min_multiplication_rate) /
                    sp.max_multiplication_rate) *
                    100,
              )
            : 50,
        Experiments: Math.min((sp.total_experiments / 5) * 100, 100),
      })),
    [profilesRaw],
  );

  const experiments = experimentsResponse?.data ?? [];

  // Auto-select first experiment when experiments load
  const experimentsWithIds = useMemo(() => experiments, [experiments]);
  if (selectedExpId === undefined && experimentsWithIds.length > 0) {
    setSelectedExpId(experimentsWithIds[0].id);
  }

  const experimentLogs = curveRaw ?? [];

  const healthScores = useMemo(
    () =>
      (healthRaw ?? []).map((h) => ({
        code: h.experiment_code,
        healthScore: h.health_score ?? 0,
        stage: h.growth_stage,
        week: h.week_number ?? 0,
        species: h.species,
      })),
    [healthRaw],
  );

  const isLoading =
    comparisonLoading || profilesLoading || healthLoading || experimentsLoading;

  const updateSelectedExperiment = (id: string) => setSelectedExpId(Number(id));

  return {
    selectedExpId: selectedExpId ? String(selectedExpId) : "",
    updateSelectedExperiment,
    comparisonData,
    radarData,
    experimentLogs,
    curveLoading,
    experimentsWithLogs: experimentsWithIds.map((e) => ({
      id: String(e.id),
      experimentCode: e.experiment_code,
      title: e.title,
    })),
    healthScores,
    isLoading,
  };
}

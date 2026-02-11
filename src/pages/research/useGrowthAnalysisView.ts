/* ═══════════════════════════════════════════════════════════════════════════
 * useGrowthAnalysisView — All state + derived data for Growth Analysis.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useMemo } from "react";
import { speciesGrowthProfiles, experimentsData, growthLogsData } from "@/data/mockResearchData";
import type { GrowthLog } from "@/types/research";

export function useGrowthAnalysisView() {
  const [selectedExpId, setSelectedExpId] = useState("EXP-001");

  const comparisonData = useMemo(() =>
    speciesGrowthProfiles.map((sp) => ({
      name: sp.commonName,
      multiplication: sp.avgMultiplicationRate,
      survival: sp.avgSurvivalRate,
      cycle: sp.avgCycleDurationWeeks,
      yield: sp.avgYieldPerInitial,
    })),
  []);

  const radarData = useMemo(() =>
    speciesGrowthProfiles.map((sp) => ({
      species: sp.commonName,
      Multiplication: (sp.avgMultiplicationRate / 12) * 100,
      Survival: sp.avgSurvivalRate,
      Speed: ((20 - sp.avgCycleDurationWeeks) / 20) * 100,
      Consistency: 100 - sp.stdDevSurvival * 10,
      Experiments: (sp.totalExperiments / 5) * 100,
    })),
  []);

  const experimentLogs: GrowthLog[] = growthLogsData[selectedExpId] || [];
  const experimentsWithLogs = useMemo(() =>
    experimentsData.filter((e) => growthLogsData[e.id]?.length > 0),
  []);

  const healthScores = useMemo(() =>
    experimentsWithLogs.map((exp) => {
      const logs = growthLogsData[exp.id];
      const lastLog = logs[logs.length - 1];
      return { code: exp.experimentCode, healthScore: lastLog.healthScore, stage: lastLog.growthStage, week: lastLog.weekNumber };
    }),
  [experimentsWithLogs]);

  const updateSelectedExperiment = (id: string) => setSelectedExpId(id);

  return {
    selectedExpId, updateSelectedExperiment,
    comparisonData, radarData,
    experimentLogs, experimentsWithLogs, healthScores,
  };
}

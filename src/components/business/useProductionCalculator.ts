/* ═══════════════════════════════════════════════════════════════════════════
 * useProductionCalculator — State + logic for the ProductionCalculator.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState, useMemo, useCallback } from "react";
import { calculateProductionForecast } from "@/lib/calculator";
import { speciesGrowthProfiles } from "@/data/mockResearchData";
import type { ProductionForecast } from "@/types/business";

export function useProductionCalculator(onForecastGenerated?: (f: ProductionForecast) => void) {
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [quantity, setQuantity] = useState("");
  const [forecast, setForecast] = useState<ProductionForecast | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const selectedProfile = useMemo(
    () => speciesGrowthProfiles.find((p) => p.speciesId === selectedSpecies) ?? null,
    [selectedSpecies],
  );

  const canCalculate = Boolean(selectedSpecies && quantity);

  const generateForecast = useCallback(() => {
    if (!selectedProfile || !quantity) return;

    const result = calculateProductionForecast({
      profile: selectedProfile,
      desiredQuantity: Number(quantity),
      calculatedBy: "Dr. Sarah Chen",
    });
    setForecast(result);
    setHasCalculated(true);
    onForecastGenerated?.(result);
  }, [selectedProfile, quantity, onForecastGenerated]);

  const lowConfidence = selectedProfile !== null && selectedProfile.completedExperiments < 3;

  return {
    // state
    selectedSpecies,
    setSelectedSpecies,
    quantity,
    setQuantity,
    forecast,
    hasCalculated,

    // derived
    selectedProfile,
    canCalculate,
    lowConfidence,
    speciesOptions: speciesGrowthProfiles,

    // actions
    generateForecast,
  } as const;
}

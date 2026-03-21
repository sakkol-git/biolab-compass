/* ═══════════════════════════════════════════════════════════════════════════
 * useProductionCalculator — State + logic for the ProductionCalculator.
 *
 * Phase 4: Uses the species analytics API for growth profiles
 * and the production forecast API for calculation.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useCalculateForecast } from "@/features/business/services";
import type { ProductionForecast } from "@/features/business/types";
import { useSpeciesGrowthProfiles } from "@/features/research/services";
import type { SpeciesGrowthProfile } from "@/features/research/types";
import {
  mapProductionForecast,
  mapSpeciesProfile,
} from "@/shared/lib/api-mappers";
import { calculateProductionForecast } from "@/shared/lib/calculator";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

export function useProductionCalculator(
  onForecastGenerated?: (f: ProductionForecast) => void,
) {
  const [selectedSpecies, setSelectedSpecies] = useState("");
  const [quantity, setQuantity] = useState("");
  const [forecast, setForecast] = useState<ProductionForecast | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // ── Fetch species profiles from API ──────────────────────────
  const { data: rawProfiles, isLoading: profilesLoading } =
    useSpeciesGrowthProfiles();
  const speciesOptions = useMemo(
    () => (rawProfiles ?? []).map(mapSpeciesProfile),
    [rawProfiles],
  );

  const calculateMutation = useCalculateForecast();

  const selectedProfile = useMemo(
    () =>
      speciesOptions.find(
        (p: SpeciesGrowthProfile) => p.speciesId === selectedSpecies,
      ) ?? null,
    [selectedSpecies, speciesOptions],
  );

  const canCalculate = Boolean(selectedSpecies && quantity && !isCalculating);

  const generateForecast = useCallback(() => {
    if (!selectedProfile || !quantity) return;
    setIsCalculating(true);

    // Try the API first; fall back to local calculation on error
    calculateMutation.mutate(
      {
        plant_species_id: Number(selectedSpecies),
        desired_quantity: Number(quantity),
      },
      {
        onSuccess: (resp) => {
          const mapped = mapProductionForecast(resp.data);
          setForecast(mapped);
          setHasCalculated(true);
          setIsCalculating(false);
          toast.success("Forecast calculated");
          onForecastGenerated?.(mapped);
        },
        onError: (err) => {
          console.error(
            "API Error:",
            (err as any).response?.data || (err as Error).message,
          );
          // Fallback: calculate locally using the species profile
          const result = calculateProductionForecast({
            profile: selectedProfile,
            desiredQuantity: Number(quantity),
            calculatedBy: "Local Calculation",
          });
          setForecast(result);
          setHasCalculated(true);
          setIsCalculating(false);
          toast.info("Calculated locally (API unavailable)");
          onForecastGenerated?.(result);
        },
      },
    );
  }, [
    selectedProfile,
    quantity,
    selectedSpecies,
    onForecastGenerated,
    calculateMutation,
  ]);

  const lowConfidence =
    selectedProfile !== null && selectedProfile.completedExperiments < 3;

  return {
    // state
    selectedSpecies,
    setSelectedSpecies,
    quantity,
    setQuantity,
    forecast,
    hasCalculated,
    isCalculating,
    isLoading: profilesLoading,

    // derived
    selectedProfile,
    canCalculate,
    lowConfidence,
    speciesOptions,

    // actions
    generateForecast,
  } as const;
}

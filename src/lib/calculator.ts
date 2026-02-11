// ═══════════════════════════════════════════════════════════════════════════
// PRODUCTION CALCULATOR — Forecasting Engine
// ═══════════════════════════════════════════════════════════════════════════

import type { SpeciesGrowthProfile } from "@/types/research";
import type { ProductionForecast } from "@/types/business";

interface CalculatorInput {
  profile: SpeciesGrowthProfile;
  desiredQuantity: number;
  propagationMethod?: string;
  calculatedBy?: string;
}

/**
 * Calculate a production forecast based on species growth profile data.
 *
 * Formula:
 *   initial_stock = desired_qty / (avg_mult_rate × avg_survival_rate)
 *   est_weeks = avg_cycle_weeks × ceil(log(desired/initial) / log(avg_mult_rate)) + buffer
 *   confidence = est_weeks ± (z_score × std_dev_adjustment)
 */
export function calculateProductionForecast(input: CalculatorInput): ProductionForecast {
  const { profile, desiredQuantity, propagationMethod, calculatedBy } = input;

  const survivalRate = profile.avgSurvivalRate / 100;
  const multRate = profile.avgMultiplicationRate;
  const cycleWeeks = profile.avgCycleDurationWeeks;
  const stdDev = profile.stdDevSurvival / 100;

  // Calculate initial stock needed
  const initialStock = Math.ceil(desiredQuantity / (multRate * survivalRate));

  // Calculate number of cycles needed
  const cycles = Math.max(1, Math.ceil(Math.log(desiredQuantity / initialStock) / Math.log(multRate)));

  // Estimated total weeks
  const bufferWeeks = Math.ceil(cycleWeeks * 0.15); // 15% safety buffer
  const estimatedWeeks = Math.ceil(cycleWeeks * (cycles / Math.max(cycles, 1))) + bufferWeeks;

  // Confidence interval (using z=1.645 for 90% CI)
  const zScore = 1.645;
  const weekVariance = cycleWeeks * stdDev * zScore;
  const confidenceLower = Math.max(1, Math.floor(estimatedWeeks - weekVariance));
  const confidenceUpper = Math.ceil(estimatedWeeks + weekVariance);

  // Generate weekly milestones
  const weeklyMilestones: { week: number; projected: number }[] = [];
  let currentCount = initialStock;
  for (let week = 1; week <= estimatedWeeks; week++) {
    // Apply survival attrition each week
    currentCount = Math.floor(currentCount * (1 - (1 - survivalRate) / cycleWeeks));

    // Apply multiplication at cycle boundaries
    if (week > 0 && week % Math.ceil(cycleWeeks / cycles) === 0) {
      currentCount = Math.floor(currentCount * multRate * survivalRate);
    }

    if (week <= 4 || week % 2 === 0 || week === estimatedWeeks) {
      weeklyMilestones.push({
        week,
        projected: Math.min(currentCount, Math.ceil(desiredQuantity * 1.05)),
      });
    }
  }

  // Ensure last milestone reaches target
  if (weeklyMilestones.length > 0) {
    weeklyMilestones[weeklyMilestones.length - 1].projected = desiredQuantity;
  }

  // Resource estimates
  const plantsPerGreenhouse = 5000;
  const greenhouses = Math.max(1, Math.ceil(desiredQuantity / plantsPerGreenhouse));
  const laborHoursPerThousand = 32;
  const laborHours = Math.ceil((desiredQuantity / 1000) * laborHoursPerThousand);
  const costPerSeedling = 0.85;
  const estimatedCost = Math.ceil(desiredQuantity * costPerSeedling);

  return {
    id: `FC-${Date.now()}`,
    speciesName: profile.speciesName,
    commonName: profile.commonName,
    desiredQuantity,
    recommendedInitialStock: initialStock,
    estimatedWeeks,
    confidenceLowerWeeks: confidenceLower,
    confidenceUpperWeeks: confidenceUpper,
    estimatedCycles: cycles,
    estimatedSurvivalRate: profile.avgSurvivalRate,
    estimatedMultiplicationRate: multRate,
    weeklyMilestones,
    resourceRequirements: {
      greenhouses,
      laborHours,
      estimatedCost,
    },
    propagationMethod: propagationMethod || profile.propagationMethods[0] || "Seed",
    createdAt: new Date().toISOString().split("T")[0],
    calculatedBy: calculatedBy || "System",
  };
}

/**
 * Format currency amount with proper formatting
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
}

/**
 * Format a number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}

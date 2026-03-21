<?php

declare(strict_types=1);

namespace App\Modules\Business\Services;

use App\Modules\Inventory\Models\PlantSpecies;
use App\Modules\Business\Models\ProductionForecast;
use App\Modules\Research\Services\SpeciesAnalyticsService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductionForecastService
{
    public function __construct(
        private readonly SpeciesAnalyticsService $analyticsService,
    ) {}

    /**
     * List saved forecasts.
     */
    public function list(?int $speciesId = null, int $perPage = 15): LengthAwarePaginator
    {
        return ProductionForecast::query()
            ->with(['species', 'calculator'])
            ->when($speciesId, fn ($q) => $q->where('plant_species_id', $speciesId))
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * Get a single forecast.
     */
    public function get(int $id): ProductionForecast
    {
        return ProductionForecast::with(['species', 'calculator'])->findOrFail($id);
    }

    /**
     * Calculate a production forecast from species historical data.
     * Port of frontend calculator.ts `calculateProductionForecast()`.
     *
     * @param  array<string,mixed>  $input  Keys: plant_species_id, desired_quantity, propagation_method?
     */
    public function calculateForecast(array $input, ?int $userId = null): ProductionForecast
    {
        $speciesId = (int) $input['plant_species_id'];
        $desiredQuantity = (int) $input['desired_quantity'];
        $species = PlantSpecies::findOrFail($speciesId);

        // Gather historical metrics from completed experiments via SpeciesAnalyticsService
        $profile = $this->analyticsService->getGrowthProfileForSpecies($speciesId);

        $survivalRate = $profile['avg_survival_rate'] / 100;
        $multRate = max(1.01, $profile['avg_multiplication_rate']); // prevent ÷0 / log(1)
        $cycleWeeks = max(1, $profile['avg_cycle_weeks']);
        $stdDev = $profile['std_dev_survival'] / 100;

        // Initial stock needed
        $initialStock = (int) ceil($desiredQuantity / ($multRate * $survivalRate));

        // Number of cycles
        $cycles = max(1, (int) ceil(log($desiredQuantity / max(1, $initialStock)) / log($multRate)));

        // Estimated total weeks (+ 15 % buffer)
        $bufferWeeks = (int) ceil($cycleWeeks * 0.15);
        $estimatedWeeks = (int) ceil($cycleWeeks * ($cycles / max($cycles, 1))) + $bufferWeeks;

        // Confidence interval (z = 1.645 for 90 % CI)
        $zScore = 1.645;
        $weekVariance = $cycleWeeks * $stdDev * $zScore;
        $confidenceLower = max(1, (int) floor($estimatedWeeks - $weekVariance));
        $confidenceUpper = (int) ceil($estimatedWeeks + $weekVariance);

        // Weekly milestones
        $weeklyMilestones = $this->generateWeeklyMilestones(
            $initialStock,
            $desiredQuantity,
            $estimatedWeeks,
            $survivalRate,
            $multRate,
            $cycleWeeks,
            $cycles,
        );

        // Resource estimates
        $plantsPerGreenhouse = 5000;
        $greenhouses = max(1, (int) ceil($desiredQuantity / $plantsPerGreenhouse));
        $laborHoursPerThousand = 32;
        $laborHours = (int) ceil(($desiredQuantity / 1000) * $laborHoursPerThousand);
        $costPerSeedling = 0.85;
        $estimatedCost = (int) ceil($desiredQuantity * $costPerSeedling);

        return ProductionForecast::create([
            'plant_species_id' => $speciesId,
            'calculated_by' => $userId,
            'desired_quantity' => $desiredQuantity,
            'recommended_initial_stock' => $initialStock,
            'estimated_weeks' => $estimatedWeeks,
            'confidence_lower_weeks' => $confidenceLower,
            'confidence_upper_weeks' => $confidenceUpper,
            'estimated_cycles' => $cycles,
            'estimated_survival_rate' => round($profile['avg_survival_rate'], 2),
            'estimated_multiplication_rate' => round($profile['avg_multiplication_rate'], 2),
            'propagation_method' => $input['propagation_method'] ?? null,
            'weekly_milestones' => $weeklyMilestones,
            'resource_requirements' => [
                'greenhouses' => $greenhouses,
                'laborHours' => $laborHours,
                'estimatedCost' => $estimatedCost,
            ],
        ]);
    }

    /**
     * Delete a saved forecast.
     */
    public function delete(ProductionForecast $forecast): void
    {
        $forecast->delete();
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    /**
     * Generate weekly milestone projections (port of frontend loop).
     *
     * @return array<int, array{week: int, projected: int}>
     */
    private function generateWeeklyMilestones(
        int $initialStock,
        int $desiredQuantity,
        int $estimatedWeeks,
        float $survivalRate,
        float $multRate,
        float $cycleWeeks,
        int $cycles,
    ): array {
        $milestones = [];
        $currentCount = $initialStock;
        $cycleLength = max(1, (int) ceil($cycleWeeks / $cycles));

        for ($week = 1; $week <= $estimatedWeeks; $week++) {
            // Weekly attrition
            $currentCount = (int) floor($currentCount * (1 - (1 - $survivalRate) / $cycleWeeks));

            // Multiplication at cycle boundaries
            if ($week % $cycleLength === 0) {
                $currentCount = (int) floor($currentCount * $multRate * $survivalRate);
            }

            // Include first 4 weeks, every even week, and last week
            if ($week <= 4 || $week % 2 === 0 || $week === $estimatedWeeks) {
                $milestones[] = [
                    'week' => $week,
                    'projected' => min($currentCount, (int) ceil($desiredQuantity * 1.05)),
                ];
            }
        }

        // Ensure last milestone reaches target
        if (count($milestones) > 0) {
            $milestones[count($milestones) - 1]['projected'] = $desiredQuantity;
        }

        return $milestones;
    }
}

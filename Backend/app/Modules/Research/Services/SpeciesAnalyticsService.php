<?php

declare(strict_types=1);

namespace App\Modules\Research\Services;

use App\Enums\GrowthStage;
use App\Modules\Research\Models\Experiment;
use App\Modules\Research\Models\GrowthLog;
use App\Modules\Inventory\Models\PlantSpecies;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SpeciesAnalyticsService
{
    /**
     * Per-species growth profiles (aggregated experiment metrics).
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function getSpeciesGrowthProfiles(): Collection
    {
        return PlantSpecies::query()
            ->withCount(['experiments'])
            ->withAvg('experiments', 'multiplication_rate')
            ->withAvg('experiments', 'avg_survival_rate')
            ->withMax('experiments', 'multiplication_rate')
            ->withMin('experiments', 'multiplication_rate')
            ->whereHas('experiments')
            ->get()
            ->map(fn (PlantSpecies $sp) => [
                'species_id' => $sp->id,
                'common_name' => $sp->common_name,
                'scientific_name' => $sp->scientific_name,
                'total_experiments' => $sp->experiments_count,
                'avg_multiplication_rate' => round((float) $sp->experiments_avg_multiplication_rate, 2),
                'avg_survival_rate' => round((float) $sp->experiments_avg_avg_survival_rate, 2),
                'max_multiplication_rate' => round((float) $sp->experiments_max_multiplication_rate, 2),
                'min_multiplication_rate' => round((float) $sp->experiments_min_multiplication_rate, 2),
                'avg_cycle_days' => $this->avgCycleDaysForSpecies($sp->id),
            ]);
    }

    /**
     * Bar chart data comparing key metrics across species.
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function getGrowthComparison(): Collection
    {
        return PlantSpecies::query()
            ->withCount(['experiments'])
            ->withAvg('experiments', 'multiplication_rate')
            ->withAvg('experiments', 'avg_survival_rate')
            ->whereHas('experiments')
            ->orderByDesc('experiments_count')
            ->limit(10)
            ->get()
            ->map(fn (PlantSpecies $sp) => [
                'species' => $sp->common_name,
                'experiments' => $sp->experiments_count,
                'multiplication_rate' => round((float) $sp->experiments_avg_multiplication_rate, 2),
                'survival_rate' => round((float) $sp->experiments_avg_avg_survival_rate, 2),
            ]);
    }

    /**
     * Time-series growth data for a single experiment (for line charts).
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function getGrowthCurveData(int $experimentId): Collection
    {
        return GrowthLog::forExperiment($experimentId)
            ->orderedByWeek()
            ->get()
            ->map(fn (GrowthLog $log) => [
                'week' => $log->week_number,
                'stage' => $log->growth_stage->value,
                'alive_count' => $log->alive_count,
                'seedling_count' => $log->seedling_count,
                'survival_rate' => (float) $log->survival_rate_pct,
                'multiplication_rate' => (float) $log->multiplication_rate,
                'health_score' => (float) $log->health_score,
                'avg_height_cm' => (float) $log->avg_height_cm,
                'log_date' => $log->log_date?->toDateString(),
            ]);
    }

    /**
     * Distribution of growth stages across all active experiments.
     *
     * @return Collection<string, int>
     */
    public function getGrowthStageDistribution(): Collection
    {
        // Get latest log per active experiment, then group by stage
        $latestLogs = GrowthLog::query()
            ->select('growth_logs.*')
            ->join(
                DB::raw('(SELECT experiment_id, MAX(week_number) as max_week FROM growth_logs WHERE deleted_at IS NULL GROUP BY experiment_id) as latest'),
                fn ($join) => $join
                    ->on('growth_logs.experiment_id', '=', 'latest.experiment_id')
                    ->on('growth_logs.week_number', '=', 'latest.max_week')
            )
            ->whereHas('experiment', fn ($q) => $q->active())
            ->get();

        // Build distribution with all stages represented
        $distribution = collect(GrowthStage::cases())
            ->mapWithKeys(fn (GrowthStage $stage) => [$stage->value => 0]);

        $latestLogs->each(function (GrowthLog $log) use (&$distribution) {
            $distribution[$log->growth_stage->value] = $distribution[$log->growth_stage->value] + 1;
        });

        return $distribution;
    }

    /**
     * Health scores for all active experiments (latest log per experiment).
     *
     * @return Collection<int, array<string, mixed>>
     */
    public function getExperimentHealthScores(): Collection
    {
        return Experiment::active()
            ->with(['species'])
            ->get()
            ->map(function (Experiment $exp) {
                $latest = $exp->growthLogs()
                    ->orderedByWeek()
                    ->latest('week_number')
                    ->first();

                return [
                    'experiment_id' => $exp->id,
                    'experiment_code' => $exp->experiment_code,
                    'species' => $exp->species?->common_name ?? 'N/A',
                    'health_score' => $latest ? (float) $latest->health_score : null,
                    'growth_stage' => $latest?->growth_stage->value ?? 'N/A',
                    'week_number' => $latest?->week_number,
                    'survival_rate' => $latest ? (float) $latest->survival_rate_pct : null,
                ];
            })
            ->sortByDesc('health_score')
            ->values();
    }

    /**
     * Average cycle duration in days for completed experiments of a species.
     */
    private function avgCycleDaysForSpecies(int $speciesId): ?float
    {
        $experiments = Experiment::where('plant_species_id', $speciesId)
            ->completed()
            ->whereNotNull('actual_end_date')
            ->get(['start_date', 'actual_end_date']);

        if ($experiments->isEmpty()) {
            return null;
        }

        $totalDays = $experiments->sum(fn ($exp) => $exp->start_date->diffInDays($exp->actual_end_date));

        return round($totalDays / $experiments->count(), 1);
    }

    /**
     * Build a growth profile for a specific species, suitable for production forecasting.
     *
     * @return array{avg_survival_rate: float, avg_multiplication_rate: float, avg_cycle_weeks: float, std_dev_survival: float, completed_experiments: int}
     */
    public function getGrowthProfileForSpecies(int $speciesId): array
    {
        $experiments = Experiment::where('plant_species_id', $speciesId)
            ->completed()
            ->whereNotNull('actual_end_date')
            ->get();

        if ($experiments->isEmpty()) {
            return [
                'avg_survival_rate' => 85.0,
                'avg_multiplication_rate' => 3.0,
                'avg_cycle_weeks' => 8.0,
                'std_dev_survival' => 5.0,
                'completed_experiments' => 0,
            ];
        }

        $survivalRates = $experiments->pluck('avg_survival_rate')->map(fn ($v) => (float) $v);
        $avgSurvival = $survivalRates->avg();
        $avgMult = (float) $experiments->avg('multiplication_rate');

        $mean = $avgSurvival;
        $stdDev = $survivalRates->count() > 1
            ? sqrt($survivalRates->map(fn ($v) => pow($v - $mean, 2))->avg())
            : 0.0;

        $cycleDays = $experiments->map(function ($exp) {
            return $exp->start_date->diffInDays($exp->actual_end_date);
        });
        $avgCycleWeeks = $cycleDays->avg() / 7;

        return [
            'avg_survival_rate' => round($avgSurvival, 2),
            'avg_multiplication_rate' => round(max(1.01, $avgMult), 2),
            'avg_cycle_weeks' => round(max(1, $avgCycleWeeks), 1),
            'std_dev_survival' => round($stdDev, 2),
            'completed_experiments' => $experiments->count(),
        ];
    }
}

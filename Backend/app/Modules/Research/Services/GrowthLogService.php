<?php

declare(strict_types=1);

namespace App\Modules\Research\Services;

use App\Modules\Research\Models\Experiment;
use App\Modules\Research\Models\GrowthLog;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class GrowthLogService
{
    /**
     * All logs for an experiment, ordered by week.
     */
    public function getLogsForExperiment(Experiment $experiment): Collection
    {
        return $experiment->growthLogs()
            ->with('recorder')
            ->orderedByWeek()
            ->get();
    }

    /**
     * Create a growth log and recalculate the parent experiment's aggregates.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(Experiment $experiment, array $data, ?int $recordedBy = null): GrowthLog
    {
        return DB::transaction(function () use ($experiment, $data, $recordedBy): GrowthLog {
            $log = $experiment->growthLogs()->create([
                'week_number' => $data['week_number'],
                'log_date' => $data['log_date'],
                'seedling_count' => $data['seedling_count'],
                'alive_count' => $data['alive_count'],
                'dead_count' => $data['dead_count'],
                'new_propagations' => $data['new_propagations'],
                'survival_rate_pct' => $data['survival_rate_pct'],
                'multiplication_rate' => $data['multiplication_rate'],
                'health_score' => $data['health_score'],
                'avg_height_cm' => $data['avg_height_cm'] ?? null,
                'growth_stage' => $data['growth_stage'],
                'observations' => $data['observations'] ?? null,
                'photo_urls' => $data['photo_urls'] ?? null,
                'environmental_data' => $data['environmental_data'] ?? null,
                'recorded_by' => $recordedBy,
            ]);

            $this->recalculateExperimentMetrics($experiment);

            return $log->load('recorder');
        });
    }

    /**
     * Update a growth log and recalculate parent experiment metrics.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(GrowthLog $log, array $data): GrowthLog
    {
        return DB::transaction(function () use ($log, $data): GrowthLog {
            $log->update($data);

            $this->recalculateExperimentMetrics($log->experiment);

            return $log->refresh()->load('recorder');
        });
    }

    /**
     * Delete a growth log and recalculate parent experiment metrics.
     */
    public function delete(GrowthLog $log): void
    {
        DB::transaction(function () use ($log): void {
            $experiment = $log->experiment;
            $log->delete();
            $this->recalculateExperimentMetrics($experiment);
        });
    }

    /**
     * Next available week number for an experiment.
     */
    public function getNextWeekNumber(Experiment $experiment): int
    {
        $maxWeek = $experiment->growthLogs()->max('week_number');

        return ($maxWeek ?? 0) + 1;
    }

    /**
     * Recalculate experiment aggregate fields from its growth logs.
     *
     * - current_count       → alive_count of the newest log
     * - avg_survival_rate   → AVG(survival_rate_pct) across all logs
     * - multiplication_rate → multiplication_rate from the newest log
     */
    private function recalculateExperimentMetrics(Experiment $experiment): void
    {
        $logs = $experiment->growthLogs()->orderedByWeek()->get();

        if ($logs->isEmpty()) {
            $experiment->update([
                'current_count' => 0,
                'avg_survival_rate' => null,
                'multiplication_rate' => null,
            ]);

            return;
        }

        $latestLog = $logs->last();

        $experiment->update([
            'current_count' => $latestLog->alive_count,
            'avg_survival_rate' => round($logs->avg('survival_rate_pct'), 2),
            'multiplication_rate' => $latestLog->multiplication_rate,
        ]);
    }
}

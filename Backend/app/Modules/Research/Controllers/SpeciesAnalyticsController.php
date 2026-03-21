<?php

declare(strict_types=1);

namespace App\Modules\Research\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Research\Models\Experiment;
use App\Modules\Research\Services\SpeciesAnalyticsService;
use Illuminate\Http\JsonResponse;

class SpeciesAnalyticsController extends Controller
{
    public function __construct(
        private readonly SpeciesAnalyticsService $service,
    ) {}

    /**
     * Per-species growth profiles with aggregated metrics.
     */
    public function profiles(): JsonResponse
    {
        $this->authorize('viewAny', Experiment::class);

        return response()->json([
            'data' => $this->service->getSpeciesGrowthProfiles(),
        ]);
    }

    /**
     * Bar chart comparison data across species.
     */
    public function comparison(): JsonResponse
    {
        $this->authorize('viewAny', Experiment::class);

        return response()->json([
            'data' => $this->service->getGrowthComparison(),
        ]);
    }

    /**
     * Time-series growth curve for a single experiment.
     */
    public function growthCurve(int $experimentId): JsonResponse
    {
        $this->authorize('viewAny', Experiment::class);

        return response()->json([
            'data' => $this->service->getGrowthCurveData($experimentId),
        ]);
    }

    /**
     * Distribution of growth stages across active experiments.
     */
    public function stageDistribution(): JsonResponse
    {
        $this->authorize('viewAny', Experiment::class);

        return response()->json([
            'data' => $this->service->getGrowthStageDistribution(),
        ]);
    }

    /**
     * Health scores for all active experiments.
     */
    public function healthScores(): JsonResponse
    {
        $this->authorize('viewAny', Experiment::class);

        return response()->json([
            'data' => $this->service->getExperimentHealthScores(),
        ]);
    }
}

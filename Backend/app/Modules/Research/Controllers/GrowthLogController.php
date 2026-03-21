<?php

declare(strict_types=1);

namespace App\Modules\Research\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Research\Requests\GrowthLog\StoreGrowthLogRequest;
use App\Modules\Research\Requests\GrowthLog\UpdateGrowthLogRequest;
use App\Modules\Research\Requests\GrowthLog\IndexGrowthLogRequest;
use App\Modules\Research\Resources\GrowthLogResource;
use App\Modules\Research\Models\Experiment;
use App\Modules\Research\Models\GrowthLog;
use App\Modules\Research\Services\GrowthLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class GrowthLogController extends Controller
{
    public function __construct(
        private readonly GrowthLogService $service,
    ) {}

    public function index(IndexGrowthLogRequest $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', GrowthLog::class);

        $experiment = Experiment::findOrFail($request->validated('experiment_id'));
        $logs = $this->service->getLogsForExperiment($experiment);

        return GrowthLogResource::collection($logs);
    }

    public function store(StoreGrowthLogRequest $request): JsonResponse
    {
        $this->authorize('create', GrowthLog::class);

        $data = $request->validated();
        $experiment = Experiment::findOrFail($data['experiment_id']);

        $log = $this->service->create(
            experiment: $experiment,
            data: $data,
            recordedBy: auth('api')->id(),
        );

        return (new GrowthLogResource($log))
            ->response()
            ->setStatusCode(201);
    }

    public function show(GrowthLog $growthLog): GrowthLogResource
    {
        $this->authorize('view', $growthLog);

        $growthLog->load('recorder');

        return new GrowthLogResource($growthLog);
    }

    public function update(UpdateGrowthLogRequest $request, GrowthLog $growthLog): GrowthLogResource
    {
        $this->authorize('update', $growthLog);

        $growthLog = $this->service->update($growthLog, $request->validated());

        return new GrowthLogResource($growthLog);
    }

    public function destroy(GrowthLog $growthLog): JsonResponse
    {
        $this->authorize('delete', $growthLog);

        $this->service->delete($growthLog);

        return response()->json(['message' => 'Growth log deleted successfully.']);
    }

    /**
     * Get the next available week number for an experiment.
     */
    public function nextWeek(int $experimentId): JsonResponse
    {
        $experiment = Experiment::findOrFail($experimentId);

        return response()->json([
            'next_week_number' => $this->service->getNextWeekNumber($experiment),
        ]);
    }
}

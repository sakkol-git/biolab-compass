<?php

declare(strict_types=1);

namespace App\Modules\Research\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Research\Requests\Experiment\StoreExperimentRequest;
use App\Modules\Research\Requests\Experiment\UpdateExperimentRequest;
use App\Modules\Research\Resources\ExperimentResource;
use App\Modules\Research\Models\Experiment;
use App\Modules\Research\Services\ExperimentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExperimentController extends Controller
{
    public function __construct(
        private readonly ExperimentService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Experiment::class);

        $result = $this->service->list(
            search: $request->input('search'),
            status: $request->input('status'),
            species: $request->input('plant_species_id'),
            perPage: $request->integer('per_page', 15),
        );

        return ExperimentResource::collection($result);
    }

    public function store(StoreExperimentRequest $request): JsonResponse
    {
        $this->authorize('create', Experiment::class);

        $experiment = $this->service->create(
            data: $request->validated(),
            createdBy: auth('api')->id(),
        );

        return (new ExperimentResource($experiment))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Experiment $experiment): ExperimentResource
    {
        $this->authorize('view', $experiment);

        $experiment = $this->service->get($experiment->id);

        return new ExperimentResource($experiment);
    }

    public function update(UpdateExperimentRequest $request, Experiment $experiment): ExperimentResource
    {
        $this->authorize('update', $experiment);

        $experiment = $this->service->update($experiment, $request->validated());

        return new ExperimentResource($experiment);
    }

    public function destroy(Experiment $experiment): JsonResponse
    {
        $this->authorize('delete', $experiment);

        $this->service->delete($experiment);

        return response()->json(['message' => 'Experiment deleted successfully.']);
    }

    /**
     * Dashboard-level experiment statistics.
     */
    public function stats(): JsonResponse
    {
        $this->authorize('viewAny', Experiment::class);

        return response()->json($this->service->getStats());
    }
}

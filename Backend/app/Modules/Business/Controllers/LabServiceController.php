<?php

declare(strict_types=1);

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Business\Requests\LabService\StoreLabServiceRequest;
use App\Modules\Business\Requests\LabService\UpdateLabServiceRequest;
use App\Modules\Business\Resources\LabServiceResource;
use App\Modules\Business\Models\LabService;
use App\Modules\Business\Services\LabServiceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LabServiceController extends Controller
{
    public function __construct(
        private readonly LabServiceService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', LabService::class);

        $result = $this->service->list(
            search: $request->input('search'),
            status: $request->input('status'),
            paymentStatus: $request->input('payment_status'),
            perPage: $request->integer('per_page', 15),
        );

        return LabServiceResource::collection($result);
    }

    public function store(StoreLabServiceRequest $request): JsonResponse
    {
        $this->authorize('create', LabService::class);

        $labService = $this->service->create($request->validated());

        return (new LabServiceResource($labService))
            ->response()
            ->setStatusCode(201);
    }

    public function show(LabService $labService): LabServiceResource
    {
        $this->authorize('view', $labService);

        $labService = $this->service->get($labService->id);

        return new LabServiceResource($labService);
    }

    public function update(UpdateLabServiceRequest $request, LabService $labService): LabServiceResource
    {
        $this->authorize('update', $labService);

        $labService = $this->service->update($labService, $request->validated());

        return new LabServiceResource($labService);
    }

    public function destroy(LabService $labService): JsonResponse
    {
        $this->authorize('delete', $labService);

        $this->service->delete($labService);

        return response()->json(['message' => 'Lab service deleted successfully.']);
    }

    /**
     * Dashboard-level lab service statistics.
     */
    public function stats(): JsonResponse
    {
        $this->authorize('viewAny', LabService::class);

        return response()->json($this->service->getStats());
    }
}

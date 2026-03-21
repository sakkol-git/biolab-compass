<?php

declare(strict_types=1);

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;

use App\Enums\ContractStatus;
use App\Modules\Business\Requests\Contract\StoreContractRequest;
use App\Modules\Business\Requests\Contract\TransitionContractRequest;
use App\Modules\Business\Requests\Contract\UpdateContractRequest;
use App\Modules\Business\Resources\ContractResource;
use App\Modules\Business\Models\Contract;
use App\Modules\Business\Services\ContractService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContractController extends Controller
{
    public function __construct(
        private readonly ContractService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Contract::class);

        $result = $this->service->list(
            search: $request->input('search'),
            status: $request->input('status'),
            clientId: $request->integer('client_id') ?: null,
            perPage: $request->integer('per_page', 15),
        );

        return ContractResource::collection($result);
    }

    public function store(StoreContractRequest $request): JsonResponse
    {
        $this->authorize('create', Contract::class);

        $contract = $this->service->create(
            data: $request->validated(),
            managedBy: auth('api')->id(),
        );

        return (new ContractResource($contract))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Contract $contract): ContractResource
    {
        $this->authorize('view', $contract);

        $contract = $this->service->get($contract->id);

        return new ContractResource($contract);
    }

    public function update(UpdateContractRequest $request, Contract $contract): ContractResource
    {
        $this->authorize('update', $contract);

        $contract = $this->service->update($contract, $request->validated());

        return new ContractResource($contract);
    }

    public function destroy(Contract $contract): JsonResponse
    {
        $this->authorize('delete', $contract);

        $this->service->delete($contract);

        return response()->json(['message' => 'Contract deleted successfully.']);
    }

    /**
     * Transition a contract to a new status.
     */
    public function transition(TransitionContractRequest $request, Contract $contract): ContractResource
    {
        $this->authorize('transition', $contract);

        $newStatus = ContractStatus::from($request->validated('status'));
        $contract = $this->service->transitionStatus($contract, $newStatus);

        return new ContractResource($contract);
    }

    /**
     * Pipeline summary (contracts per status).
     */
    public function pipeline(): JsonResponse
    {
        $this->authorize('viewAny', Contract::class);

        return response()->json([
            'data' => $this->service->getPipelineSummary(),
        ]);
    }

    /**
     * Dashboard-level contract statistics.
     */
    public function stats(): JsonResponse
    {
        $this->authorize('viewAny', Contract::class);

        return response()->json($this->service->getStats());
    }
}

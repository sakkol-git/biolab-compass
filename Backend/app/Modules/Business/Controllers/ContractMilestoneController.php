<?php

declare(strict_types=1);

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Business\Requests\ContractMilestone\StoreContractMilestoneRequest;
use App\Modules\Business\Requests\ContractMilestone\UpdateContractMilestoneRequest;
use App\Modules\Business\Resources\ContractMilestoneResource;
use App\Modules\Business\Models\Contract;
use App\Modules\Business\Models\ContractMilestone;
use App\Modules\Business\Services\ContractMilestoneService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ContractMilestoneController extends Controller
{
    public function __construct(
        private readonly ContractMilestoneService $service,
    ) {}

    /**
     * List milestones for a contract.
     */
    public function index(Contract $contract): AnonymousResourceCollection
    {
        $this->authorize('viewAny', ContractMilestone::class);

        $milestones = $this->service->listForContract($contract->id);

        return ContractMilestoneResource::collection($milestones);
    }

    /**
     * Create a milestone on a contract.
     */
    public function store(StoreContractMilestoneRequest $request, Contract $contract): JsonResponse
    {
        $this->authorize('create', ContractMilestone::class);

        $milestone = $this->service->create($contract, $request->validated());

        return (new ContractMilestoneResource($milestone))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Show a single milestone.
     */
    public function show(Contract $contract, ContractMilestone $milestone): ContractMilestoneResource
    {
        $this->authorize('view', $milestone);

        return new ContractMilestoneResource($milestone);
    }

    /**
     * Update a milestone.
     */
    public function update(
        UpdateContractMilestoneRequest $request,
        Contract $contract,
        ContractMilestone $milestone,
    ): ContractMilestoneResource {
        $this->authorize('update', $milestone);

        $milestone = $this->service->update($milestone, $request->validated());

        return new ContractMilestoneResource($milestone);
    }

    /**
     * Delete a milestone.
     */
    public function destroy(Contract $contract, ContractMilestone $milestone): JsonResponse
    {
        $this->authorize('delete', $milestone);

        $this->service->delete($milestone);

        return response()->json(['message' => 'Milestone deleted successfully.']);
    }
}

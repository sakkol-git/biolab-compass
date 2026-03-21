<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Controllers;

use App\Concerns\EscapesSearchTerm;
use App\Http\Controllers\Controller;

use App\Modules\Inventory\Requests\Chemical\StoreChemicalBatchRequest;
use App\Modules\Inventory\Requests\Chemical\UpdateChemicalBatchRequest;
use App\Modules\Inventory\Resources\ChemicalBatchResource;
use App\Modules\Inventory\Models\ChemicalBatch;
use App\Modules\Inventory\Services\InventoryCrudService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ChemicalBatchController extends Controller
{
    use EscapesSearchTerm;
    public function __construct(
        private readonly InventoryCrudService $crudService,
    ) {}

    /**
     * GET /api/chemical-batches
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', ChemicalBatch::class);

        $query = ChemicalBatch::with('chemical')->latest();

        if ($request->filled('chemical_id')) {
            $query->forChemical($request->integer('chemical_id'));
        }
        if ($request->boolean('expired_only')) {
            $query->expired();
        }
        if ($request->boolean('expiring_soon')) {
            $query->expiringSoon();
        }
        if ($request->boolean('available_only')) {
            $query->available();
        }
        if ($request->filled('search')) {
            $term = $this->escapeLike($request->input('search'));
            $query->where('batch_number', 'like', "%{$term}%");
        }

        return ChemicalBatchResource::collection($query->paginate(15));
    }

    /**
     * POST /api/chemical-batches
     */
    public function store(StoreChemicalBatchRequest $request): JsonResponse
    {
        $this->authorize('create', ChemicalBatch::class);

        $batch = $this->crudService->create(
            modelClass: ChemicalBatch::class,
            data: $request->validated(),
            user: auth('api')->user(),
            note: 'Chemical batch received',
        );

        $batch->load('chemical');

        return (new ChemicalBatchResource($batch))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /api/chemical-batches/{chemicalBatch}
     */
    public function show(ChemicalBatch $chemicalBatch): ChemicalBatchResource
    {
        $this->authorize('view', $chemicalBatch);

        $chemicalBatch->load(['chemical', 'usageLogs.user']);

        return new ChemicalBatchResource($chemicalBatch);
    }

    /**
     * PUT /api/chemical-batches/{chemicalBatch}
     */
    public function update(UpdateChemicalBatchRequest $request, ChemicalBatch $chemicalBatch): ChemicalBatchResource
    {
        $this->authorize('update', $chemicalBatch);

        $chemicalBatch = $this->crudService->update(
            instance: $chemicalBatch,
            data: $request->validated(),
            user: auth('api')->user(),
            note: "Batch {$chemicalBatch->batch_number} updated",
        );

        return new ChemicalBatchResource($chemicalBatch->load('chemical'));
    }

    /**
     * DELETE /api/chemical-batches/{chemicalBatch}
     */
    public function destroy(ChemicalBatch $chemicalBatch): JsonResponse
    {
        $this->authorize('delete', $chemicalBatch);

        $this->crudService->delete(
            instance: $chemicalBatch,
            user: auth('api')->user(),
            note: "Batch {$chemicalBatch->batch_number} removed",
        );

        return response()->json(['message' => 'Chemical batch deleted successfully.']);
    }
}

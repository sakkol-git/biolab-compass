<?php

declare(strict_types=1);

namespace App\Modules\Research\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Research\Requests\LabNotebook\StoreLabNotebookRequest;
use App\Modules\Research\Requests\LabNotebook\UpdateLabNotebookRequest;
use App\Modules\Research\Resources\LabNotebookResource;
use App\Modules\Research\Models\LabNotebook;
use App\Modules\Research\Services\LabNotebookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class LabNotebookController extends Controller
{
    public function __construct(
        private readonly LabNotebookService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', LabNotebook::class);

        $result = $this->service->list(
            search: $request->input('search'),
            experimentId: $request->integer('experiment_id') ?: null,
            isLocked: $request->has('is_locked') ? $request->boolean('is_locked') : null,
            perPage: $request->integer('per_page', 15),
        );

        return LabNotebookResource::collection($result);
    }

    public function store(StoreLabNotebookRequest $request): JsonResponse
    {
        $this->authorize('create', LabNotebook::class);

        $notebook = $this->service->create(
            data: $request->validated(),
            userId: auth('api')->id(),
        );

        return (new LabNotebookResource($notebook))
            ->response()
            ->setStatusCode(201);
    }

    public function show(LabNotebook $labNotebook): LabNotebookResource
    {
        $this->authorize('view', $labNotebook);

        $labNotebook = $this->service->get($labNotebook->id);

        return new LabNotebookResource($labNotebook);
    }

    public function update(UpdateLabNotebookRequest $request, LabNotebook $labNotebook): LabNotebookResource
    {
        $this->authorize('update', $labNotebook);

        $labNotebook = $this->service->update($labNotebook, $request->validated());

        return new LabNotebookResource($labNotebook);
    }

    public function destroy(LabNotebook $labNotebook): JsonResponse
    {
        $this->authorize('delete', $labNotebook);

        $this->service->delete($labNotebook);

        return response()->json(['message' => 'Lab notebook deleted successfully.']);
    }

    /**
     * Toggle the lock status of a notebook.
     */
    public function toggleLock(LabNotebook $labNotebook): LabNotebookResource
    {
        $this->authorize('toggleLock', $labNotebook);

        $labNotebook = $this->service->toggleLock($labNotebook);

        return new LabNotebookResource($labNotebook);
    }
}

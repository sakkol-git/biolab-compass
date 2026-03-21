<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Inventory\Requests\Sample\StorePlantSampleRequest;
use App\Modules\Inventory\Requests\Sample\UpdatePlantSampleRequest;
use App\Modules\Inventory\Resources\PlantSampleResource;
use App\Modules\Inventory\Models\PlantSample;
use App\Modules\Inventory\Services\InventoryCrudService;
use App\Services\ImageUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlantSampleController extends Controller
{
    public function __construct(
        private readonly InventoryCrudService $crudService,
        private readonly ImageUploadService $imageService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', PlantSample::class);
        // Eager-load both relationships — prevents N+1 queries
        $query = PlantSample::with(['species', 'variety']);

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('species_id')) {
            $query->where('plant_species_id', $request->integer('species_id'));
        }

        return PlantSampleResource::collection($query->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePlantSampleRequest $request): JsonResponse
    {
        $this->authorize('create', PlantSample::class);

        $data = $request->validated();
        $this->imageService->handleImageData($data, PlantSample::imageFolder());

        $sample = $this->crudService->create(
            modelClass: PlantSample::class,
            data: $data,
            user: auth('api')->user(),
            note: 'Plant sample created',
        );

        $sample->load(['species', 'variety']);

        return (new PlantSampleResource($sample))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PlantSample $plantSample): PlantSampleResource
    {
        $this->authorize('view', $plantSample);

        $plantSample->load(['species', 'variety']);

        return new PlantSampleResource($plantSample);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlantSampleRequest $request, PlantSample $plantSample): PlantSampleResource
    {
        $this->authorize('update', $plantSample);

        $data = $request->validated();
        $this->imageService->handleImageData($data, PlantSample::imageFolder(), $plantSample);

        $plantSample = $this->crudService->update(
            instance: $plantSample,
            data: $data,
            user: auth('api')->user(),
            note: 'Plant sample updated',
        );

        $plantSample->load(['species', 'variety']);

        return new PlantSampleResource($plantSample);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlantSample $plantSample): JsonResponse
    {
        $this->authorize('delete', $plantSample);

        $this->crudService->delete(
            instance: $plantSample,
            user: auth('api')->user(),
            note: 'Plant sample deleted',
        );

        return response()->json(['message' => 'Plant sample deleted successfully.']);
    }
}

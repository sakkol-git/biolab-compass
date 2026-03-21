<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Inventory\Requests\Variety\StorePlantVarietyRequest;
use App\Modules\Inventory\Requests\Variety\UpdatePlantVarietyRequest;
use App\Modules\Inventory\Resources\PlantVarietyResource;
use App\Modules\Inventory\Models\PlantVariety;
use App\Modules\Inventory\Services\InventoryCrudService;
use App\Services\ImageUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PlantVarietyController extends Controller
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
        $this->authorize('viewAny', PlantVariety::class);
        $query = PlantVariety::with('plantSpecies');

        // simple search functionality
        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        if ($request->filled('species_id')) {
            $query->where('plant_species_id', $request->integer('species_id'));
        }

        return PlantVarietyResource::collection($query->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePlantVarietyRequest $request): JsonResponse
    {
        $this->authorize('create', PlantVariety::class);

        $data = $request->validated();
        $this->imageService->handleImageData($data, PlantVariety::imageFolder());

        $variety = $this->crudService->create(
            modelClass: PlantVariety::class,
            data: $data,
            user: auth('api')->user(),
            note: 'Plant variety created',
        );

        $variety->load('plantSpecies');

        return (new PlantVarietyResource($variety))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(PlantVariety $plantVariety): PlantVarietyResource
    {
        $this->authorize('view', $plantVariety);

        // Load the relationship if not already loaded
        $plantVariety->load('plantSpecies');

        return new PlantVarietyResource($plantVariety);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePlantVarietyRequest $request, PlantVariety $plantVariety): PlantVarietyResource
    {
        $this->authorize('update', $plantVariety);

        $data = $request->validated();
        $this->imageService->handleImageData($data, PlantVariety::imageFolder(), $plantVariety);

        $plantVariety = $this->crudService->update(
            instance: $plantVariety,
            data: $data,
            user: auth('api')->user(),
            note: 'Plant variety updated',
        );

        $plantVariety->load('plantSpecies');

        return new PlantVarietyResource($plantVariety);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PlantVariety $plantVariety): JsonResponse
    {
        $this->authorize('delete', $plantVariety);

        $this->crudService->delete(
            instance: $plantVariety,
            user: auth('api')->user(),
            note: 'Plant variety deleted',
        );

        return response()->json(['message' => 'Plant variety deleted successfully.']);
    }
}

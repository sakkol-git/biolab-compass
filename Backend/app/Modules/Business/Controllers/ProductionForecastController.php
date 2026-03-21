<?php

declare(strict_types=1);

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Business\Requests\ProductionForecast\CalculateForecastRequest;
use App\Modules\Business\Resources\ProductionForecastResource;
use App\Modules\Business\Models\ProductionForecast;
use App\Modules\Business\Services\ProductionForecastService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductionForecastController extends Controller
{
    public function __construct(
        private readonly ProductionForecastService $service,
    ) {}

    /**
     * List saved forecasts.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', ProductionForecast::class);

        $result = $this->service->list(
            speciesId: $request->integer('plant_species_id') ?: null,
            perPage: $request->integer('per_page', 15),
        );

        return ProductionForecastResource::collection($result);
    }

    /**
     * Show a single saved forecast.
     */
    public function show(ProductionForecast $productionForecast): ProductionForecastResource
    {
        $this->authorize('view', $productionForecast);

        $productionForecast = $this->service->get($productionForecast->id);

        return new ProductionForecastResource($productionForecast);
    }

    /**
     * Calculate and persist a new production forecast.
     */
    public function calculate(CalculateForecastRequest $request): JsonResponse
    {
        $this->authorize('create', ProductionForecast::class);

        $forecast = $this->service->calculateForecast(
            input: $request->validated(),
            userId: auth('api')->id(),
        );

        return (new ProductionForecastResource($forecast->load(['species', 'calculator'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Delete a saved forecast.
     */
    public function destroy(ProductionForecast $productionForecast): JsonResponse
    {
        $this->authorize('delete', $productionForecast);

        $this->service->delete($productionForecast);

        return response()->json(['message' => 'Forecast deleted successfully.']);
    }
}

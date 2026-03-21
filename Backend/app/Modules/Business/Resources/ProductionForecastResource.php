<?php

declare(strict_types=1);

namespace App\Modules\Business\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductionForecastResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,

            'species' => [
                'id' => $this->whenLoaded('species', fn () => $this->species?->id),
                'common_name' => $this->whenLoaded('species', fn () => $this->species?->common_name),
            ],

            'forecast' => [
                'desired_quantity' => $this->desired_quantity,
                'recommended_initial_stock' => $this->recommended_initial_stock,
                'estimated_weeks' => $this->estimated_weeks,
                'confidence_lower_weeks' => $this->confidence_lower_weeks,
                'confidence_upper_weeks' => $this->confidence_upper_weeks,
                'estimated_cycles' => $this->estimated_cycles,
                'estimated_survival_rate' => (float) $this->estimated_survival_rate,
                'estimated_multiplication_rate' => (float) $this->estimated_multiplication_rate,
            ],

            'propagation_method' => $this->propagation_method,
            'weekly_milestones' => $this->weekly_milestones,
            'resource_requirements' => $this->resource_requirements,

            'calculator' => [
                'id' => $this->whenLoaded('calculator', fn () => $this->calculator?->id),
                'name' => $this->whenLoaded('calculator', fn () => $this->calculator?->name),
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

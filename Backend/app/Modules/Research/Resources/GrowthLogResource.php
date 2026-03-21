<?php

declare(strict_types=1);

namespace App\Modules\Research\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GrowthLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'experiment_id' => $this->experiment_id,
            'week_number' => $this->week_number,
            'log_date' => $this->log_date?->format('Y-m-d'),
            'growth_stage' => $this->growth_stage?->value,

            'counts' => [
                'seedling_count' => $this->seedling_count,
                'alive_count' => $this->alive_count,
                'dead_count' => $this->dead_count,
                'new_propagations' => $this->new_propagations,
            ],

            'metrics' => [
                'survival_rate_pct' => (float) $this->survival_rate_pct,
                'multiplication_rate' => (float) $this->multiplication_rate,
                'health_score' => (float) $this->health_score,
                'avg_height_cm' => (float) $this->avg_height_cm,
            ],

            'photo_urls' => $this->photo_urls,
            'environmental_data' => $this->environmental_data,
            'notes' => $this->notes,

            'recorder' => [
                'id' => $this->whenLoaded('recorder', fn () => $this->recorder->id),
                'name' => $this->whenLoaded('recorder', fn () => $this->recorder->name),
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

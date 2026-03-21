<?php

declare(strict_types=1);

namespace App\Modules\Research\Resources;

use App\Modules\Core\Resources\TagResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExperimentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'experiment_code' => $this->experiment_code,
            'title' => $this->title,
            'status' => $this->status?->value,
            'propagation_method' => $this->propagation_method?->value,

            'species' => [
                'id' => $this->whenLoaded('species', fn () => $this->species->id),
                'common_name' => $this->whenLoaded('species', fn () => $this->species->common_name),
                'scientific_name' => $this->whenLoaded('species', fn () => $this->species->scientific_name),
            ],

            'dates' => [
                'start_date' => $this->start_date?->format('Y-m-d'),
                'expected_end_date' => $this->expected_end_date?->format('Y-m-d'),
                'actual_end_date' => $this->actual_end_date?->format('Y-m-d'),
            ],

            'metrics' => [
                'initial_seed_count' => $this->initial_seed_count,
                'current_count' => $this->current_count,
                'final_yield' => $this->final_yield,
                'avg_survival_rate' => (float) $this->avg_survival_rate,
                'multiplication_rate' => (float) $this->multiplication_rate,
            ],

            'creator' => [
                'id' => $this->whenLoaded('creator', fn () => $this->creator->id),
                'name' => $this->whenLoaded('creator', fn () => $this->creator->name),
            ],

            'assigned_users' => $this->whenLoaded('assignedUsers', fn () => $this->assignedUsers->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'role' => $u->pivot->role,
            ])
            ),

            'tags' => TagResource::collection($this->whenLoaded('tags')),
            'protocols' => ProtocolResource::collection($this->whenLoaded('protocols')),
            'notebooks' => LabNotebookResource::collection($this->whenLoaded('notebooks')),
            'growth_logs_count' => $this->whenCounted('growthLogs'),

            'description' => $this->description,
            'notes' => $this->notes,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChemicalUsageLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'chemical_id' => $this->chemical_id,
            'quantity_used' => $this->quantity_used,
            'unit' => $this->unit,
            'purpose' => $this->purpose,
            'experiment_name' => $this->experiment_name,
            'used_at' => $this->used_at?->toIso8601String(),
            'notes' => $this->notes,
            'user' => [
                'id' => $this->whenLoaded('user', fn () => $this->user->id),
                'name' => $this->whenLoaded('user', fn () => $this->user->name),
            ],
            'chemical' => new ChemicalResource($this->whenLoaded('chemical')),
            'batch' => new ChemicalBatchResource($this->whenLoaded('batch')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

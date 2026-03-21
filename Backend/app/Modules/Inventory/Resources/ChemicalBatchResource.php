<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChemicalBatchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'chemical_id' => $this->chemical_id,
            'batch_number' => $this->batch_number,
            'quantity' => $this->quantity,
            'remaining_quantity' => $this->remaining_quantity,
            'unit' => $this->unit,
            'expiry_date' => $this->expiry_date?->format('Y-m-d'),
            'is_expired' => $this->is_expired,
            'supplier_name' => $this->supplier_name,
            'supplier_contact' => $this->supplier_contact,
            'received_at' => $this->received_at?->format('Y-m-d'),
            'cost_per_unit' => $this->cost_per_unit,
            'notes' => $this->notes,
            'chemical' => new ChemicalResource($this->whenLoaded('chemical')),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

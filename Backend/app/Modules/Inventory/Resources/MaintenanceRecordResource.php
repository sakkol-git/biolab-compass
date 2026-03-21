<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MaintenanceRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'equipment_id' => $this->equipment_id,
            'maintenance_type' => $this->maintenance_type?->value,
            'description' => $this->description,
            'technician_name' => $this->technician_name,
            'technician_contact' => $this->technician_contact,
            'cost' => $this->cost,
            'started_at' => $this->started_at?->format('Y-m-d'),
            'completed_at' => $this->completed_at?->format('Y-m-d'),
            'next_service_date' => $this->next_service_date?->format('Y-m-d'),
            'is_completed' => $this->is_completed,
            'is_overdue' => $this->is_overdue,
            'notes' => $this->notes,
            'equipment' => new EquipmentResource($this->whenLoaded('equipment')),
            'performer' => [
                'id' => $this->whenLoaded('performer', fn () => $this->performer?->id),
                'name' => $this->whenLoaded('performer', fn () => $this->performer?->name),
            ],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

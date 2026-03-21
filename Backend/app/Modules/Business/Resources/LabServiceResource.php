<?php

declare(strict_types=1);

namespace App\Modules\Business\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LabServiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_code' => $this->service_code,
            'service_title' => $this->service_title,
            'service_description' => $this->service_description,
            'client_name' => $this->client_name,
            'client_contact' => $this->client_contact,
            'status' => $this->status?->value,
            'payment_status' => $this->payment_status?->value,
            'start_date' => $this->start_date?->format('Y-m-d'),
            'end_date' => $this->end_date?->format('Y-m-d'),
            'service_fee' => (float) $this->service_fee,
            'assigned_staff' => $this->assigned_staff,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

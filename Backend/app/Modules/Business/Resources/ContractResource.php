<?php

declare(strict_types=1);

namespace App\Modules\Business\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'contract_code' => $this->contract_code,
            'common_name' => $this->common_name,
            'status' => $this->status?->value,

            'client' => [
                'id' => $this->whenLoaded('client', fn () => $this->client->id),
                'company_name' => $this->whenLoaded('client', fn () => $this->client->company_name),
                'client_code' => $this->whenLoaded('client', fn () => $this->client->client_code),
            ],

            'species' => [
                'id' => $this->whenLoaded('species', fn () => $this->species?->id),
                'common_name' => $this->whenLoaded('species', fn () => $this->species?->common_name),
            ],

            'manager' => [
                'id' => $this->whenLoaded('manager', fn () => $this->manager?->id),
                'name' => $this->whenLoaded('manager', fn () => $this->manager?->name),
            ],

            'dates' => [
                'contract_date' => $this->contract_date?->format('Y-m-d'),
                'delivery_deadline' => $this->delivery_deadline?->format('Y-m-d'),
                'actual_delivery_date' => $this->actual_delivery_date?->format('Y-m-d'),
            ],

            'quantities' => [
                'quantity_ordered' => $this->quantity_ordered,
                'quantity_delivered' => $this->quantity_delivered,
                'unit_price' => (float) $this->unit_price,
                'total_value' => (float) $this->total_value,
            ],

            'progress_pct' => $this->progress_pct,
            'notes' => $this->notes,

            'milestones' => ContractMilestoneResource::collection($this->whenLoaded('milestones')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),

            'financial' => [
                'total_paid' => $this->whenLoaded('payments', fn () => $this->totalPaid()),
                'total_pending' => $this->whenLoaded('payments', fn () => $this->totalPending()),
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

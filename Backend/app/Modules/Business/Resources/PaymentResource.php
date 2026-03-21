<?php

declare(strict_types=1);

namespace App\Modules\Business\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'contract_id' => $this->contract_id,
            'reference_number' => $this->reference_number,
            'amount' => (float) $this->amount,
            'payment_type' => $this->payment_type?->value,
            'status' => $this->status?->value,
            'due_date' => $this->due_date?->format('Y-m-d'),
            'payment_date' => $this->payment_date?->format('Y-m-d'),
            'notes' => $this->notes,

            'contract' => [
                'id' => $this->whenLoaded('contract', fn () => $this->contract->id),
                'contract_code' => $this->whenLoaded('contract', fn () => $this->contract->contract_code),
                'client' => $this->whenLoaded('contract', fn () => $this->contract->relationLoaded('client') ? [
                    'id' => $this->contract->client->id,
                    'company_name' => $this->contract->client->company_name,
                ] : null),
            ],

            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

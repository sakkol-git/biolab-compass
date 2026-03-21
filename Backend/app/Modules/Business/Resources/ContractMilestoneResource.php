<?php

declare(strict_types=1);

namespace App\Modules\Business\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractMilestoneResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'contract_id' => $this->contract_id,
            'title' => $this->title,
            'status' => $this->status?->value,
            'target_date' => $this->target_date?->format('Y-m-d'),
            'actual_date' => $this->actual_date?->format('Y-m-d'),
            'projected_count' => $this->projected_count,
            'actual_count' => $this->actual_count,
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

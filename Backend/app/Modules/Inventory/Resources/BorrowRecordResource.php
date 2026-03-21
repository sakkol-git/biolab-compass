<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BorrowRecordResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status?->value,
            'quantity' => $this->quantity,
            'borrowed_at' => $this->borrowed_at?->toIso8601String(),
            'due_at' => $this->due_at?->toIso8601String(),
            'returned_at' => $this->returned_at?->toIso8601String(),
            'is_overdue' => $this->is_overdue,
            'notes' => $this->notes,
            'user' => [
                'id' => $this->whenLoaded('user', fn () => $this->user->id),
                'name' => $this->whenLoaded('user', fn () => $this->user->name),
            ],
            'item' => [
                'type' => $this->borrowable_type,
                'id' => $this->borrowable_id,
                'data' => $this->whenLoaded('borrowable'),
            ],
            'reviewer' => [
                'id' => $this->whenLoaded('reviewer', fn () => $this->reviewer->id),
                'name' => $this->whenLoaded('reviewer', fn () => $this->reviewer->name),
            ],
            'reviewed_at' => $this->reviewed_at?->toIso8601String(),
            'rejected_reason' => $this->rejected_reason,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

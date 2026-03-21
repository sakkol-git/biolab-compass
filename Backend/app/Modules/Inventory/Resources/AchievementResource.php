<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AchievementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'criteria_type' => $this->criteria_type,
            'criteria_value' => $this->criteria_value,
            'icon' => $this->icon,
            'earned_at' => $this->whenPivotLoaded('user_achievements', fn () => $this->pivot->earned_at),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Research\Requests\GrowthLog;

use App\Enums\GrowthStage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateGrowthLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('experiments.edit', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'log_date' => ['sometimes', 'date'],
            'growth_stage' => ['sometimes', Rule::enum(GrowthStage::class)],
            'seedling_count' => ['sometimes', 'integer', 'min:0'],
            'alive_count' => ['sometimes', 'integer', 'min:0'],
            'dead_count' => ['nullable', 'integer', 'min:0'],
            'new_propagations' => ['nullable', 'integer', 'min:0'],
            'survival_rate_pct' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'multiplication_rate' => ['nullable', 'numeric', 'min:0'],
            'health_score' => ['nullable', 'numeric', 'min:0', 'max:10'],
            'avg_height_cm' => ['nullable', 'numeric', 'min:0'],
            'photo_urls' => ['nullable', 'array'],
            'photo_urls.*' => ['url', 'max:2048'],
            'environmental_data' => ['nullable', 'array'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

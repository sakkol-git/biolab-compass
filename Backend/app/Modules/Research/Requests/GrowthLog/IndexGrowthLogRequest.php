<?php

declare(strict_types=1);

namespace App\Modules\Research\Requests\GrowthLog;

use Illuminate\Foundation\Http\FormRequest;

class IndexGrowthLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Controller checks viewAny policy.
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'experiment_id' => ['required', 'integer', 'exists:experiments,id'],
        ];
    }
}

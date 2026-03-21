<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Achievement;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAchievementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('achievements.edit', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'criteria_type' => ['sometimes', 'required', 'string', 'max:100'],
            'criteria_value' => ['sometimes', 'required', 'integer', 'min:1'],
            'icon' => ['nullable', 'string', 'max:255'],
        ];
    }
}

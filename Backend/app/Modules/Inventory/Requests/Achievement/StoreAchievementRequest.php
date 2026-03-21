<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Achievement;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAchievementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('achievements.create', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'criteria_type' => ['required', 'string', 'max:100'],
            'criteria_value' => ['required', 'integer', 'min:1'],
            'icon' => ['nullable', 'string', 'max:255'],
        ];
    }
}

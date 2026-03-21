<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Equipment;

use App\Concerns\HasImageValidation;
use App\Enums\EquipmentCategory;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEquipmentRequest extends FormRequest
{
    use HasImageValidation;

    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('equipment.edit', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'equipment_name' => ['sometimes', 'required', 'string', 'max:255'],
            'equipment_code' => [
                'sometimes', 'nullable', 'string', 'max:100',
                Rule::unique('equipment', 'equipment_code')
                    ->ignore($this->route('equipment')?->getKey())
                    ->whereNull('deleted_at'),
            ],
            'category' => ['sometimes', Rule::enum(EquipmentCategory::class)],
            'status' => ['sometimes', Rule::enum(EquipmentStatus::class)],
            'condition' => ['sometimes', Rule::enum(EquipmentCondition::class)],
            'location' => ['nullable', 'string', 'max:255'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'model_name' => ['nullable', 'string', 'max:255'],
            'serial_number' => [
                'sometimes', 'nullable', 'string', 'max:255',
                Rule::unique('equipment', 'serial_number')
                    ->ignore($this->route('equipment')?->getKey())
                    ->whereNull('deleted_at'),
            ],
            'purchase_date' => ['nullable', 'date'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            ...$this->imageRules(),
        ];
    }
}

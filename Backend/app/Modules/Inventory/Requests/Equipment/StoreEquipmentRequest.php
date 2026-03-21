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

class StoreEquipmentRequest extends FormRequest
{
    use HasImageValidation;

    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('equipment.create', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'equipment_name' => ['required', 'string', 'max:255'],
            'equipment_code' => ['nullable', 'string', 'max:100', Rule::unique('equipment', 'equipment_code')->whereNull('deleted_at')],
            'category' => ['required', Rule::enum(EquipmentCategory::class)],
            'status' => ['required', Rule::enum(EquipmentStatus::class)],
            'condition' => ['required', Rule::enum(EquipmentCondition::class)],
            'location' => ['nullable', 'string', 'max:255'],
            'manufacturer' => ['nullable', 'string', 'max:255'],
            'model_name' => ['nullable', 'string', 'max:255'],
            'serial_number' => ['nullable', 'string', 'max:255', Rule::unique('equipment', 'serial_number')->whereNull('deleted_at')],
            'purchase_date' => ['nullable', 'date'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            ...$this->imageRules(),
        ];
    }
}

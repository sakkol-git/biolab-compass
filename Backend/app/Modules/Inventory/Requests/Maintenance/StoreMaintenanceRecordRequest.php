<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Maintenance;

use App\Enums\MaintenanceType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMaintenanceRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('maintenance.create', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'equipment_id' => ['required', 'integer', 'exists:equipment,id'],
            'performed_by' => ['nullable', 'integer', 'exists:users,id'],
            'maintenance_type' => ['required', Rule::enum(MaintenanceType::class)],
            'description' => ['required', 'string'],
            'technician_name' => ['nullable', 'string', 'max:255'],
            'technician_contact' => ['nullable', 'string', 'max:255'],
            'cost' => ['nullable', 'numeric', 'min:0'],
            'started_at' => ['required', 'date'],
            'completed_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'next_service_date' => ['nullable', 'date', 'after:started_at'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

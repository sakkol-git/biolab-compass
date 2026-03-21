<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Chemical;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreChemicalUsageLogRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('chemical_usage.create', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'chemical_id' => ['required', 'integer', 'exists:chemicals,id'],
            'chemical_batch_id' => ['nullable', 'integer', 'exists:chemical_batches,id'],
            'quantity_used' => ['required', 'numeric', 'min:0.01'],
            'unit' => ['required', 'string', 'max:20'],
            'purpose' => ['required', 'string', 'max:255'],
            'experiment_name' => ['nullable', 'string', 'max:255'],
            'used_at' => ['required', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

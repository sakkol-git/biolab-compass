<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Chemical;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreChemicalBatchRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('chemical_batches.create', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'chemical_id' => ['required', 'integer', 'exists:chemicals,id'],
            'batch_number' => [
                'required', 'string', 'max:100',
                Rule::unique('chemical_batches')->where('chemical_id', $this->input('chemical_id'))->whereNull('deleted_at'),
            ],
            'quantity' => ['required', 'integer', 'min:0'],
            'unit' => ['required', 'string', 'max:20'],
            'expiry_date' => ['nullable', 'date'],
            'supplier_name' => ['nullable', 'string', 'max:255'],
            'supplier_contact' => ['nullable', 'string', 'max:255'],
            'received_at' => ['nullable', 'date'],
            'cost_per_unit' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

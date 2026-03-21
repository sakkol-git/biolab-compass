<?php

declare(strict_types=1);

namespace App\Modules\Business\Requests\Contract;

use Illuminate\Foundation\Http\FormRequest;

class StoreContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('contracts.create', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'client_id' => ['required', 'integer', 'exists:clients,id'],
            'plant_species_id' => ['nullable', 'integer', 'exists:plant_species,id'],
            'common_name' => ['nullable', 'string', 'max:255'],
            'delivery_deadline' => ['required', 'date', 'after:today'],
            'contract_date' => ['nullable', 'date'],
            'quantity_ordered' => ['required', 'integer', 'min:1'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

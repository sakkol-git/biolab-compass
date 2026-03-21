<?php

declare(strict_types=1);

namespace App\Modules\Business\Requests\Contract;

use Illuminate\Foundation\Http\FormRequest;

class UpdateContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('contracts.edit', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'client_id' => ['sometimes', 'integer', 'exists:clients,id'],
            'plant_species_id' => ['nullable', 'integer', 'exists:plant_species,id'],
            'common_name' => ['nullable', 'string', 'max:255'],
            'delivery_deadline' => ['sometimes', 'date'],
            'contract_date' => ['nullable', 'date'],
            'quantity_ordered' => ['sometimes', 'integer', 'min:1'],
            'unit_price' => ['sometimes', 'numeric', 'min:0'],
            'quantity_delivered' => ['sometimes', 'integer', 'min:0'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

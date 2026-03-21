<?php

declare(strict_types=1);

namespace App\Modules\Business\Requests\ProductionForecast;

use Illuminate\Foundation\Http\FormRequest;

class CalculateForecastRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('contracts.create', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'plant_species_id' => ['required', 'integer', 'exists:plant_species,id'],
            'desired_quantity' => ['required', 'integer', 'min:1'],
            'propagation_method' => ['nullable', 'string', 'max:100'],
        ];
    }
}

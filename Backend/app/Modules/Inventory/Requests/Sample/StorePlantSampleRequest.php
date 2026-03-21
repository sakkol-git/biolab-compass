<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Sample;

use App\Concerns\HasImageValidation;
use App\Enums\LabLocation;
use App\Enums\SampleStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePlantSampleRequest extends FormRequest
{
    use HasImageValidation;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('plants.create', 'api');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Core identity
            'sample_name' => ['required', 'string', 'max:255'],
            'sample_code' => [
                'required', 'string', 'max:100',
                Rule::unique('plant_samples', 'sample_code')->whereNull('deleted_at'),
            ],

            // Relationships
            'plant_species_id' => ['required', 'integer', 'exists:plant_species,id'],
            'plant_variety_id' => ['nullable', 'integer', 'exists:plant_varieties,id'],

            // Ownership & Origin
            'owner_name' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'origin_location' => ['nullable', 'string', 'max:255'],

            // Lab data
            'brought_at' => ['nullable', 'date'],
            'lab_location' => ['nullable', Rule::enum(LabLocation::class)],
            'status' => ['required', Rule::enum(SampleStatus::class)],
            'quantity' => ['required', 'integer', 'min:0'],

            // Meta
            'description' => ['nullable', 'string'],
            ...$this->imageRules(),
        ];
    }
}

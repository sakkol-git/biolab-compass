<?php

declare(strict_types=1);

namespace App\Modules\Research\Requests\Experiment;

use App\Enums\ExperimentStatus;
use App\Enums\PropagationMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExperimentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('experiments.edit', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'plant_species_id' => ['sometimes', 'integer', 'exists:plant_species,id'],
            'propagation_method' => ['sometimes', Rule::enum(PropagationMethod::class)],
            'status' => ['sometimes', Rule::enum(ExperimentStatus::class)],
            'start_date' => ['sometimes', 'date'],
            'expected_end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'initial_seed_count' => ['sometimes', 'integer', 'min:1'],
            'current_count' => ['sometimes', 'integer', 'min:0'],
            'final_yield' => ['sometimes', 'integer', 'min:0'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'assigned_users' => ['nullable', 'string'],
            'tags' => ['nullable', 'string'],
        ];
    }
}

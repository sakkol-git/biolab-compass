<?php

declare(strict_types=1);

namespace App\Modules\Research\Requests\Experiment;

use App\Enums\ExperimentStatus;
use App\Enums\PropagationMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExperimentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('experiments.create', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'plant_species_id' => ['required', 'integer', 'exists:plant_species,id'],
            'propagation_method' => ['required', Rule::enum(PropagationMethod::class)],
            'status' => ['sometimes', Rule::enum(ExperimentStatus::class)],
            'start_date' => ['required', 'date'],
            'expected_end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'initial_seed_count' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
            'assigned_users' => ['nullable', 'string'], // CSV of user IDs
            'tags' => ['nullable', 'string'], // CSV of tag names
        ];
    }
}

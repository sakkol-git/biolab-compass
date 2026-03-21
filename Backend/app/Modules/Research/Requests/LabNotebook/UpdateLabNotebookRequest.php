<?php

declare(strict_types=1);

namespace App\Modules\Research\Requests\LabNotebook;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLabNotebookRequest extends FormRequest
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
            'content' => ['nullable', 'string'],
            'experiment_id' => ['nullable', 'integer', 'exists:experiments,id'],
            'tags' => ['nullable', 'string'],
        ];
    }
}

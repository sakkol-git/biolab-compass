<?php

declare(strict_types=1);

namespace App\Modules\Research\Requests\Protocol;

use App\Enums\ProtocolStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProtocolRequest extends FormRequest
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
            'description' => ['nullable', 'string'],
            'category' => ['sometimes', 'string', 'max:100'],
            'status' => ['sometimes', Rule::enum(ProtocolStatus::class)],
            'author_name' => ['nullable', 'string', 'max:255'],
            'tags' => ['nullable', 'string'],
        ];
    }
}

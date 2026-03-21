<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Borrow;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBorrowRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('borrows.create', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'borrowable_type' => ['required', 'string', Rule::in(['equipment', 'chemical', 'plant_sample'])],
            'borrowable_id' => ['required', 'integer'],
            'quantity' => ['required', 'integer', 'min:1'],
            'due_at' => ['nullable', 'date', 'after:now'],
            'notes' => ['nullable', 'string'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'borrowable_type.in' => 'The borrowable type must be one of: equipment, chemical, plant_sample.',
            'due_at.after' => 'The due date must be in the future.',
        ];
    }
}

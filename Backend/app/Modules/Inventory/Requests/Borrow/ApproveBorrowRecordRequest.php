<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\Borrow;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ApproveBorrowRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('borrows.approve', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'notes' => ['nullable', 'string'],
        ];
    }
}

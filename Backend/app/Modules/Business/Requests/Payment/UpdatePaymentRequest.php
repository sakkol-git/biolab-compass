<?php

declare(strict_types=1);

namespace App\Modules\Business\Requests\Payment;

use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('contracts.edit', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'amount' => ['sometimes', 'numeric', 'min:0.01'],
            'payment_type' => ['sometimes', Rule::enum(PaymentType::class)],
            'status' => ['sometimes', Rule::enum(PaymentStatus::class)],
            'reference_number' => ['nullable', 'string', 'max:100'],
            'due_date' => ['nullable', 'date'],
            'payment_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}

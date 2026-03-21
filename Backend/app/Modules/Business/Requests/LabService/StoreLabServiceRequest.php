<?php

declare(strict_types=1);

namespace App\Modules\Business\Requests\LabService;

use App\Enums\LabServiceStatus;
use App\Enums\ServicePaymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLabServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('contracts.create', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'service_title' => ['required', 'string', 'max:255'],
            'service_description' => ['nullable', 'string'],
            'client_name' => ['required', 'string', 'max:255'],
            'client_contact' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', Rule::enum(LabServiceStatus::class)],
            'payment_status' => ['sometimes', Rule::enum(ServicePaymentStatus::class)],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'service_fee' => ['required', 'numeric', 'min:0'],
            'assigned_staff' => ['nullable', 'array'],
            'assigned_staff.*' => ['string', 'max:255'],
        ];
    }
}

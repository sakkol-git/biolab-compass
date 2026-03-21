<?php

declare(strict_types=1);

namespace App\Modules\Business\Requests\Contract;

use App\Enums\ContractStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransitionContractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('contracts.edit', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(ContractStatus::class)],
        ];
    }
}

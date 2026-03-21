<?php

declare(strict_types=1);

namespace App\Modules\Business\Requests\ContractMilestone;

use Illuminate\Foundation\Http\FormRequest;

class StoreContractMilestoneRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('contracts.edit', 'api');
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'target_date' => ['required', 'date'],
            'projected_count' => ['required', 'integer', 'min:1'],
            'actual_count' => ['nullable', 'integer', 'min:0'],
            'actual_date' => ['nullable', 'date'],
        ];
    }
}

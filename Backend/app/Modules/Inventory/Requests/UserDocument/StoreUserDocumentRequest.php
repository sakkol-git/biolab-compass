<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Requests\UserDocument;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermissionTo('user_documents.create', 'api');
    }

    /** @return array<string, ValidationRule|array<mixed>|string> */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:10240'], // 10MB max
            'title' => ['required', 'string', 'max:255'],
            'file_type' => ['required', 'string', 'in:pdf,doc,image,certificate,other'],
            'description' => ['nullable', 'string'],
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * Thrown when attempting to edit a locked lab notebook entry.
 */
class LockedNotebookException extends RuntimeException
{
    public function __construct(string $message = 'This notebook entry is locked and cannot be modified.')
    {
        parent::__construct($message);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error' => 'notebook_locked',
            'message' => $this->getMessage(),
        ], 403);
    }
}

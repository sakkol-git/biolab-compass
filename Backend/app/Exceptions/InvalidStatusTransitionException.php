<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * Thrown when a contract status transition is not allowed.
 */
class InvalidStatusTransitionException extends RuntimeException
{
    public function __construct(string $from, string $to)
    {
        parent::__construct("Cannot transition contract from '{$from}' to '{$to}'.");
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error' => 'invalid_status_transition',
            'message' => $this->getMessage(),
        ], 422);
    }
}

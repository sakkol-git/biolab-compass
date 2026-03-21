<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * Thrown when an operation requires more stock than is available.
 */
class InsufficientStockException extends RuntimeException
{
    public function __construct(
        public readonly int $requested,
        public readonly int $available,
        string $message = '',
    ) {
        parent::__construct(
            $message ?: "Insufficient stock: requested {$requested}, only {$available} available."
        );
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error' => 'insufficient_stock',
            'message' => $this->getMessage(),
            'details' => [
                'requested' => $this->requested,
                'available' => $this->available,
            ],
        ], 422);
    }
}

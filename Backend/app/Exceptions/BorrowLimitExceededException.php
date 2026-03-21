<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * Thrown when a user exceeds their maximum active borrow limit.
 */
class BorrowLimitExceededException extends RuntimeException
{
    public function __construct(string $message = 'You have reached your maximum active borrow limit.')
    {
        parent::__construct($message);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error' => 'borrow_limit_exceeded',
            'message' => $this->getMessage(),
        ], 403);
    }
}

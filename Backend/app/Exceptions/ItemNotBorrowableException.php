<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * Thrown when an item is not in a borrowable state.
 */
class ItemNotBorrowableException extends RuntimeException
{
    public function __construct(string $message = 'This item is not currently available for borrowing.')
    {
        parent::__construct($message);
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error' => 'item_not_borrowable',
            'message' => $this->getMessage(),
        ], 400);
    }
}

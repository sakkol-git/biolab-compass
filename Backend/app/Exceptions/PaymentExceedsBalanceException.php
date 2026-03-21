<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * Thrown when a payment amount exceeds the remaining contract balance.
 */
class PaymentExceedsBalanceException extends RuntimeException
{
    public function __construct(float $amount, float $remaining)
    {
        $fmtAmount = number_format($amount, 2);
        $fmtRemaining = number_format($remaining, 2);

        parent::__construct(
            "Payment of \${$fmtAmount} exceeds remaining balance of \${$fmtRemaining}."
        );
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error' => 'payment_exceeds_balance',
            'message' => $this->getMessage(),
        ], 422);
    }
}

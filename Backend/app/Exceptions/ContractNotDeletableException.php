<?php

declare(strict_types=1);

namespace App\Exceptions;

use Illuminate\Http\JsonResponse;
use RuntimeException;

/**
 * Thrown when a contract cannot be deleted (e.g. not in Draft status).
 */
class ContractNotDeletableException extends RuntimeException
{
    public function __construct(string $status)
    {
        parent::__construct("Contracts in '{$status}' status cannot be deleted. Only draft contracts can be removed.");
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error' => 'contract_not_deletable',
            'message' => $this->getMessage(),
        ], 422);
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services;

use App\Enums\TransactionAction;
use App\Modules\Inventory\Models\ChemicalUsageLog;
use Illuminate\Support\Facades\DB;

class ChemicalUsageService
{
    public function __construct(
        private readonly TransactionService $transactionService,
    ) {}

    /**
     * Record a chemical usage entry, decrement stock, and log the transaction.
     */
    public function create(array $data, int $userId): ChemicalUsageLog
    {
        $data['user_id'] = $userId;

        return DB::transaction(function () use ($data): ChemicalUsageLog {
            $log = ChemicalUsageLog::create($data);

            // Decrement chemical stock
            $log->chemical->decrement('quantity', (int) ceil($data['quantity_used']));

            // Decrement batch stock if applicable
            if ($log->batch) {
                $log->batch->decrement('quantity', (int) ceil($data['quantity_used']));
            }

            $this->transactionService->log(
                item: $log->chemical,
                user: auth('api')->user(),
                action: TransactionAction::CONSUMED,
                quantity: (float) $data['quantity_used'],
                note: "Used for: {$data['purpose']}" . (isset($data['experiment_name']) ? " ({$data['experiment_name']})" : ''),
            );

            return $log;
        });
    }
}

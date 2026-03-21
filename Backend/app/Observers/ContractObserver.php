<?php

declare(strict_types=1);

namespace App\Observers;

use App\Enums\ContractStatus;
use App\Events\ContractStatusChanged;
use App\Modules\Business\Models\Contract;

class ContractObserver
{
    /**
     * Handle status transitions and log workflow events.
     *
     * NOTE: Auto-delivery-date and progress_pct logic is handled by
     * ContractService::transitionStatus() — NOT duplicated here.
     */
    public function updating(Contract $contract): void
    {
        if (! $contract->isDirty('status')) {
            return;
        }

        $originalStatus = $contract->getOriginal('status');
        $oldStatus = $originalStatus instanceof ContractStatus ? $originalStatus : ContractStatus::from($originalStatus);
        $newStatus = $contract->status;

        // Log the transition as a custom activity
        activity('contract-workflow')
            ->performedOn($contract)
            ->withProperties([
                'old_status' => $oldStatus->value,
                'new_status' => $newStatus->value,
                'contract_code' => $contract->contract_code,
            ])
            ->log("contract transitioned from {$oldStatus->value} to {$newStatus->value}");
    }

    /**
     * Dispatch event after the status transition has been persisted.
     */
    public function updated(Contract $contract): void
    {
        if (! $contract->wasChanged('status')) {
            return;
        }

        $originalStatus = $contract->getOriginal('status');
        $oldStatus = $originalStatus instanceof ContractStatus ? $originalStatus : ContractStatus::from($originalStatus);

        ContractStatusChanged::dispatch($contract, $oldStatus, $contract->status);
    }
}

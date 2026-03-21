<?php

declare(strict_types=1);

namespace App\Observers;

use App\Enums\MilestoneStatus;
use App\Events\MilestoneCompleted;
use App\Modules\Business\Models\ContractMilestone;

class ContractMilestoneObserver
{
    /**
     * When a milestone's status changes, log the event and dispatch if completed.
     *
     * NOTE: Progress recalculation is handled by ContractMilestoneService
     * — NOT duplicated here to avoid double-writes.
     */
    public function updated(ContractMilestone $milestone): void
    {
        if (! $milestone->isDirty('status')) {
            return;
        }

        // Log milestone status change
        $oldStatus = $milestone->getOriginal('status');
        $newStatus = $milestone->status;

        activity('milestone-workflow')
            ->performedOn($milestone)
            ->withProperties([
                'old_status' => is_string($oldStatus) ? $oldStatus : $oldStatus->value,
                'new_status' => $newStatus instanceof MilestoneStatus ? $newStatus->value : $newStatus,
                'contract_id' => $milestone->contract_id,
            ])
            ->log("milestone status changed to {$newStatus->value}");

        // Dispatch event when milestone is completed
        if ($newStatus === MilestoneStatus::COMPLETED) {
            MilestoneCompleted::dispatch($milestone);
        }
    }
}

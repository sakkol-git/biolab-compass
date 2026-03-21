<?php

declare(strict_types=1);

namespace App\Observers;

use App\Enums\BorrowStatus;
use App\Events\BorrowStatusChanged;
use App\Modules\Inventory\Models\BorrowRecord;

class BorrowRecordObserver
{
    /**
     * Log borrow status transitions (pending → approved, approved → returned, etc.).
     */
    public function updating(BorrowRecord $borrow): void
    {
        if (! $borrow->isDirty('status')) {
            return;
        }

        $originalStatus = $borrow->getOriginal('status');
        $oldStatus = $originalStatus instanceof BorrowStatus ? $originalStatus : BorrowStatus::from($originalStatus);
        $newStatus = $borrow->status;

        activity('borrow-workflow')
            ->performedOn($borrow)
            ->withProperties([
                'old_status' => $oldStatus->value,
                'new_status' => $newStatus->value,
                'borrower_id' => $borrow->user_id,
                'borrowable' => $borrow->borrowable_type.':'.$borrow->borrowable_id,
            ])
            ->log("borrow record transitioned from {$oldStatus->value} to {$newStatus->value}");
    }

    /**
     * Dispatch event after the status transition has been persisted.
     */
    public function updated(BorrowRecord $borrow): void
    {
        if (! $borrow->wasChanged('status')) {
            return;
        }

        $originalStatus = $borrow->getOriginal('status');
        $oldStatus = $originalStatus instanceof BorrowStatus ? $originalStatus->value : $originalStatus;

        BorrowStatusChanged::dispatch(
            $borrow,
            $oldStatus,
            $borrow->status->value,
        );
    }
}

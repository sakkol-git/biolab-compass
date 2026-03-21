<?php

declare(strict_types=1);

namespace App\Observers;

use App\Enums\ExperimentStatus;
use App\Events\ExperimentStatusChanged;
use App\Modules\Research\Models\Experiment;

class ExperimentObserver
{
    /**
     * Handle status transitions and auto-set dates.
     */
    public function updating(Experiment $experiment): void
    {
        if (! $experiment->isDirty('status')) {
            return;
        }

        $originalStatus = $experiment->getOriginal('status');
        $oldStatus = $originalStatus instanceof ExperimentStatus ? $originalStatus : ExperimentStatus::from($originalStatus);
        $newStatus = $experiment->status;

        // Auto-set actual_end_date when completing
        if ($newStatus === ExperimentStatus::COMPLETED && ! $experiment->actual_end_date) {
            $experiment->actual_end_date = now()->toDateString();
        }

        // Log the transition as a custom activity
        activity('experiment-workflow')
            ->performedOn($experiment)
            ->withProperties([
                'old_status' => $oldStatus->value,
                'new_status' => $newStatus->value,
            ])
            ->log("experiment transitioned from {$oldStatus->value} to {$newStatus->value}");
    }

    /**
     * Dispatch event after the status transition has been persisted.
     */
    public function updated(Experiment $experiment): void
    {
        if (! $experiment->wasChanged('status')) {
            return;
        }

        $originalStatus = $experiment->getOriginal('status');
        $oldStatus = $originalStatus instanceof ExperimentStatus ? $originalStatus : ExperimentStatus::from($originalStatus);

        ExperimentStatusChanged::dispatch($experiment, $oldStatus, $experiment->status);
    }
}

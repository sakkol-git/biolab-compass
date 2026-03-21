<?php

declare(strict_types=1);

namespace App\Observers;

use App\Modules\Research\Models\LabNotebook;

class LabNotebookObserver
{
    /**
     * Log lock/unlock transitions for notebook audit trail.
     */
    public function updating(LabNotebook $notebook): void
    {
        if (! $notebook->isDirty('is_locked')) {
            return;
        }

        $action = $notebook->is_locked ? 'locked' : 'unlocked';

        activity('notebook-workflow')
            ->performedOn($notebook)
            ->withProperties([
                'notebook_id' => $notebook->id,
                'action' => $action,
                'experiment_id' => $notebook->experiment_id,
            ])
            ->log("lab notebook was {$action}");
    }
}

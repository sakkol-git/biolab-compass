<?php

declare(strict_types=1);

namespace App\Observers;

use App\Modules\Inventory\Models\ChemicalBatch;

/**
 * WF-04: Automatically sync parent Chemical quantity when batches change.
 *
 * The parent Chemical's quantity should always equal the sum of its
 * non-deleted batch quantities, ensuring a single source of truth.
 */
class ChemicalBatchObserver
{
    public function created(ChemicalBatch $batch): void
    {
        $this->recalculateParentQuantity($batch);
    }

    public function updated(ChemicalBatch $batch): void
    {
        if ($batch->wasChanged('quantity')) {
            $this->recalculateParentQuantity($batch);
        }
    }

    public function deleted(ChemicalBatch $batch): void
    {
        $this->recalculateParentQuantity($batch);
    }

    public function restored(ChemicalBatch $batch): void
    {
        $this->recalculateParentQuantity($batch);
    }

    /**
     * Recalculate the parent chemical's total quantity from its batches.
     */
    private function recalculateParentQuantity(ChemicalBatch $batch): void
    {
        $chemical = $batch->chemical;

        if ($chemical) {
            $totalQuantity = $chemical->batches()->sum('quantity');
            $chemical->updateQuietly(['quantity' => (int) $totalQuantity]);
        }
    }
}

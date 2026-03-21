<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Modules\Inventory\Models\BorrowRecord;
use App\Modules\Inventory\Models\Transaction;
use Illuminate\Database\Eloquent\Relations\MorphMany;

/**
 * Provides polymorphic Transaction & BorrowRecord relationships
 * to any inventory model (PlantStock, Chemical, Equipment, etc.).
 */
trait HasTransactions
{
    public function transactions(): MorphMany
    {
        return $this->morphMany(Transaction::class, 'transactionable');
    }

    public function borrowRecords(): MorphMany
    {
        return $this->morphMany(BorrowRecord::class, 'borrowable');
    }

    public function activeBorrows(): MorphMany
    {
        return $this->borrowRecords()->whereNull('returned_at');
    }
}

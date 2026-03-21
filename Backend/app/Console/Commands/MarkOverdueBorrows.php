<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\BorrowStatus;
use App\Modules\Inventory\Models\BorrowRecord;
use Illuminate\Console\Command;

/**
 * WF-05: Mark overdue borrow records.
 *
 * Transitions BORROWED → OVERDUE when due_at has passed.
 */
class MarkOverdueBorrows extends Command
{
    protected $signature = 'borrows:mark-overdue';

    protected $description = 'Mark borrow records as overdue when their due date has passed';

    public function handle(): int
    {
        $count = BorrowRecord::query()
            ->where('status', BorrowStatus::BORROWED)
            ->whereNotNull('due_at')
            ->where('due_at', '<', now())
            ->update(['status' => BorrowStatus::OVERDUE]);

        $this->info("Marked {$count} borrow record(s) as overdue.");

        return self::SUCCESS;
    }
}

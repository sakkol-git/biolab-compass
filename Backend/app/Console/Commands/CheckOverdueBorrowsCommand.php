<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Enums\BorrowStatus;
use App\Modules\Inventory\Models\BorrowRecord;
use App\Modules\Core\Models\User;
use App\Notifications\OverdueBorrowNotification;
use Illuminate\Console\Command;

class CheckOverdueBorrowsCommand extends Command
{
    protected $signature = 'lab:check-overdue-borrows';

    protected $description = 'Mark overdue borrow records and notify users and managers';

    public function handle(): int
    {
        // Find borrowed items past their due date that haven't been marked overdue
        $overdueRecords = BorrowRecord::with(['user', 'borrowable'])
            ->where('status', BorrowStatus::BORROWED->value)
            ->whereNotNull('due_at')
            ->where('due_at', '<', now())
            ->get();

        if ($overdueRecords->isEmpty()) {
            $this->info('No new overdue borrow records found.');

            return self::SUCCESS;
        }

        $count = 0;

        foreach ($overdueRecords as $record) {
            // Mark as overdue
            $record->update(['status' => BorrowStatus::OVERDUE->value]);

            // Notify the borrower
            if ($record->user) {
                $record->user->notify(new OverdueBorrowNotification($record));
            }

            $count++;
        }

        // Also notify all admins and lab managers
        $managers = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['admin', 'lab-manager']);
        })->get();

        foreach ($managers as $manager) {
            $manager->notify(new OverdueBorrowNotification(
                borrowRecord: $overdueRecords->first(),
                summary: "Total {$count} borrows are now overdue.",
            ));
        }

        $this->info("Marked {$count} borrow records as overdue and notified users.");

        return self::SUCCESS;
    }
}

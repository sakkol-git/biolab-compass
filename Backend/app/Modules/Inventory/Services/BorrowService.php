<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services;

use App\Concerns\ManagesBorrowableStock;
use App\Enums\BorrowStatus;
use App\Enums\TransactionAction;
use App\Modules\Inventory\Models\BorrowRecord;
use App\Modules\Core\Models\User;
use App\Notifications\BorrowRequestNotification;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

/**
 * Handles the full borrow → return lifecycle for any borrowable inventory item.
 */
class BorrowService
{
    use ManagesBorrowableStock;

    public function __construct(
        private readonly TransactionService $transactionService,
    ) {}

    /**
     * Borrow an item.
     *
     * @throws ItemNotBorrowableException
     * @throws InsufficientStockException
     */
    public function borrow(
        Model $item,
        User $user,
        int $quantity = 1,
        ?Carbon $dueAt = null,
        ?string $notes = null,
    ): BorrowRecord {
        $this->assertBorrowable($item, $quantity);

        return DB::transaction(function () use ($item, $user, $quantity, $dueAt, $notes): BorrowRecord {
            // 1. Decrease available stock / mark as borrowed
            $this->decrementStock($item, $quantity);

            // 2. Create the borrow record
            $record = BorrowRecord::create([
                'user_id' => $user->id,
                'borrowable_type' => $item->getMorphClass(),
                'borrowable_id' => $item->getKey(),
                'quantity' => $quantity,
                'status' => BorrowStatus::BORROWED,
                'borrowed_at' => now(),
                'due_at' => $dueAt,
                'notes' => $notes,
            ]);

            // 3. Log the transaction
            $this->transactionService->log(
                item: $item,
                user: $user,
                action: TransactionAction::BORROWED,
                quantity: (float) $quantity,
                note: $notes,
            );

            return $record;
        });
    }

    /**
     * Return a borrowed item.
     */
    public function returnItem(BorrowRecord $record, ?string $notes = null): BorrowRecord
    {
        if ($record->is_returned) {
            return $record;
        }

        return DB::transaction(function () use ($record, $notes): BorrowRecord {
            // 1. Mark as returned
            $record->update([
                'status' => BorrowStatus::RETURNED,
                'returned_at' => now(),
                'notes' => $notes ?? $record->notes,
            ]);

            // 2. Restore stock / set equipment available
            $item = $record->borrowable;
            $this->incrementStock($item, $record->quantity);

            // 3. Log the return transaction
            $this->transactionService->log(
                item: $item,
                user: $record->user,
                action: TransactionAction::RETURNED,
                quantity: (float) $record->quantity,
                note: $notes,
            );

            return $record->refresh();
        });
    }

    /**
     * Request to borrow an item (creates PENDING record, no stock change).
     */
    public function requestBorrow(
        Model $item,
        User $user,
        int $quantity = 1,
        ?Carbon $dueAt = null,
        ?string $notes = null,
    ): BorrowRecord {
        $this->assertBorrowable($item, $quantity);

        return DB::transaction(function () use ($item, $user, $quantity, $dueAt, $notes): BorrowRecord {
            $record = BorrowRecord::create([
                'user_id' => $user->id,
                'borrowable_type' => $item->getMorphClass(),
                'borrowable_id' => $item->getKey(),
                'quantity' => $quantity,
                'status' => BorrowStatus::PENDING,
                'borrowed_at' => now(),
                'due_at' => $dueAt,
                'notes' => $notes,
            ]);

            // Notify managers about the new request
            $managers = User::whereHas('roles', fn ($q) => $q->whereIn('name', ['admin', 'lab-manager']))->get();
            foreach ($managers as $manager) {
                $manager->notify(new BorrowRequestNotification($record, 'requested'));
            }

            return $record;
        });
    }

    /**
     * Approve a pending borrow request (PENDING → BORROWED, stock decremented).
     */
    public function approveBorrow(BorrowRecord $record, User $approver, ?string $notes = null): BorrowRecord
    {
        abort_unless($record->status === BorrowStatus::PENDING, 422, 'Only pending borrow requests can be approved.');

        $item = $record->borrowable;
        $this->assertBorrowable($item, $record->quantity);

        return DB::transaction(function () use ($record, $item, $approver, $notes): BorrowRecord {
            // 1. Decrease stock
            $this->decrementStock($item, $record->quantity);

            // 2. Update record to BORROWED
            $record->update([
                'status' => BorrowStatus::BORROWED,
                'reviewed_by' => $approver->id,
                'reviewed_at' => now(),
                'notes' => $notes ?? $record->notes,
            ]);

            // 3. Log the transaction
            $this->transactionService->log(
                item: $item,
                user: $record->user,
                action: TransactionAction::BORROWED,
                quantity: (float) $record->quantity,
                note: "Approved by {$approver->name}".($notes ? ": {$notes}" : ''),
            );

            // 4. Notify the borrower
            $record->user->notify(new BorrowRequestNotification($record, 'approved'));

            return $record->refresh();
        });
    }

    /**
     * Reject a pending borrow request (PENDING → REJECTED, no stock change).
     */
    public function rejectBorrow(BorrowRecord $record, User $rejector, string $reason): BorrowRecord
    {
        abort_unless($record->status === BorrowStatus::PENDING, 422, 'Only pending borrow requests can be rejected.');

        return DB::transaction(function () use ($record, $rejector, $reason): BorrowRecord {
            $record->update([
                'status' => BorrowStatus::REJECTED,
                'reviewed_by' => $rejector->id,
                'reviewed_at' => now(),
                'rejected_reason' => $reason,
            ]);

            // Notify the borrower
            $record->user->notify(new BorrowRequestNotification($record, 'rejected'));

            return $record->refresh();
        });
    }

}

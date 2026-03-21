<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\TransactionAction;
use App\Models\BorrowRecord;
use App\Models\Chemical;
use App\Models\Equipment;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $chemicals = Chemical::all();
        $equipment = Equipment::all();

        $count = 0;

        // ── 1 transaction per chemical (added) ────────────────────────────────
        foreach ($chemicals->take(10) as $chemical) {
            Transaction::create([
                'user_id' => $users->random()->id,
                'transactionable_type' => 'chemical',
                'transactionable_id' => $chemical->id,
                'action' => TransactionAction::ADDED->value,
                'quantity' => $chemical->quantity,
                'note' => 'Initial stock entry',
                'created_at' => now()->subDays(rand(10, 30)),
                'updated_at' => now()->subDays(rand(10, 30)),
            ]);
            $count++;
        }

        // ── Borrow/Return transactions from existing borrow records ───────────
        $borrows = BorrowRecord::all();
        foreach ($borrows as $record) {
            // Borrow transaction
            Transaction::create([
                'user_id' => $record->user_id,
                'transactionable_type' => $record->borrowable_type,
                'transactionable_id' => $record->borrowable_id,
                'action' => TransactionAction::BORROWED->value,
                'quantity' => $record->quantity,
                'note' => 'Borrowed item',
                'created_at' => $record->borrowed_at,
                'updated_at' => $record->borrowed_at,
            ]);
            $count++;

            // Return transaction (only for returned records)
            if ($record->returned_at) {
                Transaction::create([
                    'user_id' => $record->user_id,
                    'transactionable_type' => $record->borrowable_type,
                    'transactionable_id' => $record->borrowable_id,
                    'action' => TransactionAction::RETURNED->value,
                    'quantity' => $record->quantity,
                    'note' => 'Item returned',
                    'created_at' => $record->returned_at,
                    'updated_at' => $record->returned_at,
                ]);
                $count++;
            }
        }

        $this->command->info("  ✓ Transactions seeded ({$count} total)");
    }
}

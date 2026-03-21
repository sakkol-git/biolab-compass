<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\BorrowStatus;
use App\Enums\EquipmentStatus;
use App\Models\BorrowRecord;
use App\Models\Chemical;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Database\Seeder;

class BorrowRecordSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $equipment = Equipment::where('status', EquipmentStatus::AVAILABLE->value)
            ->where('condition', '!=', 'broken')
            ->get();
        $chemicals = Chemical::where('quantity', '>', 0)->get();

        $count = 0;

        // ── 4 active equipment borrows ────────────────────────────────────────
        foreach ($equipment->take(4) as $equip) {
            $user = $users->random();
            BorrowRecord::factory()->create([
                'user_id' => $user->id,
                'borrowable_type' => 'equipment',
                'borrowable_id' => $equip->id,
                'quantity' => 1,
                'status' => BorrowStatus::BORROWED->value,
                'borrowed_at' => now()->subDays(rand(1, 5)),
                'due_at' => now()->addDays(rand(2, 7)),
                'returned_at' => null,
            ]);
            // Mark the equipment as borrowed
            $equip->update(['status' => EquipmentStatus::BORROWED->value]);
            $count++;
        }

        // ── 2 overdue borrows ─────────────────────────────────────────────────
        foreach ($equipment->slice(4, 2) as $equip) {
            $user = $users->random();
            BorrowRecord::factory()->overdue()->create([
                'user_id' => $user->id,
                'borrowable_type' => 'equipment',
                'borrowable_id' => $equip->id,
                'quantity' => 1,
            ]);
            $equip->update(['status' => EquipmentStatus::BORROWED->value]);
            $count++;
        }

        // ── 2 chemical borrows ────────────────────────────────────────────────
        foreach ($chemicals->take(2) as $chemical) {
            $qty = min(5, $chemical->quantity);
            $user = $users->random();
            BorrowRecord::factory()->create([
                'user_id' => $user->id,
                'borrowable_type' => 'chemical',
                'borrowable_id' => $chemical->id,
                'quantity' => $qty,
                'status' => BorrowStatus::BORROWED->value,
                'borrowed_at' => now()->subDays(2),
                'due_at' => now()->addDays(5),
                'returned_at' => null,
            ]);
            $chemical->decrement('quantity', $qty);
            $count++;
        }

        // ── 2 returned records ────────────────────────────────────────────────
        foreach ($chemicals->slice(2, 2) as $chemical) {
            $user = $users->random();
            BorrowRecord::factory()->returned()->create([
                'user_id' => $user->id,
                'borrowable_type' => 'chemical',
                'borrowable_id' => $chemical->id,
                'quantity' => 3,
            ]);
            $count++;
        }

        $this->command->info("  ✓ Borrow records seeded ({$count} total)");
    }
}

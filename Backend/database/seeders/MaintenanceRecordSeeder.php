<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\MaintenanceRecord;
use App\Models\User;
use Illuminate\Database\Seeder;

class MaintenanceRecordSeeder extends Seeder
{
    public function run(): void
    {
        $equipment = Equipment::all();
        $users = User::all();

        if ($equipment->isEmpty() || $users->isEmpty()) {
            $this->command->warn('  ⚠ No equipment or users found — skipping maintenance seeding.');

            return;
        }

        foreach ($equipment->random(min(3, $equipment->count())) as $item) {
            MaintenanceRecord::factory()
                ->count(rand(1, 2))
                ->create([
                    'equipment_id' => $item->id,
                    'performed_by' => $users->random()->id,
                ]);
        }

        $this->command->info('  ✓ Maintenance records seeded');
    }
}

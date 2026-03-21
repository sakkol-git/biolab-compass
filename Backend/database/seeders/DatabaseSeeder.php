<?php

declare(strict_types=1);

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Run order matters — each seeder depends on the previous one's data.
     */
    public function run(): void
    {
        $this->command->info('');
        $this->command->info('🌱  BioLab Compass — Seeding database...');
        $this->command->info('');

        $this->call([
            RolePermissionSeeder::class, // 0. Roles & permissions first
            UserSeeder::class,         // 1. Users first (needed as FK for borrows/transactions)
            PlantSpeciesSeeder::class,  // 2. Species (no deps)
            PlantVarietySeeder::class,  // 3. Varieties (needs species)
            PlantSampleSeeder::class,   // 4. Samples (needs species + varieties)
            PlantStockSeeder::class,    // 5. Stocks (needs species + varieties + samples)
            ChemicalSeeder::class,      // 6. Chemicals (no deps)
            ChemicalBatchSeeder::class, // 6b. Chemical batches (needs chemicals)
            EquipmentSeeder::class,     // 7. Equipment (no deps)
            MaintenanceRecordSeeder::class, // 7b. Maintenance records (needs equipment + users)
            BorrowRecordSeeder::class,  // 8. Borrows (needs users + chemicals + equipment)
            TransactionSeeder::class,   // 9. Transactions (needs everything above)
            AchievementSeeder::class,   // 10. Achievements (needs users)
            ResearchSeeder::class,      // 11. Research module (experiments, protocols, notebooks, growth logs, tags)
            BusinessSeeder::class,      // 12. Business module (clients, contracts, milestones, payments, forecasts, lab services)
        ]);

        $this->command->info('');
        $this->command->info('✅  All done! Test credentials:');
        $this->command->info('   Admin   → admin@biolab.test   / password');
        $this->command->info('   Manager → manager@biolab.test / password');
        $this->command->info('');
    }
}

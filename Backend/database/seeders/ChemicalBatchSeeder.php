<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Chemical;
use App\Models\ChemicalBatch;
use Illuminate\Database\Seeder;

class ChemicalBatchSeeder extends Seeder
{
    public function run(): void
    {
        $chemicals = Chemical::all();

        if ($chemicals->isEmpty()) {
            $this->command->warn('  ⚠ No chemicals found — skipping batch seeding.');

            return;
        }

        foreach ($chemicals as $chemical) {
            ChemicalBatch::factory()
                ->count(rand(1, 3))
                ->create(['chemical_id' => $chemical->id]);
        }

        $this->command->info('  ✓ Chemical batches seeded');
    }
}

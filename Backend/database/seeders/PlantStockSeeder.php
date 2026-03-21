<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\StockStatus;
use App\Models\PlantSample;
use App\Models\PlantSpecies;
use App\Models\PlantStock;
use App\Models\PlantVariety;
use Illuminate\Database\Seeder;

class PlantStockSeeder extends Seeder
{
    public function run(): void
    {
        $speciesIds = PlantSpecies::pluck('id');
        $varietyIds = PlantVariety::pluck('id');
        $sampleIds = PlantSample::pluck('id');

        // 10 stock records — each with deterministic quantity/reserved combos
        PlantStock::factory()
            ->count(10)
            ->sequence(fn ($seq) => [
                'plant_species_id' => $speciesIds->random(),
                'plant_variety_id' => $seq->index % 3 === 0
                    ? ($varietyIds->isNotEmpty() ? $varietyIds->random() : null)
                    : null,
                'plant_sample_id' => $seq->index % 4 === 0
                    ? ($sampleIds->isNotEmpty() ? $sampleIds->random() : null)
                    : null,
                // Ensure realistic status distribution
                'status' => match ($seq->index % 3) {
                    0 => StockStatus::AVAILABLE->value,
                    1 => StockStatus::RESERVED->value,
                    default => StockStatus::OUT_OF_STOCK->value,
                },
            ])
            ->create();

        $this->command->info('  ✓ Plant stocks seeded (10 total)');
    }
}

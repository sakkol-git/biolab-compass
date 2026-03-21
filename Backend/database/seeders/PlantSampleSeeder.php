<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\SampleStatus;
use App\Models\PlantSample;
use App\Models\PlantSpecies;
use App\Models\PlantVariety;
use Illuminate\Database\Seeder;

class PlantSampleSeeder extends Seeder
{
    public function run(): void
    {
        $speciesIds = PlantSpecies::pluck('id');
        $varietyIds = PlantVariety::pluck('id');

        // 10 samples — spread across existing species/varieties
        PlantSample::factory()
            ->count(10)
            ->sequence(fn ($seq) => [
                'plant_species_id' => $speciesIds->random(),
                // 50% chance of having a variety
                'plant_variety_id' => $seq->index % 2 === 0
                    ? ($varietyIds->isNotEmpty() ? $varietyIds->random() : null)
                    : null,
                // Cycle through statuses so we have a mix
                'status' => [
                    SampleStatus::ACTIVE->value,
                    SampleStatus::ACTIVE->value,
                    SampleStatus::ACTIVE->value,
                    SampleStatus::INACTIVE->value,
                    SampleStatus::ARCHIVED->value,
                ][$seq->index % 5],
            ])
            ->create();

        $this->command->info('  ✓ Plant samples seeded (10 total)');
    }
}

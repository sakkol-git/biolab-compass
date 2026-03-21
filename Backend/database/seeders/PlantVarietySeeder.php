<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\PlantSpecies;
use App\Models\PlantVariety;
use Illuminate\Database\Seeder;

class PlantVarietySeeder extends Seeder
{
    public function run(): void
    {
        // ── Attach 2 real varieties to each named species (first 5) ──────────
        $namedVarieties = [
            // Rice varieties
            ['common_name' => 'Rice',        'varieties' => [
                ['name' => 'Jasmine Rice', 'variety_code' => 'VAR-RICE-01'],
                ['name' => 'Brown Rice',   'variety_code' => 'VAR-RICE-02'],
            ]],
            // Mango varieties
            ['common_name' => 'Mango',        'varieties' => [
                ['name' => 'Nam Dok Mai', 'variety_code' => 'VAR-MANGO-01'],
                ['name' => 'Keo',         'variety_code' => 'VAR-MANGO-02'],
            ]],
            // Chilli varieties
            ['common_name' => 'Chilli Pepper', 'varieties' => [
                ['name' => 'Bird Eye Chilli', 'variety_code' => 'VAR-CHILLI-01'],
                ['name' => 'Long Red Chilli', 'variety_code' => 'VAR-CHILLI-02'],
            ]],
        ];

        foreach ($namedVarieties as $entry) {
            $species = PlantSpecies::where('common_name', $entry['common_name'])->first();
            if ($species) {
                foreach ($entry['varieties'] as $v) {
                    PlantVariety::factory()->create([
                        'plant_species_id' => $species->id,
                        'name' => $v['name'],
                        'variety_code' => $v['variety_code'],
                    ]);
                }
            }
        }

        // ── Fill remaining up to 10 total with random varieties ───────────────
        $existing = PlantVariety::count();
        $remaining = max(0, 10 - $existing);

        if ($remaining > 0) {
            // Attach to random existing species (don't create new species)
            $speciesIds = PlantSpecies::pluck('id');
            PlantVariety::factory()
                ->count($remaining)
                ->sequence(fn ($seq) => [
                    'plant_species_id' => $speciesIds->random(),
                ])
                ->create();
        }

        $this->command->info('  ✓ Plant varieties seeded ('.PlantVariety::count().' total)');
    }
}

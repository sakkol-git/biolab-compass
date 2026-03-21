<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\PlantSpecies;
use Illuminate\Database\Seeder;

class PlantSpeciesSeeder extends Seeder
{
    public function run(): void
    {
        // ── 5 realistic named species for readable test data ─────────────────
        $named = [
            ['common_name' => 'Rice',         'scientific_name' => 'Oryza sativa',        'family' => 'Poaceae',      'growth_type' => 'annual'],
            ['common_name' => 'Mango',         'scientific_name' => 'Mangifera indica',    'family' => 'Anacardiaceae', 'growth_type' => 'perennial'],
            ['common_name' => 'Chilli Pepper', 'scientific_name' => 'Capsicum annuum',     'family' => 'Solanaceae',   'growth_type' => 'annual'],
            ['common_name' => 'Sweet Basil',   'scientific_name' => 'Ocimum basilicum',    'family' => 'Lamiaceae',    'growth_type' => 'annual'],
            ['common_name' => 'Lotus',         'scientific_name' => 'Nelumbo nucifera',    'family' => 'Nelumbonaceae', 'growth_type' => 'perennial'],
        ];

        foreach ($named as $data) {
            PlantSpecies::factory()->create($data);
        }

        // ── 5 random factory-generated species ───────────────────────────────
        PlantSpecies::factory()->count(5)->create();

        $this->command->info('  ✓ Plant species seeded (5 named + 5 random = 10 total)');
    }
}

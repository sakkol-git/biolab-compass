<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ChemicalCategory;
use App\Enums\DangerLevel;
use App\Models\Chemical;
use Illuminate\Database\Seeder;

class ChemicalSeeder extends Seeder
{
    public function run(): void
    {
        // ── 5 realistic chemicals ─────────────────────────────────────────────
        $named = [
            [
                'common_name' => 'Hydrochloric Acid',
                'chemical_code' => 'CHM-HCL-01',
                'category' => ChemicalCategory::ACID->value,
                'quantity' => 200,
                'storage_location' => 'Cabinet A - Shelf 1',
                'danger_level' => DangerLevel::HIGH->value,
                'safety_measures' => 'Use gloves and eye protection. Store in ventilated area.',
                'expiry_date' => now()->addYears(2)->format('Y-m-d'),
            ],
            [
                'common_name' => 'Sodium Hydroxide',
                'chemical_code' => 'CHM-NAOH-01',
                'category' => ChemicalCategory::BASE->value,
                'quantity' => 150,
                'storage_location' => 'Cabinet A - Shelf 2',
                'danger_level' => DangerLevel::HIGH->value,
                'safety_measures' => 'Avoid contact with skin. Store away from acids.',
                'expiry_date' => now()->addYear()->format('Y-m-d'),
            ],
            [
                'common_name' => 'Ethanol',
                'chemical_code' => 'CHM-ETH-01',
                'category' => ChemicalCategory::SOLVENT->value,
                'quantity' => 500,
                'storage_location' => 'Cabinet B - Shelf 1',
                'danger_level' => DangerLevel::MEDIUM->value,
                'safety_measures' => 'Keep away from flames.',
                'expiry_date' => now()->addYears(3)->format('Y-m-d'),
            ],
            [
                'common_name' => 'Expired Test Chemical',
                'chemical_code' => 'CHM-EXP-01',
                'category' => ChemicalCategory::OTHER->value,
                'quantity' => 5,
                'storage_location' => 'Cabinet C',
                'danger_level' => DangerLevel::LOW->value,
                'safety_measures' => null,
                // Intentionally expired for testing the is_expired flag
                'expiry_date' => now()->subMonths(3)->format('Y-m-d'),
            ],
            [
                'common_name' => 'Low Stock Buffer',
                'chemical_code' => 'CHM-BUF-01',
                'category' => ChemicalCategory::OTHER->value,
                // Intentionally low stock (<=10) for testing low-stock badge
                'quantity' => 8,
                'storage_location' => 'Fridge 1',
                'danger_level' => DangerLevel::LOW->value,
                'expiry_date' => now()->addMonths(2)->format('Y-m-d'),
            ],
        ];

        foreach ($named as $data) {
            Chemical::factory()->create($data);
        }

        // ── 5 random factory chemicals ────────────────────────────────────────
        Chemical::factory()->count(5)->create();

        $this->command->info('  ✓ Chemicals seeded (5 named + 5 random = 10 total)');
    }
}

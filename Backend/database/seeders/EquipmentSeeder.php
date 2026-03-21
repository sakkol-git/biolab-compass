<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\EquipmentCategory;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentStatus;
use App\Models\Equipment;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    public function run(): void
    {
        // ── 5 realistic equipment items ───────────────────────────────────────
        $named = [
            [
                'equipment_name' => 'Zeiss Optical Microscope',
                'equipment_code' => 'EQP-MICRO-01',
                'category' => EquipmentCategory::MICROSCOPE->value,
                'status' => EquipmentStatus::AVAILABLE->value,
                'condition' => EquipmentCondition::GOOD->value,
                'location' => 'Lab A',
                'manufacturer' => 'Zeiss',
                'model_name' => 'Axiostar Plus',
                'serial_number' => 'SN-ZS-001',
                'purchase_price' => 4500.00,
            ],
            [
                'equipment_name' => 'Eppendorf Centrifuge',
                'equipment_code' => 'EQP-CENT-01',
                'category' => EquipmentCategory::CENTRIFUGE->value,
                'status' => EquipmentStatus::AVAILABLE->value,
                'condition' => EquipmentCondition::GOOD->value,
                'location' => 'Lab B',
                'manufacturer' => 'Eppendorf',
                'model_name' => '5424R',
                'serial_number' => 'SN-EP-001',
                'purchase_price' => 3200.00,
            ],
            [
                'equipment_name' => 'CO₂ Incubator',
                'equipment_code' => 'EQP-INC-01',
                'category' => EquipmentCategory::INCUBATOR->value,
                'status' => EquipmentStatus::IN_USE->value,
                'condition' => EquipmentCondition::GOOD->value,
                'location' => 'Lab A',
                'manufacturer' => 'Thermo Scientific',
                'model_name' => 'Heracell 150i',
                'serial_number' => 'SN-TS-001',
                'purchase_price' => 7800.00,
            ],
            [
                // Currently borrowed — for testing borrow flow
                'equipment_name' => 'UV/Vis Spectrophotometer',
                'equipment_code' => 'EQP-SPEC-01',
                'category' => EquipmentCategory::SPECTROPHOTOMETER->value,
                'status' => EquipmentStatus::BORROWED->value,
                'condition' => EquipmentCondition::GOOD->value,
                'location' => 'Lab B',
                'manufacturer' => 'Shimadzu',
                'model_name' => 'UV-1800',
                'serial_number' => 'SN-SZ-001',
                'purchase_price' => 5500.00,
            ],
            [
                // Broken — to test is_borrowable=false
                'equipment_name' => 'Old Phase Contrast Microscope',
                'equipment_code' => 'EQP-MICRO-02',
                'category' => EquipmentCategory::MICROSCOPE->value,
                'status' => EquipmentStatus::AVAILABLE->value,
                'condition' => EquipmentCondition::BROKEN->value,
                'location' => 'Storage Room',
                'manufacturer' => 'Olympus',
                'model_name' => 'CX31',
                'serial_number' => 'SN-OL-001',
                'purchase_price' => 1200.00,
            ],
        ];

        foreach ($named as $data) {
            Equipment::factory()->create($data);
        }

        // ── 5 random factory equipment ────────────────────────────────────────
        Equipment::factory()->count(5)->create();

        $this->command->info('  ✓ Equipment seeded (5 named + 5 random = 10 total)');
    }
}

<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\EquipmentCategory;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentStatus;
use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Equipment> */
class EquipmentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'equipment_name' => $this->faker->words(2, true),
            'equipment_code' => strtoupper($this->faker->unique()->bothify('EQP-####')),
            'category' => $this->faker->randomElement(EquipmentCategory::cases())->value,
            'status' => EquipmentStatus::AVAILABLE->value,
            'condition' => $this->faker->randomElement(EquipmentCondition::cases())->value,
            'location' => $this->faker->optional()->randomElement(['Lab A', 'Lab B', 'Storage Room']),
            'manufacturer' => $this->faker->optional()->company(),
            'model_name' => $this->faker->optional()->bothify('Model-##??'),
            'serial_number' => strtoupper($this->faker->unique()->bothify('SN-########')),
            'purchase_date' => $this->faker->optional()->date(),
            'purchase_price' => $this->faker->optional()->randomFloat(2, 50, 50000),
            'description' => $this->faker->optional()->sentence(),
            'image_url' => null,
        ];
    }

    public function borrowed(): static
    {
        return $this->state(['status' => EquipmentStatus::BORROWED->value]);
    }

    public function broken(): static
    {
        return $this->state(['condition' => EquipmentCondition::BROKEN->value]);
    }

    public function underMaintenance(): static
    {
        return $this->state(['status' => EquipmentStatus::UNDER_MAINTENANCE->value]);
    }
}

<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\MaintenanceType;
use App\Models\Equipment;
use App\Models\MaintenanceRecord;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<MaintenanceRecord> */
class MaintenanceRecordFactory extends Factory
{
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-6 months', 'now');

        return [
            'equipment_id' => Equipment::factory(),
            'performed_by' => User::factory(),
            'maintenance_type' => $this->faker->randomElement(MaintenanceType::cases())->value,
            'description' => $this->faker->sentence(),
            'technician_name' => $this->faker->optional()->name(),
            'technician_contact' => $this->faker->optional()->phoneNumber(),
            'cost' => $this->faker->optional()->randomFloat(2, 20, 5000),
            'started_at' => $startDate,
            'completed_at' => $this->faker->optional()->dateTimeBetween($startDate, 'now'),
            'next_service_date' => $this->faker->optional()->dateTimeBetween('now', '+6 months'),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}

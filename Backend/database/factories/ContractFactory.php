<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ContractStatus;
use App\Models\Client;
use App\Models\Contract;
use App\Models\PlantSpecies;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Contract> */
class ContractFactory extends Factory
{
    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(100, 5000);
        $unitPrice = $this->faker->randomFloat(2, 0.50, 10.00);

        return [
            'contract_code' => strtoupper($this->faker->unique()->bothify('CTR-####')),
            'client_id' => Client::factory(),
            'plant_species_id' => PlantSpecies::factory(),
            'species_name' => $this->faker->words(2, true),
            'common_name' => $this->faker->word(),
            'quantity_ordered' => $quantity,
            'quantity_delivered' => 0,
            'unit_price' => $unitPrice,
            'total_value' => round($quantity * $unitPrice, 2),
            'currency' => 'USD',
            'contract_date' => $this->faker->dateTimeBetween('-6 months', 'now'),
            'delivery_deadline' => $this->faker->dateTimeBetween('now', '+6 months'),
            'status' => $this->faker->randomElement(ContractStatus::cases()),
            'terms' => $this->faker->optional()->paragraph(),
            'managed_by' => User::factory(),
            'progress_pct' => $this->faker->numberBetween(0, 100),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => ContractStatus::DRAFT, 'progress_pct' => 0]);
    }

    public function signed(): static
    {
        return $this->state(['status' => ContractStatus::SIGNED, 'progress_pct' => 10]);
    }

    public function inProduction(): static
    {
        return $this->state(['status' => ContractStatus::IN_PRODUCTION, 'progress_pct' => 50]);
    }

    public function delivered(): static
    {
        return $this->state(fn () => [
            'status' => ContractStatus::DELIVERED,
            'progress_pct' => 100,
            'actual_delivery_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'quantity_delivered' => $this->faker->numberBetween(100, 5000),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(['status' => ContractStatus::CANCELLED]);
    }
}

<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Chemical;
use App\Models\ChemicalBatch;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ChemicalBatch> */
class ChemicalBatchFactory extends Factory
{
    public function definition(): array
    {
        return [
            'chemical_id' => Chemical::factory(),
            'batch_number' => strtoupper($this->faker->unique()->bothify('BATCH-####')),
            'quantity' => $this->faker->numberBetween(10, 500),
            'unit' => $this->faker->randomElement(['ml', 'g', 'L', 'kg']),
            'expiry_date' => $this->faker->optional()->dateTimeBetween('now', '+2 years'),
            'supplier_name' => $this->faker->optional()->company(),
            'supplier_contact' => $this->faker->optional()->phoneNumber(),
            'received_at' => $this->faker->optional()->dateTimeBetween('-1 year', 'now'),
            'cost_per_unit' => $this->faker->optional()->randomFloat(2, 0.5, 100),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function expired(): static
    {
        return $this->state(['expiry_date' => now()->subDays(30)]);
    }

    public function outOfStock(): static
    {
        return $this->state(['quantity' => 0]);
    }
}

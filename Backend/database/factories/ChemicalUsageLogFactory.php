<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Chemical;
use App\Models\ChemicalUsageLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ChemicalUsageLog> */
class ChemicalUsageLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'chemical_id' => Chemical::factory(),
            'chemical_batch_id' => null,
            'user_id' => User::factory(),
            'quantity_used' => $this->faker->randomFloat(2, 1, 50),
            'unit' => $this->faker->randomElement(['ml', 'g', 'L', 'drops']),
            'purpose' => $this->faker->randomElement(['Experiment', 'Testing', 'Analysis', 'Cleaning', 'Research']),
            'experiment_name' => $this->faker->optional()->words(3, true),
            'used_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}

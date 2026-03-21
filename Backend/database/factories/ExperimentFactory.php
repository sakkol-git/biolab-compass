<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ExperimentStatus;
use App\Enums\PropagationMethod;
use App\Models\Experiment;
use App\Models\PlantSpecies;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Experiment> */
class ExperimentFactory extends Factory
{
    public function definition(): array
    {
        $startDate = $this->faker->dateTimeBetween('-6 months', 'now');
        $initialCount = $this->faker->numberBetween(20, 200);

        return [
            'experiment_code' => strtoupper($this->faker->unique()->bothify('EXP-####')),
            'plant_species_id' => PlantSpecies::factory(),
            'species_name' => $this->faker->words(2, true),
            'common_name' => $this->faker->word(),
            'title' => $this->faker->sentence(4),
            'objective' => $this->faker->optional()->paragraph(),
            'propagation_method' => $this->faker->randomElement(PropagationMethod::cases()),
            'growth_medium' => $this->faker->optional()->randomElement(['MS Medium', 'Agar', 'Soil Mix', 'Hydroponic']),
            'environment' => $this->faker->optional()->randomElement(['Growth Chamber', 'Greenhouse', 'Field', 'Lab Bench']),
            'initial_seed_count' => $initialCount,
            'current_count' => $this->faker->numberBetween((int) ($initialCount * 0.5), $initialCount * 3),
            'start_date' => $startDate,
            'expected_end_date' => $this->faker->optional()->dateTimeBetween($startDate, '+6 months'),
            'status' => $this->faker->randomElement(ExperimentStatus::cases()),
            'avg_survival_rate' => $this->faker->optional()->randomFloat(2, 40, 99),
            'multiplication_rate' => $this->faker->optional()->randomFloat(2, 1.0, 5.0),
            'created_by' => User::factory(),
        ];
    }

    public function planning(): static
    {
        return $this->state(['status' => ExperimentStatus::PLANNING]);
    }

    public function active(): static
    {
        return $this->state(['status' => ExperimentStatus::ACTIVE]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => ExperimentStatus::COMPLETED,
            'actual_end_date' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'final_yield' => $this->faker->numberBetween(50, 500),
            'conclusion' => $this->faker->paragraph(),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => [
            'status' => ExperimentStatus::FAILED,
            'actual_end_date' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'conclusion' => 'The experiment did not achieve expected outcomes.',
        ]);
    }
}

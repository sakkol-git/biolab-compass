<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\GrowthStage;
use App\Models\Experiment;
use App\Models\GrowthLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<GrowthLog> */
class GrowthLogFactory extends Factory
{
    public function definition(): array
    {
        $seedlingCount = $this->faker->numberBetween(20, 200);
        $aliveCount = $this->faker->numberBetween((int) ($seedlingCount * 0.6), $seedlingCount);
        $deadCount = $seedlingCount - $aliveCount;

        return [
            'experiment_id' => Experiment::factory(),
            'week_number' => $this->faker->numberBetween(1, 20),
            'log_date' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'seedling_count' => $seedlingCount,
            'alive_count' => $aliveCount,
            'dead_count' => $deadCount,
            'new_propagations' => $this->faker->numberBetween(0, 20),
            'survival_rate_pct' => round(($aliveCount / $seedlingCount) * 100, 2),
            'multiplication_rate' => $this->faker->randomFloat(2, 0.8, 4.0),
            'health_score' => $this->faker->randomFloat(1, 3.0, 10.0),
            'avg_height_cm' => $this->faker->optional()->randomFloat(2, 1.0, 50.0),
            'growth_stage' => $this->faker->randomElement(GrowthStage::cases()),
            'observations' => $this->faker->optional()->sentence(),
            'photo_urls' => null,
            'environmental_data' => null,
            'recorded_by' => User::factory(),
        ];
    }

    public function germination(): static
    {
        return $this->state(['growth_stage' => GrowthStage::GERMINATION]);
    }

    public function vegetative(): static
    {
        return $this->state(['growth_stage' => GrowthStage::VEGETATIVE]);
    }

    public function ready(): static
    {
        return $this->state(['growth_stage' => GrowthStage::READY]);
    }
}

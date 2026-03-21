<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PlantSpecies;
use App\Models\ProductionForecast;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ProductionForecast> */
class ProductionForecastFactory extends Factory
{
    public function definition(): array
    {
        $desiredQty = $this->faker->numberBetween(500, 5000);
        $survivalRate = $this->faker->randomFloat(2, 60, 95);
        $multRate = $this->faker->randomFloat(2, 1.5, 4.0);
        $estimatedWeeks = $this->faker->numberBetween(8, 24);

        return [
            'plant_species_id' => PlantSpecies::factory(),
            'species_name' => $this->faker->words(2, true),
            'common_name' => $this->faker->word(),
            'desired_quantity' => $desiredQty,
            'recommended_initial_stock' => (int) ceil($desiredQty / ($multRate * ($survivalRate / 100))),
            'estimated_weeks' => $estimatedWeeks,
            'confidence_lower_weeks' => $estimatedWeeks - 2,
            'confidence_upper_weeks' => $estimatedWeeks + 3,
            'estimated_cycles' => $this->faker->numberBetween(2, 6),
            'estimated_survival_rate' => $survivalRate,
            'estimated_multiplication_rate' => $multRate,
            'weekly_milestones' => [],
            'resource_requirements' => [],
            'propagation_method' => $this->faker->optional()->randomElement(['seed', 'cutting', 'tissue_culture']),
            'calculated_by' => User::factory(),
        ];
    }
}

<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\PlantSpecies;
use App\Models\PlantVariety;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlantVariety>
 */
class PlantVarietyFactory extends Factory
{
    public function definition(): array
    {
        return [
            'plant_species_id' => PlantSpecies::factory(),
            'name' => $this->faker->words(2, true),
            'variety_code' => strtoupper($this->faker->unique()->bothify('VAR-####')),
            'description' => $this->faker->optional()->sentence(),
            'image_url' => null,
        ];
    }
}

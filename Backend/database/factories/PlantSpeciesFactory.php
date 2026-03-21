<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PlantGrowthType;
use App\Models\PlantSpecies;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlantSpecies>
 */
class PlantSpeciesFactory extends Factory
{
    public function definition(): array
    {
        return [
            'common_name' => $this->faker->words(2, true),
            'khmer_name' => $this->faker->word(),
            'scientific_name' => $this->faker->unique()->bothify('?? ??????'),
            'family' => $this->faker->randomElement(['Rosaceae', 'Fabaceae', 'Poaceae', 'Solanaceae']),
            'growth_type' => $this->faker->randomElement(PlantGrowthType::cases())->value,
            'native_region' => $this->faker->country(),
            'propagation_method' => $this->faker->randomElement(['seed', 'cutting', 'division', 'grafting']),
            'description' => $this->faker->sentence(),
            'image_url' => null,
        ];
    }
}

<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\LabLocation;
use App\Enums\SampleStatus;
use App\Models\PlantSample;
use App\Models\PlantSpecies;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlantSample>
 */
class PlantSampleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'plant_species_id' => PlantSpecies::factory(),
            'plant_variety_id' => null,
            'sample_name' => $this->faker->words(3, true),
            'sample_code' => strtoupper($this->faker->unique()->bothify('SMP-####')),
            'owner_name' => $this->faker->optional()->name(),
            'department' => $this->faker->optional()->randomElement(['Botany', 'Agronomy', 'Genetics']),
            'origin_location' => $this->faker->optional()->country(),
            'brought_at' => $this->faker->optional()->date(),
            'lab_location' => $this->faker->randomElement(LabLocation::cases())->value,
            'status' => $this->faker->randomElement(SampleStatus::cases())->value,
            'quantity' => $this->faker->numberBetween(0, 100),
            'description' => $this->faker->optional()->sentence(),
            'image_url' => null,
        ];
    }
}

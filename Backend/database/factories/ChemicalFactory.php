<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ChemicalCategory;
use App\Enums\DangerLevel;
use App\Models\Chemical;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Chemical> */
class ChemicalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'common_name' => $this->faker->words(2, true),
            'chemical_code' => strtoupper($this->faker->unique()->bothify('CHM-####')),
            'category' => $this->faker->randomElement(ChemicalCategory::cases())->value,
            'quantity' => $this->faker->numberBetween(0, 500),
            'storage_location' => $this->faker->optional()->randomElement(['Cabinet A', 'Cabinet B', 'Fridge 1']),
            'expiry_date' => $this->faker->optional()->dateTimeBetween('now', '+2 years'),
            'danger_level' => $this->faker->randomElement(DangerLevel::cases())->value,
            'safety_measures' => $this->faker->optional()->sentence(),
            'description' => $this->faker->optional()->sentence(),
            'image_url' => null,
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

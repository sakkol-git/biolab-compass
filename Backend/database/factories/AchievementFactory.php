<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Achievement;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Achievement> */
class AchievementFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'description' => $this->faker->sentence(),
            'criteria_type' => $this->faker->randomElement(['samples_count', 'chemicals_count', 'borrows_count', 'transactions_count']),
            'criteria_value' => $this->faker->randomElement([1, 5, 10, 25, 50]),
            'icon' => $this->faker->optional()->randomElement(['🏆', '⭐', '🎯', '🔬', '🌿']),
        ];
    }
}

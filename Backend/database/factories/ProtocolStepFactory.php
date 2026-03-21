<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Protocol;
use App\Models\ProtocolStep;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ProtocolStep> */
class ProtocolStepFactory extends Factory
{
    public function definition(): array
    {
        return [
            'protocol_id' => Protocol::factory(),
            'step_number' => $this->faker->numberBetween(1, 10),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'duration_minutes' => $this->faker->optional()->randomElement([5, 10, 15, 30, 60, 120]),
        ];
    }
}

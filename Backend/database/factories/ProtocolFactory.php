<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\ProtocolStatus;
use App\Models\Protocol;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Protocol> */
class ProtocolFactory extends Factory
{
    public function definition(): array
    {
        return [
            'protocol_code' => strtoupper($this->faker->unique()->bothify('PRT-####')),
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional()->paragraph(),
            'category' => $this->faker->randomElement(['Propagation', 'Media Prep', 'Sterilization', 'Acclimatization', 'Growth Monitoring']),
            'version' => $this->faker->randomElement(['1.0', '1.1', '2.0']),
            'status' => $this->faker->randomElement(ProtocolStatus::cases()),
            'author_id' => User::factory(),
            'author_name' => $this->faker->name(),
            'steps_count' => 0,
            'linked_experiments_count' => 0,
            'last_updated' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }

    public function draft(): static
    {
        return $this->state(['status' => ProtocolStatus::DRAFT]);
    }

    public function active(): static
    {
        return $this->state(['status' => ProtocolStatus::ACTIVE]);
    }

    public function archived(): static
    {
        return $this->state(['status' => ProtocolStatus::ARCHIVED]);
    }
}

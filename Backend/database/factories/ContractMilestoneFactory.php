<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\MilestoneStatus;
use App\Models\Contract;
use App\Models\ContractMilestone;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ContractMilestone> */
class ContractMilestoneFactory extends Factory
{
    public function definition(): array
    {
        return [
            'contract_id' => Contract::factory(),
            'milestone_name' => $this->faker->randomElement([
                'Seedling Preparation', 'First Propagation Cycle', 'Quality Check',
                'Mid-Production Review', 'Hardening Phase', 'Final Delivery',
            ]),
            'target_date' => $this->faker->dateTimeBetween('now', '+6 months'),
            'projected_count' => $this->faker->numberBetween(50, 1000),
            'actual_count' => null,
            'status' => MilestoneStatus::PENDING,
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => MilestoneStatus::COMPLETED,
            'actual_date' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'actual_count' => $this->faker->numberBetween(50, 1000),
        ]);
    }

    public function atRisk(): static
    {
        return $this->state(['status' => MilestoneStatus::AT_RISK]);
    }

    public function missed(): static
    {
        return $this->state(fn () => [
            'status' => MilestoneStatus::MISSED,
            'target_date' => $this->faker->dateTimeBetween('-3 months', '-1 week'),
        ]);
    }
}

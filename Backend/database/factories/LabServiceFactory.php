<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\LabServiceStatus;
use App\Enums\ServicePaymentStatus;
use App\Models\LabService;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<LabService> */
class LabServiceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'service_code' => strtoupper($this->faker->unique()->bothify('SVC-####')),
            'service_title' => $this->faker->sentence(3),
            'client_name' => $this->faker->company(),
            'client_contact' => $this->faker->optional()->phoneNumber(),
            'service_description' => $this->faker->paragraph(),
            'assigned_staff' => [],
            'start_date' => $this->faker->optional()->dateTimeBetween('-2 months', 'now'),
            'end_date' => null,
            'status' => $this->faker->randomElement(LabServiceStatus::cases()),
            'result_summary' => null,
            'report_file_url' => null,
            'service_fee' => $this->faker->optional()->randomFloat(2, 50, 5000),
            'payment_status' => $this->faker->randomElement(ServicePaymentStatus::cases()),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => LabServiceStatus::PENDING]);
    }

    public function inProgress(): static
    {
        return $this->state(['status' => LabServiceStatus::IN_PROGRESS]);
    }

    public function completed(): static
    {
        return $this->state(fn () => [
            'status' => LabServiceStatus::COMPLETED,
            'end_date' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'result_summary' => $this->faker->paragraph(),
        ]);
    }

    public function delivered(): static
    {
        return $this->state(fn () => [
            'status' => LabServiceStatus::DELIVERED,
            'end_date' => $this->faker->dateTimeBetween('-2 months', '-1 week'),
            'result_summary' => $this->faker->paragraph(),
            'payment_status' => ServicePaymentStatus::PAID,
        ]);
    }

    public function paid(): static
    {
        return $this->state(['payment_status' => ServicePaymentStatus::PAID]);
    }

    public function unpaid(): static
    {
        return $this->state(['payment_status' => ServicePaymentStatus::UNPAID]);
    }
}

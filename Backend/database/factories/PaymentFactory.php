<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Models\Contract;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Payment> */
class PaymentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'contract_id' => Contract::factory(),
            'amount' => $this->faker->randomFloat(2, 100, 10000),
            'currency' => 'USD',
            'payment_type' => $this->faker->randomElement(PaymentType::cases()),
            'payment_method' => $this->faker->randomElement(['bank_transfer', 'cash', 'check', 'mobile_payment']),
            'payment_date' => null,
            'due_date' => $this->faker->dateTimeBetween('now', '+3 months'),
            'status' => PaymentStatus::PENDING,
            'reference_number' => $this->faker->optional()->passthrough(strtoupper($this->faker->bothify('PAY-########'))),
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function received(): static
    {
        return $this->state(fn () => [
            'status' => PaymentStatus::RECEIVED,
            'payment_date' => $this->faker->dateTimeBetween('-2 months', 'now'),
        ]);
    }

    public function overdue(): static
    {
        return $this->state(fn () => [
            'status' => PaymentStatus::OVERDUE,
            'due_date' => $this->faker->dateTimeBetween('-3 months', '-1 week'),
        ]);
    }

    public function deposit(): static
    {
        return $this->state(['payment_type' => PaymentType::DEPOSIT]);
    }

    public function milestone(): static
    {
        return $this->state(['payment_type' => PaymentType::MILESTONE]);
    }

    public function finalPayment(): static
    {
        return $this->state(['payment_type' => PaymentType::FINAL]);
    }
}

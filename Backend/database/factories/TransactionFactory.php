<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\TransactionAction;
use App\Models\Chemical;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<Transaction> */
class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'transactionable_type' => 'chemical',
            'transactionable_id' => Chemical::factory(),
            'action' => $this->faker->randomElement(TransactionAction::cases())->value,
            'quantity' => $this->faker->randomFloat(2, 1, 100),
            'note' => $this->faker->optional()->sentence(),
        ];
    }
}

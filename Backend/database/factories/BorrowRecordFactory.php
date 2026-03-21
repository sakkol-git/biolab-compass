<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\BorrowStatus;
use App\Models\BorrowRecord;
use App\Models\Equipment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<BorrowRecord> */
class BorrowRecordFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'borrowable_type' => 'equipment',
            'borrowable_id' => Equipment::factory(),
            'quantity' => 1,
            'status' => BorrowStatus::BORROWED->value,
            'borrowed_at' => now(),
            'due_at' => now()->addDays(7),
            'returned_at' => null,
            'notes' => $this->faker->optional()->sentence(),
        ];
    }

    public function returned(): static
    {
        return $this->state([
            'status' => BorrowStatus::RETURNED->value,
            'returned_at' => now(),
        ]);
    }

    public function pending(): static
    {
        return $this->state([
            'status' => BorrowStatus::PENDING->value,
        ]);
    }

    public function overdue(): static
    {
        return $this->state([
            'status' => BorrowStatus::OVERDUE->value,
            'borrowed_at' => now()->subDays(14),
            'due_at' => now()->subDays(7),
            'returned_at' => null,
        ]);
    }
}

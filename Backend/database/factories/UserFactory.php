<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<User> */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => static::$password ??= 'password',
            'remember_token' => Str::random(10),
            'phone' => fake()->optional()->phoneNumber(),
            'role' => UserRole::STUDENT->value,
        ];
    }

    public function admin(): static
    {
        return $this->state(['role' => UserRole::ADMIN->value]);
    }

    public function labManager(): static
    {
        return $this->state(['role' => UserRole::LAB_MANAGER->value]);
    }
}

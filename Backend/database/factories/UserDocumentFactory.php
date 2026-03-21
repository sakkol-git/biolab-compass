<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\User;
use App\Models\UserDocument;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<UserDocument> */
class UserDocumentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->words(3, true),
            'file_path' => 'documents/'.$this->faker->uuid().'.pdf',
            'file_type' => $this->faker->randomElement(['pdf', 'doc', 'image', 'certificate']),
            'file_size' => $this->faker->numberBetween(1024, 5242880), // 1KB - 5MB
            'description' => $this->faker->optional()->sentence(),
        ];
    }
}

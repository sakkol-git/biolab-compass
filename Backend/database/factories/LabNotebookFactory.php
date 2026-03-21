<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Experiment;
use App\Models\LabNotebook;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<LabNotebook> */
class LabNotebookFactory extends Factory
{
    public function definition(): array
    {
        return [
            'notebook_code' => strtoupper($this->faker->unique()->bothify('NB-####')),
            'title' => $this->faker->sentence(4),
            'content' => $this->faker->optional()->paragraphs(3, true),
            'author_id' => User::factory(),
            'author_name' => $this->faker->name(),
            'experiment_id' => null,
            'is_locked' => false,
        ];
    }

    public function locked(): static
    {
        return $this->state(['is_locked' => true]);
    }

    public function forExperiment(Experiment $experiment): static
    {
        return $this->state(['experiment_id' => $experiment->id]);
    }
}

<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\User;
use Illuminate\Database\Seeder;

class AchievementSeeder extends Seeder
{
    public function run(): void
    {
        $achievements = [
            [
                'name' => 'First Sample',
                'description' => 'Contributed your first plant sample.',
                'criteria_type' => 'samples_count',
                'criteria_value' => 1,
                'icon' => '🌱',
            ],
            [
                'name' => 'Sample Collector',
                'description' => 'Contributed 10 plant samples.',
                'criteria_type' => 'samples_count',
                'criteria_value' => 10,
                'icon' => '🌿',
            ],
            [
                'name' => 'Lab Rat',
                'description' => 'Completed 5 chemical experiments.',
                'criteria_type' => 'chemicals_count',
                'criteria_value' => 5,
                'icon' => '🔬',
            ],
            [
                'name' => 'Borrower',
                'description' => 'Borrowed 5 items from the lab.',
                'criteria_type' => 'borrows_count',
                'criteria_value' => 5,
                'icon' => '📦',
            ],
            [
                'name' => 'Top Contributor',
                'description' => 'Completed 50 transactions in the system.',
                'criteria_type' => 'transactions_count',
                'criteria_value' => 50,
                'icon' => '🏆',
            ],
        ];

        foreach ($achievements as $data) {
            Achievement::firstOrCreate(['name' => $data['name']], $data);
        }

        // Assign the first achievement to the first user as a demo
        $firstUser = User::first();
        $firstAchievement = Achievement::first();

        if ($firstUser && $firstAchievement) {
            $firstUser->achievements()->syncWithoutDetaching([
                $firstAchievement->id => ['earned_at' => now()],
            ]);
        }

        $this->command->info('  ✓ Achievements seeded');
    }
}

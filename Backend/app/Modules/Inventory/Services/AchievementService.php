<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services;

use App\Modules\Core\Models\User;
use App\Modules\Inventory\Models\Achievement;
use Illuminate\Support\Facades\DB;

class AchievementService
{
    public function create(array $data): Achievement
    {
        return DB::transaction(fn () => Achievement::create($data));
    }

    public function update(Achievement $achievement, array $data): Achievement
    {
        DB::transaction(fn () => $achievement->update($data));

        return $achievement->refresh();
    }

    public function delete(Achievement $achievement): void
    {
        DB::transaction(fn () => $achievement->delete());
    }

    /**
     * Assign an achievement to a user. Returns false if already assigned.
     */
    public function assign(Achievement $achievement, User $user): bool
    {
        if ($user->achievements()->where('achievement_id', $achievement->id)->exists()) {
            return false;
        }

        $user->achievements()->attach($achievement->id, ['earned_at' => now()]);

        return true;
    }

    /**
     * Revoke an achievement from a user.
     */
    public function revoke(Achievement $achievement, User $user): void
    {
        $user->achievements()->detach($achievement->id);
    }
}

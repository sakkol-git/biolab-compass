<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Policies;

use App\Modules\Inventory\Models\Achievement;
use App\Modules\Core\Models\User;

class AchievementPolicy
{
    /**
     * Any authenticated user can list achievements.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a single achievement.
     */
    public function view(User $user, Achievement $achievement): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('achievements.create', 'api');
    }

    public function update(User $user, Achievement $achievement): bool
    {
        return $user->hasPermissionTo('achievements.edit', 'api');
    }

    public function delete(User $user, Achievement $achievement): bool
    {
        return $user->hasPermissionTo('achievements.delete', 'api');
    }
}

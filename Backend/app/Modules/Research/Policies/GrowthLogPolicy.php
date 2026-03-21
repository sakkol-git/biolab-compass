<?php

declare(strict_types=1);

namespace App\Modules\Research\Policies;

use App\Modules\Research\Models\GrowthLog;
use App\Modules\Core\Models\User;

class GrowthLogPolicy
{
    /**
     * Any authenticated user can list growth logs.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a growth log.
     */
    public function view(User $user, GrowthLog $growthLog): bool
    {
        return true;
    }

    /**
     * Users assigned to the parent experiment, or admin, can create growth logs.
     * The experiment-level assignment check is enforced in the controller/service.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('growth_logs.create', 'api');
    }

    /**
     * Creator (recorder) or admin can update.
     */
    public function update(User $user, GrowthLog $growthLog): bool
    {
        return $user->id === $growthLog->recorded_by
            || $user->hasRole('admin', 'api');
    }

    /**
     * Creator (recorder) or admin can delete.
     */
    public function delete(User $user, GrowthLog $growthLog): bool
    {
        return $user->id === $growthLog->recorded_by
            || $user->hasRole('admin', 'api');
    }
}

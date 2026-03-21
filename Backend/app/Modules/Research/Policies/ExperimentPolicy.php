<?php

declare(strict_types=1);

namespace App\Modules\Research\Policies;

use App\Modules\Research\Models\Experiment;
use App\Modules\Core\Models\User;

class ExperimentPolicy
{
    /**
     * Any authenticated user can list experiments.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view an experiment.
     */
    public function view(User $user, Experiment $experiment): bool
    {
        return true;
    }

    /**
     * Only lab_manager and admin can create experiments.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('experiments.create', 'api');
    }

    /**
     * Owner (creator or assigned user) or admin can update.
     */
    public function update(User $user, Experiment $experiment): bool
    {
        if ($user->id === $experiment->created_by) {
            return true;
        }

        if ($experiment->assignedUsers()->where('users.id', $user->id)->exists()) {
            return true;
        }

        return $user->hasRole('admin', 'api');
    }

    /**
     * Only admin can delete experiments.
     */
    public function delete(User $user, Experiment $experiment): bool
    {
        return $user->hasRole('admin', 'api');
    }
}

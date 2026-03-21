<?php

declare(strict_types=1);

namespace App\Modules\Business\Policies;

use App\Modules\Business\Models\ContractMilestone;
use App\Modules\Core\Models\User;

class ContractMilestonePolicy
{
    /**
     * Any authenticated user can list milestones.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a milestone.
     */
    public function view(User $user, ContractMilestone $milestone): bool
    {
        return true;
    }

    /**
     * Contract manager or admin can create milestones.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('milestones.create', 'api');
    }

    /**
     * Contract manager or admin can update milestones.
     */
    public function update(User $user, ContractMilestone $milestone): bool
    {
        return $user->id === $milestone->contract->managed_by
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only admin can delete milestones.
     */
    public function delete(User $user, ContractMilestone $milestone): bool
    {
        return $user->hasRole('admin', 'api');
    }
}

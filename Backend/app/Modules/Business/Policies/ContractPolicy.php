<?php

declare(strict_types=1);

namespace App\Modules\Business\Policies;

use App\Enums\ContractStatus;
use App\Modules\Business\Models\Contract;
use App\Modules\Core\Models\User;

class ContractPolicy
{
    /**
     * Only users with contracts.view permission can list contracts.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('contracts.view', 'api')
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only users with contracts.view permission can view a contract.
     */
    public function view(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('contracts.view', 'api')
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only lab_manager and admin can create contracts.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('contracts.create', 'api');
    }

    /**
     * Manager (managed_by) or admin can update.
     */
    public function update(User $user, Contract $contract): bool
    {
        return $user->id === $contract->managed_by
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only admin can delete, and only Draft-status contracts.
     */
    public function delete(User $user, Contract $contract): bool
    {
        return $user->hasRole('admin', 'api')
            && $contract->status === ContractStatus::DRAFT;
    }

    /**
     * Users with contracts.manage-status permission can transition status.
     */
    public function transition(User $user, Contract $contract): bool
    {
        return $user->hasPermissionTo('contracts.manage-status', 'api');
    }
}

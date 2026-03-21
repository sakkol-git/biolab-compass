<?php

declare(strict_types=1);

namespace App\Modules\Research\Policies;

use App\Modules\Research\Models\Protocol;
use App\Modules\Core\Models\User;

class ProtocolPolicy
{
    /**
     * Any authenticated user can list protocols.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a protocol.
     */
    public function view(User $user, Protocol $protocol): bool
    {
        return true;
    }

    /**
     * Only lab_manager and admin can create protocols.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('protocols.create', 'api');
    }

    /**
     * Author or admin can update.
     */
    public function update(User $user, Protocol $protocol): bool
    {
        return $user->id === $protocol->author_id
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only admin can delete protocols.
     */
    public function delete(User $user, Protocol $protocol): bool
    {
        return $user->hasRole('admin', 'api');
    }
}

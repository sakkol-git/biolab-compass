<?php

declare(strict_types=1);

namespace App\Modules\Business\Policies;

use App\Modules\Business\Models\Client;
use App\Modules\Core\Models\User;

class ClientPolicy
{
    /**
     * Only users with clients.view permission can list clients.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('clients.view', 'api')
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only users with clients.view permission can view a client.
     */
    public function view(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('clients.view', 'api')
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only lab_manager and admin can create clients.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('clients.create', 'api');
    }

    /**
     * Only lab_manager and admin can update clients.
     */
    public function update(User $user, Client $client): bool
    {
        return $user->hasPermissionTo('clients.edit', 'api');
    }

    /**
     * Only admin can delete clients.
     */
    public function delete(User $user, Client $client): bool
    {
        return $user->hasRole('admin', 'api');
    }
}

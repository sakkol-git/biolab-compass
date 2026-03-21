<?php

declare(strict_types=1);

namespace App\Modules\Core\Services;

use App\Modules\Core\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class UserService
{
    /**
     * Create a new user and assign the matching Spatie role.
     * The `role` field in $data determines which Spatie role to assign.
     */
    public function create(array $data): User
    {
        return DB::transaction(function () use ($data): User {
            $roleName = $data['role'] ?? 'student';
            $user = User::create($data);

            // Assign the Spatie role (single source of truth for authorization)
            $spatieRole = Role::findByName($roleName, 'api');
            $user->assignRole($spatieRole);

            return $user;
        });
    }

    /**
     * Update a user and re-sync Spatie role if the role changed.
     */
    public function update(User $user, array $data): User
    {
        DB::transaction(function () use ($user, $data): void {
            $user->update($data);

            if (isset($data['role'])) {
                $user->syncRoles([Role::findByName($data['role'], 'api')]);
            }
        });

        return $user->refresh();
    }

    /**
     * Delete a user.
     */
    public function delete(User $user): void
    {
        DB::transaction(fn () => $user->delete());
    }
}

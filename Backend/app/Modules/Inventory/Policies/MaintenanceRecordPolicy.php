<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Policies;

use App\Modules\Inventory\Models\MaintenanceRecord;
use App\Modules\Core\Models\User;

class MaintenanceRecordPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('maintenance.view', 'api');
    }

    public function view(User $user, MaintenanceRecord $record): bool
    {
        return $user->hasPermissionTo('maintenance.view', 'api');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('maintenance.create', 'api');
    }

    public function update(User $user, MaintenanceRecord $record): bool
    {
        return $user->hasPermissionTo('maintenance.edit', 'api');
    }

    public function delete(User $user, MaintenanceRecord $record): bool
    {
        return $user->hasPermissionTo('maintenance.delete', 'api');
    }
}

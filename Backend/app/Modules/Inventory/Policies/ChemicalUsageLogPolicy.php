<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Policies;

use App\Modules\Inventory\Models\ChemicalUsageLog;
use App\Modules\Core\Models\User;

class ChemicalUsageLogPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('chemical_usage.view', 'api');
    }

    public function view(User $user, ChemicalUsageLog $log): bool
    {
        return $user->hasPermissionTo('chemical_usage.view', 'api');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('chemical_usage.create', 'api');
    }
}

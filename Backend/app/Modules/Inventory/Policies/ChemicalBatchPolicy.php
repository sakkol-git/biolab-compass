<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Policies;

use App\Modules\Inventory\Models\ChemicalBatch;
use App\Modules\Core\Models\User;

class ChemicalBatchPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('chemical_batches.view', 'api');
    }

    public function view(User $user, ChemicalBatch $batch): bool
    {
        return $user->hasPermissionTo('chemical_batches.view', 'api');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('chemical_batches.create', 'api');
    }

    public function update(User $user, ChemicalBatch $batch): bool
    {
        return $user->hasPermissionTo('chemical_batches.edit', 'api');
    }

    public function delete(User $user, ChemicalBatch $batch): bool
    {
        return $user->hasPermissionTo('chemical_batches.delete', 'api');
    }
}

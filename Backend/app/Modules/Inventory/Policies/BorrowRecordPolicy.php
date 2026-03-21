<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Policies;

use App\Modules\Inventory\Models\BorrowRecord;
use App\Modules\Core\Models\User;

class BorrowRecordPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('borrows.view', 'api');
    }

    public function view(User $user, BorrowRecord $borrowRecord): bool
    {
        // Users can always view their own borrow records
        if ($user->id === $borrowRecord->user_id) {
            return true;
        }

        return $user->hasPermissionTo('borrows.view', 'api');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('borrows.create', 'api');
    }

    public function return(User $user, BorrowRecord $borrowRecord): bool
    {
        return $user->hasPermissionTo('borrows.return', 'api');
    }

    public function approve(User $user, BorrowRecord $borrowRecord): bool
    {
        return $user->hasPermissionTo('borrows.approve', 'api');
    }
}

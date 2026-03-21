<?php

declare(strict_types=1);

namespace App\Modules\Business\Policies;

use App\Enums\LabServiceStatus;
use App\Modules\Business\Models\LabService;
use App\Modules\Core\Models\User;

class LabServicePolicy
{
    /**
     * Any authenticated user can list lab services.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a lab service.
     */
    public function view(User $user, LabService $labService): bool
    {
        return true;
    }

    /**
     * Only lab_manager and admin can create lab services.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('lab_services.create', 'api');
    }

    /**
     * Only lab_manager and admin can update lab services.
     */
    public function update(User $user, LabService $labService): bool
    {
        return $user->hasPermissionTo('lab_services.edit', 'api');
    }

    /**
     * Only admin can delete, and only Pending-status lab services.
     */
    public function delete(User $user, LabService $labService): bool
    {
        return $user->hasRole('admin', 'api')
            && $labService->status === LabServiceStatus::PENDING;
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Research\Policies;

use App\Modules\Research\Models\LabNotebook;
use App\Modules\Core\Models\User;

class LabNotebookPolicy
{
    /**
     * Any authenticated user can list notebooks.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a notebook.
     */
    public function view(User $user, LabNotebook $labNotebook): bool
    {
        return true;
    }

    /**
     * Any authenticated user can create a notebook.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Author (if notebook is not locked) or admin can update.
     */
    public function update(User $user, LabNotebook $labNotebook): bool
    {
        if ($user->hasRole('admin', 'api')) {
            return true;
        }

        return $user->id === $labNotebook->author_id && ! $labNotebook->is_locked;
    }

    /**
     * Only admin can delete, and only if the notebook is not locked.
     */
    public function delete(User $user, LabNotebook $labNotebook): bool
    {
        return $user->hasRole('admin', 'api') && ! $labNotebook->is_locked;
    }

    /**
     * Author or admin can toggle the lock.
     */
    public function toggleLock(User $user, LabNotebook $labNotebook): bool
    {
        return $user->id === $labNotebook->author_id
            || $user->hasRole('admin', 'api');
    }
}

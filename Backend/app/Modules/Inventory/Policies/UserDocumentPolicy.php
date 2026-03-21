<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Policies;

use App\Modules\Core\Models\User;
use App\Modules\Inventory\Models\UserDocument;

class UserDocumentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('user_documents.view', 'api');
    }

    public function view(User $user, UserDocument $document): bool
    {
        // Users can view their own documents or must have permission
        return $user->id === $document->user_id
            || $user->hasPermissionTo('user_documents.view', 'api');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('user_documents.create', 'api');
    }

    public function delete(User $user, UserDocument $document): bool
    {
        // Users can delete their own documents or must have permission
        return $user->id === $document->user_id
            || $user->hasPermissionTo('user_documents.delete', 'api');
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Business\Policies;

use App\Enums\PaymentStatus;
use App\Modules\Business\Models\Payment;
use App\Modules\Core\Models\User;

class PaymentPolicy
{
    /**
     * Only users with payments.view permission can list payments.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('payments.view', 'api')
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only users with payments.view permission can view a payment.
     */
    public function view(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('payments.view', 'api')
            || $user->hasRole('admin', 'api');
    }

    /**
     * Only lab_manager and admin can create payments.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('payments.create', 'api');
    }

    /**
     * Only lab_manager and admin can update payments.
     */
    public function update(User $user, Payment $payment): bool
    {
        return $user->hasPermissionTo('payments.edit', 'api');
    }

    /**
     * Only admin can delete, and only Pending-status payments.
     */
    public function delete(User $user, Payment $payment): bool
    {
        return $user->hasRole('admin', 'api')
            && $payment->status === PaymentStatus::PENDING;
    }
}

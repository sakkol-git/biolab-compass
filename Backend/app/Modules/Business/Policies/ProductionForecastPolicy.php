<?php

declare(strict_types=1);

namespace App\Modules\Business\Policies;

use App\Modules\Business\Models\ProductionForecast;
use App\Modules\Core\Models\User;

class ProductionForecastPolicy
{
    /**
     * Any authenticated user can list forecasts.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Any authenticated user can view a forecast.
     */
    public function view(User $user, ProductionForecast $forecast): bool
    {
        return true;
    }

    /**
     * Only lab_manager and admin can calculate (create) forecasts.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('forecasts.calculate', 'api');
    }

    /**
     * Only admin can delete forecasts.
     */
    public function delete(User $user, ProductionForecast $forecast): bool
    {
        return $user->hasRole('admin', 'api');
    }
}

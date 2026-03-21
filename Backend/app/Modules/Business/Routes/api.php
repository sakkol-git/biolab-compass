<?php

use App\Modules\Business\Controllers\ClientController;
use App\Modules\Business\Controllers\ContractController;
use App\Modules\Business\Controllers\ContractMilestoneController;
use App\Modules\Business\Controllers\LabServiceController;
use App\Modules\Business\Controllers\PaymentController;
use App\Modules\Business\Controllers\ProductionForecastController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {

    // ─── Clients ─────────────────────────────────────────────────────────────
    Route::get('clients/stats', [ClientController::class, 'stats'])
        ->name('clients.stats');
    Route::apiResource('clients', ClientController::class);

    // ─── Contracts ───────────────────────────────────────────────────────────
    Route::get('contracts/stats', [ContractController::class, 'stats'])
        ->name('contracts.stats');
    Route::get('contracts/pipeline', [ContractController::class, 'pipeline'])
        ->name('contracts.pipeline');
    Route::post('contracts/{contract}/transition', [ContractController::class, 'transition'])
        ->name('contracts.transition');
    Route::apiResource('contracts', ContractController::class);

    Route::apiResource('contracts.milestones', ContractMilestoneController::class)
        ->parameters(['milestones' => 'milestone']);

    // ─── Payments ────────────────────────────────────────────────────────────
    Route::get('payments/stats', [PaymentController::class, 'stats'])
        ->name('payments.stats');
    Route::apiResource('payments', PaymentController::class);

    // ─── Production Forecasts ────────────────────────────────────────────────
    Route::post('production-forecasts/calculate', [ProductionForecastController::class, 'calculate'])
        ->name('production-forecasts.calculate');
    Route::apiResource('production-forecasts', ProductionForecastController::class)
        ->only(['index', 'show', 'destroy'])
        ->parameters(['production-forecasts' => 'productionForecast']);

    // ─── Lab Services ────────────────────────────────────────────────────────
    Route::get('lab-services/stats', [LabServiceController::class, 'stats'])
        ->name('lab-services.stats');
    Route::apiResource('lab-services', LabServiceController::class)
        ->parameters(['lab-services' => 'labService']);
});

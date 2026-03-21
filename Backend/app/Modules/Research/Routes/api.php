<?php

use App\Modules\Research\Controllers\ExperimentController;
use App\Modules\Research\Controllers\GrowthLogController;
use App\Modules\Research\Controllers\LabNotebookController;
use App\Modules\Research\Controllers\ProtocolController;
use App\Modules\Research\Controllers\SpeciesAnalyticsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:api')->group(function () {

    // ─── Experiments ─────────────────────────────────────────────────────────
    Route::get('experiments/stats', [ExperimentController::class, 'stats'])
        ->name('experiments.stats');
    Route::apiResource('experiments', ExperimentController::class);

    // ─── Growth Logs ─────────────────────────────────────────────────────────
    Route::get('growth-logs/next-week/{experimentId}', [GrowthLogController::class, 'nextWeek'])
        ->name('growth-logs.next-week');
    Route::apiResource('growth-logs', GrowthLogController::class)
        ->parameters(['growth-logs' => 'growthLog']);

    // ─── Protocols ───────────────────────────────────────────────────────────
    Route::apiResource('protocols', ProtocolController::class);

    // ─── Lab Notebooks ───────────────────────────────────────────────────────
    Route::post('lab-notebooks/{labNotebook}/toggle-lock', [LabNotebookController::class, 'toggleLock'])
        ->name('lab-notebooks.toggle-lock');
    Route::apiResource('lab-notebooks', LabNotebookController::class)
        ->parameters(['lab-notebooks' => 'labNotebook']);

    // ─── Species Analytics ───────────────────────────────────────────────────
    Route::prefix('species-analytics')->name('species-analytics.')->group(function () {
        Route::get('profiles', [SpeciesAnalyticsController::class, 'profiles'])->name('profiles');
        Route::get('comparison', [SpeciesAnalyticsController::class, 'comparison'])->name('comparison');
        Route::get('growth-curve/{experimentId}', [SpeciesAnalyticsController::class, 'growthCurve'])->name('growth-curve');
        Route::get('stage-distribution', [SpeciesAnalyticsController::class, 'stageDistribution'])->name('stage-distribution');
        Route::get('health-scores', [SpeciesAnalyticsController::class, 'healthScores'])->name('health-scores');
    });
});

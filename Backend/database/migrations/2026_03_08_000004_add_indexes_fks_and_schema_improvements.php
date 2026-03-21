<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * DB-02: Add missing indexes on frequently filtered columns.
 * DI-05: Add experiment_id FK to chemical_usage_logs.
 * DM-04: Add client_id FK to lab_services.
 * WF-03: Add contract_id FK to production_forecasts.
 * DM-02/DM-03: Add species_snapshot JSON columns to experiments and contracts.
 * DI-04: Remove denormalized author_name issue — add metadata approach.
 * SC-04: Add timezone to users.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ─── DB-02: Missing Indexes ────────────────────────────────────────────

        Schema::table('chemical_usage_logs', function (Blueprint $table) {
            $table->index(['chemical_id', 'used_at']);
        });

        Schema::table('growth_logs', function (Blueprint $table) {
            $table->index(['experiment_id', 'week_number']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->index(['contract_id', 'status'], 'idx_payments_contract_status');
        });

        Schema::table('lab_services', function (Blueprint $table) {
            $table->index(['status', 'payment_status']);
        });

        Schema::table('borrow_records', function (Blueprint $table) {
            $table->index('user_id');
        });

        // ─── DI-05: Add experiment_id FK to chemical_usage_logs ────────────────

        Schema::table('chemical_usage_logs', function (Blueprint $table) {
            $table->foreignId('experiment_id')
                ->nullable()
                ->after('experiment_name')
                ->constrained('experiments')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });

        // ─── DM-04: Add client_id FK to lab_services ──────────────────────────

        Schema::table('lab_services', function (Blueprint $table) {
            $table->foreignId('client_id')
                ->nullable()
                ->after('service_description')
                ->constrained('clients')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });

        // ─── WF-03: Add contract_id FK to production_forecasts ─────────────────

        Schema::table('production_forecasts', function (Blueprint $table) {
            $table->foreignId('contract_id')
                ->nullable()
                ->after('plant_species_id')
                ->constrained('contracts')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });

        // ─── DM-02/DM-03: Add species_snapshot to experiments and contracts ────

        Schema::table('experiments', function (Blueprint $table) {
            $table->json('species_snapshot')->nullable()->after('common_name');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->json('species_snapshot')->nullable()->after('common_name');
        });

        // ─── SC-04: Add timezone to users ──────────────────────────────────────

        Schema::table('users', function (Blueprint $table) {
            $table->string('timezone', 50)->default('Asia/Phnom_Penh')->after('phone');
        });
    }

    public function down(): void
    {
        Schema::table('chemical_usage_logs', function (Blueprint $table) {
            $table->dropIndex(['chemical_id', 'used_at']);
            $table->dropForeign(['experiment_id']);
            $table->dropColumn('experiment_id');
        });

        Schema::table('growth_logs', function (Blueprint $table) {
            $table->dropIndex(['experiment_id', 'week_number']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex('idx_payments_contract_status');
        });

        Schema::table('lab_services', function (Blueprint $table) {
            $table->dropIndex(['status', 'payment_status']);
            $table->dropForeign(['client_id']);
            $table->dropColumn('client_id');
        });

        Schema::table('borrow_records', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });

        Schema::table('production_forecasts', function (Blueprint $table) {
            $table->dropForeign(['contract_id']);
            $table->dropColumn('contract_id');
        });

        Schema::table('experiments', function (Blueprint $table) {
            $table->dropColumn('species_snapshot');
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->dropColumn('species_snapshot');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('timezone');
        });
    }
};

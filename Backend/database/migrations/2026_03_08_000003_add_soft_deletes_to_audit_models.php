<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * DB-04: Add soft deletes to audit-critical models that should preserve history.
 * - Transaction: audit trail must never be permanently deleted
 * - ChemicalUsageLog: usage records should be preserved
 * - MaintenanceRecord: maintenance history for compliance
 * - ContractMilestone: contract history integrity
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('chemical_usage_logs', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('maintenance_records', function (Blueprint $table) {
            $table->softDeletes();
        });

        Schema::table('contract_milestones', function (Blueprint $table) {
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('chemical_usage_logs', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('maintenance_records', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('contract_milestones', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};

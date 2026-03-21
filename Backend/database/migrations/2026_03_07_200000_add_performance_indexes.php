<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add indexes to frequently queried columns for better performance.
     *
     * Addresses DB-2 from the project technical audit.
     */
    public function up(): void
    {
        // Users: filtered by role in AdminMiddleware and queries
        Schema::table('users', function (Blueprint $table) {
            $table->index('role');
        });

        // Chemicals: searched by common_name
        Schema::table('chemicals', function (Blueprint $table) {
            $table->index('common_name');
        });

        // Equipment: searched by equipment_name
        Schema::table('equipment', function (Blueprint $table) {
            $table->index('equipment_name');
        });

        // Plant samples: filtered by department and lab_location
        Schema::table('plant_samples', function (Blueprint $table) {
            $table->index('department');
            $table->index('lab_location');
        });

        // Borrow records: queried by date ranges
        Schema::table('borrow_records', function (Blueprint $table) {
            $table->index('borrowed_at');
        });

        // Contracts: frequently filtered by status
        Schema::table('contracts', function (Blueprint $table) {
            $table->index('status');
        });

        // Payments: frequently filtered by status and due_date
        Schema::table('payments', function (Blueprint $table) {
            $table->index('status');
            $table->index('due_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role']);
        });

        Schema::table('chemicals', function (Blueprint $table) {
            $table->dropIndex(['common_name']);
        });

        Schema::table('equipment', function (Blueprint $table) {
            $table->dropIndex(['equipment_name']);
        });

        Schema::table('plant_samples', function (Blueprint $table) {
            $table->dropIndex(['department']);
            $table->dropIndex(['lab_location']);
        });

        Schema::table('borrow_records', function (Blueprint $table) {
            $table->dropIndex(['borrowed_at']);
        });

        Schema::table('contracts', function (Blueprint $table) {
            $table->dropIndex(['status']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['due_date']);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Adds `image_path` column to all inventory tables that support images.
 *
 * Stores the path of an uploaded file (relative to the "public" disk).
 * The existing `image_url` column is kept for external URL references.
 * Both are nullable — at most one should be populated per record.
 */
return new class extends Migration
{
    /** Tables that receive the new column. */
    private const TABLES = [
        'plant_species',
        'plant_varieties',
        'plant_samples',
        'chemicals',
        'equipment',
    ];

    public function up(): void
    {
        foreach (self::TABLES as $table) {
            Schema::table($table, function (Blueprint $t): void {
                $t->string('image_path')->nullable()->after('image_url');
            });
        }
    }

    public function down(): void
    {
        foreach (self::TABLES as $table) {
            Schema::table($table, function (Blueprint $t): void {
                $t->dropColumn('image_path');
            });
        }
    }
};

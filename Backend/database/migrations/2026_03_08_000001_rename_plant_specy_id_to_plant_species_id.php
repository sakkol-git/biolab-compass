<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * DM-01: Fix the `plant_specy_id` column name typo across all tables.
 *
 * The singular of "species" is "species" (not "specy").
 * This migration renames the column in all three tables that reference plant_species.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plant_varieties', function (Blueprint $table) {
            $table->renameColumn('plant_specy_id', 'plant_species_id');
        });

        Schema::table('plant_samples', function (Blueprint $table) {
            $table->renameColumn('plant_specy_id', 'plant_species_id');
        });

        Schema::table('plant_stocks', function (Blueprint $table) {
            $table->renameColumn('plant_specy_id', 'plant_species_id');
        });
    }

    public function down(): void
    {
        Schema::table('plant_varieties', function (Blueprint $table) {
            $table->renameColumn('plant_species_id', 'plant_specy_id');
        });

        Schema::table('plant_samples', function (Blueprint $table) {
            $table->renameColumn('plant_species_id', 'plant_specy_id');
        });

        Schema::table('plant_stocks', function (Blueprint $table) {
            $table->renameColumn('plant_species_id', 'plant_specy_id');
        });
    }
};

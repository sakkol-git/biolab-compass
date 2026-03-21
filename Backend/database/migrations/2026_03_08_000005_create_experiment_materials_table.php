<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * WF-01: Create experiment_materials pivot table for Experiment → Inventory integration.
 *
 * This enables tracking which chemicals, stocks, and samples are consumed/produced
 * during experiments, linking the Research and Inventory modules.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiment_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('experiment_id')->constrained('experiments')->cascadeOnDelete()->cascadeOnUpdate();

            // Polymorphic: can reference Chemical, PlantStock, PlantSample, ChemicalBatch
            $table->string('materialable_type', 50);
            $table->unsignedBigInteger('materialable_id');

            $table->decimal('quantity_used', 10, 2)->default(0);
            $table->string('unit', 20)->nullable();
            $table->string('purpose', 255)->nullable();
            $table->enum('usage_type', ['consumed', 'produced', 'reference'])->default('consumed');
            $table->text('notes')->nullable();

            $table->timestamps();

            // Indexes
            $table->index(['materialable_type', 'materialable_id'], 'idx_experiment_materials_morph');
            $table->index('experiment_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiment_materials');
    }
};

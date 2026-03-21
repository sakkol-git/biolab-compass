<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * HI-04: Create location_history table for tracking inventory movements.
 *
 * When items (equipment, samples) move between locations, this table
 * preserves the full movement history for compliance and traceability.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('location_history', function (Blueprint $table) {
            $table->id();

            // Polymorphic: Equipment, PlantSample, etc.
            $table->string('entity_type', 50);
            $table->unsignedBigInteger('entity_id');

            $table->string('from_location', 100)->nullable();
            $table->string('to_location', 100);
            $table->foreignId('moved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('moved_at');
            $table->string('reason', 255)->nullable();

            $table->timestamps();

            $table->index(['entity_type', 'entity_id'], 'idx_location_history_entity');
            $table->index('moved_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('location_history');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_forecasts', function (Blueprint $table) {
            $table->id();

            // Species reference
            $table->foreignId('plant_species_id')->nullable()->constrained('plant_species')->nullOnDelete();
            $table->string('species_name');
            $table->string('common_name');

            // Forecast inputs
            $table->unsignedInteger('desired_quantity');
            $table->unsignedInteger('recommended_initial_stock');

            // Time estimates
            $table->unsignedInteger('estimated_weeks');
            $table->unsignedInteger('confidence_lower_weeks');
            $table->unsignedInteger('confidence_upper_weeks');
            $table->unsignedInteger('estimated_cycles');

            // Rate estimates
            $table->decimal('estimated_survival_rate', 5, 2);
            $table->decimal('estimated_multiplication_rate', 8, 2);

            // Structured data
            $table->json('weekly_milestones');        // [{week, projected}, ...]
            $table->json('resource_requirements');     // {greenhouses, laborHours, estimatedCost}

            // Metadata
            $table->string('propagation_method', 50)->nullable();
            $table->foreignId('calculated_by')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->index('plant_species_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_forecasts');
    }
};

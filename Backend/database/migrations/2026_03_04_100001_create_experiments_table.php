<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('experiments', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('experiment_code', 20)->unique();
            $table->foreignId('plant_species_id')->nullable()->constrained('plant_species')->nullOnDelete();
            $table->string('species_name');
            $table->string('common_name');

            // Description
            $table->string('title', 500);
            $table->text('objective')->nullable();

            // Method & Environment
            $table->string('propagation_method', 50);
            $table->string('growth_medium')->nullable();
            $table->string('environment')->nullable();

            // Counts
            $table->unsignedInteger('initial_seed_count')->default(0);
            $table->unsignedInteger('current_count')->default(0);

            // Dates
            $table->date('start_date');
            $table->date('expected_end_date')->nullable();
            $table->date('actual_end_date')->nullable();

            // Status & Metrics
            $table->string('status', 20)->default('planning');
            $table->unsignedInteger('final_yield')->nullable();
            $table->decimal('avg_survival_rate', 5, 2)->nullable();
            $table->decimal('multiplication_rate', 8, 2)->nullable();

            // Conclusion (completed experiments only)
            $table->text('conclusion')->nullable();

            // Media
            $table->string('image_url', 2048)->nullable();

            // Ownership
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();

            $table->softDeletes();
            $table->timestamps();

            // Indexes for common queries
            $table->index('status');
            $table->index('plant_species_id');
            $table->index('propagation_method');
            $table->index('start_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('experiments');
    }
};

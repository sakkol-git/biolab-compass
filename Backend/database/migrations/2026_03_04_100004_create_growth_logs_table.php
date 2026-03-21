<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('growth_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('experiment_id')->constrained()->cascadeOnDelete();

            // Log identity
            $table->unsignedInteger('week_number');
            $table->date('log_date');

            // Counts
            $table->unsignedInteger('seedling_count')->default(0);
            $table->unsignedInteger('alive_count')->default(0);
            $table->unsignedInteger('dead_count')->default(0);
            $table->unsignedInteger('new_propagations')->default(0);

            // Metrics
            $table->decimal('survival_rate_pct', 5, 2)->default(0.00);
            $table->decimal('multiplication_rate', 8, 2)->default(0.00);
            $table->decimal('health_score', 3, 1)->default(0.0);
            $table->decimal('avg_height_cm', 6, 2)->nullable();

            // Stage
            $table->string('growth_stage', 20)->default('germination');

            // Notes & Media
            $table->text('observations')->nullable();
            $table->json('photo_urls')->nullable();
            $table->json('environmental_data')->nullable();

            // Recorder
            $table->foreignId('recorded_by')->nullable()->constrained('users')->nullOnDelete();

            $table->softDeletes();
            $table->timestamps();

            // Each experiment can only have one log per week
            $table->unique(['experiment_id', 'week_number']);
            $table->index('growth_stage');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('growth_logs');
    }
};

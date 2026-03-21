<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contract_milestones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->cascadeOnDelete();

            // Milestone details
            $table->string('milestone_name');
            $table->date('target_date');
            $table->date('actual_date')->nullable();

            // Counts
            $table->unsignedInteger('projected_count')->default(0);
            $table->unsignedInteger('actual_count')->nullable();

            // Status
            $table->string('status', 20)->default('pending');

            // Notes
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index('contract_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contract_milestones');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('contract_code', 20)->unique();

            // Relationships
            $table->foreignId('client_id')->constrained()->restrictOnDelete();
            $table->foreignId('plant_species_id')->nullable()->constrained('plant_species')->nullOnDelete();

            // Species (denormalized for display)
            $table->string('species_name');
            $table->string('common_name');

            // Order details
            $table->unsignedInteger('quantity_ordered');
            $table->unsignedInteger('quantity_delivered')->default(0);
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_value', 15, 2); // computed: quantity_ordered * unit_price
            $table->string('currency', 3)->default('USD');

            // Dates
            $table->date('contract_date');
            $table->date('delivery_deadline');
            $table->date('actual_delivery_date')->nullable();

            // Status & Progress
            $table->string('status', 20)->default('draft');
            $table->text('terms')->nullable();
            $table->foreignId('managed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedTinyInteger('progress_pct')->default(0);

            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
            $table->index('client_id');
            $table->index('delivery_deadline');
            $table->index('managed_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};

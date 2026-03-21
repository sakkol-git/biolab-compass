<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contract_id')->constrained()->restrictOnDelete();

            // Amount
            $table->decimal('amount', 15, 2);
            $table->string('currency', 3)->default('USD');

            // Classification
            $table->string('payment_type', 20);   // deposit, milestone, final, refund
            $table->string('payment_method', 50);  // Bank Transfer, Wire Transfer, Check, etc.

            // Dates
            $table->date('payment_date')->nullable(); // null = not yet paid
            $table->date('due_date');

            // Status & Reference
            $table->string('status', 20)->default('pending');
            $table->string('reference_number', 100)->nullable();

            // Notes
            $table->text('notes')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index('contract_id');
            $table->index('status');
            $table->index('due_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};

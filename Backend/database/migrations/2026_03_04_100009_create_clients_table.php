<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('client_code', 20)->unique();
            $table->string('company_name');
            $table->string('contact_name');

            // Contact
            $table->string('email')->nullable();
            $table->string('phone', 50)->nullable();
            $table->text('address')->nullable();

            // Classification
            $table->string('client_type', 50);

            // Notes
            $table->text('notes')->nullable();

            // Counter caches (kept in sync by ContractService)
            $table->unsignedInteger('total_contracts')->default(0);
            $table->decimal('total_value', 15, 2)->default(0.00);

            $table->softDeletes();
            $table->timestamps();

            $table->index('client_type');
            $table->index('company_name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};

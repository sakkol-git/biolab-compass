<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_services', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('service_code', 20)->unique();
            $table->string('service_title', 500);

            // Client (not FK — external clients)
            $table->string('client_name');
            $table->string('client_contact', 100)->nullable();

            // Details
            $table->text('service_description');
            $table->json('assigned_staff')->default('[]');

            // Dates
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();

            // Status
            $table->string('status', 20)->default('pending');

            // Results
            $table->text('result_summary')->nullable();
            $table->string('report_file_url', 2048)->nullable();

            // Financial
            $table->decimal('service_fee', 15, 2)->nullable();
            $table->string('payment_status', 20)->default('unpaid');

            // Notes
            $table->text('notes')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
            $table->index('payment_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_services');
    }
};

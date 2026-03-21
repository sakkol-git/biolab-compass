<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('protocols', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('protocol_code', 20)->unique();
            $table->string('title', 500);
            $table->text('description')->nullable();

            // Classification
            $table->string('category', 100);
            $table->string('version', 20)->default('1.0');
            $table->string('status', 20)->default('draft');

            // Authorship
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('author_name')->nullable();

            // Counter caches
            $table->unsignedInteger('steps_count')->default(0);
            $table->unsignedInteger('linked_experiments_count')->default(0);

            // Tracking
            $table->date('last_updated')->nullable();

            $table->softDeletes();
            $table->timestamps();

            $table->index('status');
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('protocols');
    }
};

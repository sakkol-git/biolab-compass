<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lab_notebooks', function (Blueprint $table) {
            $table->id();

            // Identity
            $table->string('notebook_code', 20)->unique();
            $table->string('title', 500);
            $table->text('content')->nullable();

            // Authorship
            $table->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('author_name')->nullable();

            // Linked experiment (optional)
            $table->foreignId('experiment_id')->nullable()->constrained()->nullOnDelete();

            // Lock mechanism
            $table->boolean('is_locked')->default(false);

            $table->softDeletes();
            $table->timestamps();

            $table->index('experiment_id');
            $table->index('is_locked');
            $table->index('author_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lab_notebooks');
    }
};

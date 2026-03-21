<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * WF-02: Create location_histories table for inventory tracking.
 */
return new class extends Migration {
    public function up(): void
    {
        Schema::create('location_histories', function (Blueprint $table) {
            $table->id();
            $table->morphs('trackable');
            $table->string('from_location')->nullable();
            $table->string('to_location');
            $table->foreignId('moved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('reason')->nullable();
            $table->timestamps();

            $table->index(['trackable_type', 'trackable_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('location_histories');
    }
};

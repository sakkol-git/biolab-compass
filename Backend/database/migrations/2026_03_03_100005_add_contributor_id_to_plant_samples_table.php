<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('plant_samples', function (Blueprint $table) {
            $table->foreignId('contributor_id')
                ->nullable()
                ->after('plant_variety_id')
                ->constrained('users')
                ->nullOnDelete()
                ->cascadeOnUpdate();
        });
    }

    public function down(): void
    {
        Schema::table('plant_samples', function (Blueprint $table) {
            $table->dropForeign(['contributor_id']);
            $table->dropColumn('contributor_id');
        });
    }
};

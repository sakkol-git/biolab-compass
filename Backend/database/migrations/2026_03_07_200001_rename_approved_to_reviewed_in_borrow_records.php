<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Rename approved_by/approved_at to reviewed_by/reviewed_at in borrow_records.
     *
     * These columns are used for both approval and rejection, so "reviewed"
     * is semantically correct for both actions.
     */
    public function up(): void
    {
        Schema::table('borrow_records', function (Blueprint $table) {
            $table->renameColumn('approved_by', 'reviewed_by');
            $table->renameColumn('approved_at', 'reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::table('borrow_records', function (Blueprint $table) {
            $table->renameColumn('reviewed_by', 'approved_by');
            $table->renameColumn('reviewed_at', 'approved_at');
        });
    }
};

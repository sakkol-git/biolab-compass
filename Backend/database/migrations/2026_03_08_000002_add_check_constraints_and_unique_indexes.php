<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * DI-02: Add CHECK constraints to prevent negative quantities.
 * DI-01: Add partial unique indexes on code fields (soft-delete aware).
 * DB-01: Add CHECK constraints on enum-like status columns.
 */
return new class extends Migration
{
    public function up(): void
    {
        // ─── DI-02: Quantity CHECK Constraints ─────────────────────────────────

        // Plant stocks: quantity must be non-negative, reserved <= quantity
        DB::statement('ALTER TABLE plant_stocks ADD CONSTRAINT chk_stock_qty_non_negative CHECK (quantity >= 0)');
        DB::statement('ALTER TABLE plant_stocks ADD CONSTRAINT chk_stock_reserved_non_negative CHECK (reserved_quantity >= 0)');
        DB::statement('ALTER TABLE plant_stocks ADD CONSTRAINT chk_stock_reserved_lte_quantity CHECK (reserved_quantity <= quantity)');

        // Chemicals: quantity must be non-negative
        DB::statement('ALTER TABLE chemicals ADD CONSTRAINT chk_chemical_qty_non_negative CHECK (quantity >= 0)');

        // ─── DI-01: Partial Unique Indexes on Code Fields ──────────────────────

        // These unique indexes only apply to non-soft-deleted rows
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS idx_variety_code_unique ON plant_varieties (variety_code) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS idx_sample_code_unique ON plant_samples (sample_code) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS idx_chemical_code_unique ON chemicals (chemical_code) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS idx_equipment_code_unique ON equipment (equipment_code) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS idx_service_code_unique ON lab_services (service_code) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS idx_client_code_unique ON clients (client_code) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS idx_protocol_code_unique ON protocols (protocol_code) WHERE deleted_at IS NULL');
        DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS idx_notebook_code_unique ON lab_notebooks (notebook_code) WHERE deleted_at IS NULL');

        // ─── DB-01: CHECK Constraints on Status Columns ────────────────────────

        DB::statement("ALTER TABLE experiments ADD CONSTRAINT chk_experiment_status CHECK (status IN ('planning', 'active', 'paused', 'completed', 'failed'))");
        DB::statement("ALTER TABLE contracts ADD CONSTRAINT chk_contract_status CHECK (status IN ('draft', 'sent', 'signed', 'in_production', 'ready', 'delivered', 'cancelled'))");
        DB::statement("ALTER TABLE protocols ADD CONSTRAINT chk_protocol_status CHECK (status IN ('draft', 'active', 'archived'))");
        DB::statement("ALTER TABLE borrow_records ADD CONSTRAINT chk_borrow_status CHECK (status IN ('pending', 'borrowed', 'returned', 'overdue', 'rejected'))");
        DB::statement("ALTER TABLE plant_stocks ADD CONSTRAINT chk_stock_status CHECK (status IN ('available', 'reserved', 'out_of_stock'))");
        DB::statement("ALTER TABLE plant_samples ADD CONSTRAINT chk_sample_status CHECK (status IN ('active', 'inactive', 'archived'))");
        DB::statement("ALTER TABLE payments ADD CONSTRAINT chk_payment_status CHECK (status IN ('pending', 'received', 'overdue', 'cancelled'))");
        DB::statement("ALTER TABLE lab_services ADD CONSTRAINT chk_lab_service_status CHECK (status IN ('pending', 'in_progress', 'completed', 'delivered'))");
        DB::statement("ALTER TABLE lab_services ADD CONSTRAINT chk_lab_service_payment_status CHECK (payment_status IN ('unpaid', 'partial', 'paid'))");
        DB::statement("ALTER TABLE contract_milestones ADD CONSTRAINT chk_milestone_status CHECK (status IN ('pending', 'on_track', 'at_risk', 'completed', 'missed'))");
        DB::statement("ALTER TABLE equipment ADD CONSTRAINT chk_equipment_status CHECK (status IN ('available', 'borrowed', 'in_use', 'under_maintenance'))");
        DB::statement("ALTER TABLE equipment ADD CONSTRAINT chk_equipment_condition CHECK (\"condition\" IN ('good', 'normal', 'broken'))");
    }

    public function down(): void
    {
        // Drop CHECK constraints
        DB::statement('ALTER TABLE plant_stocks DROP CONSTRAINT IF EXISTS chk_stock_qty_non_negative');
        DB::statement('ALTER TABLE plant_stocks DROP CONSTRAINT IF EXISTS chk_stock_reserved_non_negative');
        DB::statement('ALTER TABLE plant_stocks DROP CONSTRAINT IF EXISTS chk_stock_reserved_lte_quantity');
        DB::statement('ALTER TABLE chemicals DROP CONSTRAINT IF EXISTS chk_chemical_qty_non_negative');

        // Drop unique indexes
        DB::statement('DROP INDEX IF EXISTS idx_variety_code_unique');
        DB::statement('DROP INDEX IF EXISTS idx_sample_code_unique');
        DB::statement('DROP INDEX IF EXISTS idx_chemical_code_unique');
        DB::statement('DROP INDEX IF EXISTS idx_equipment_code_unique');
        DB::statement('DROP INDEX IF EXISTS idx_service_code_unique');
        DB::statement('DROP INDEX IF EXISTS idx_client_code_unique');
        DB::statement('DROP INDEX IF EXISTS idx_protocol_code_unique');
        DB::statement('DROP INDEX IF EXISTS idx_notebook_code_unique');

        // Drop status CHECK constraints
        DB::statement('ALTER TABLE experiments DROP CONSTRAINT IF EXISTS chk_experiment_status');
        DB::statement('ALTER TABLE contracts DROP CONSTRAINT IF EXISTS chk_contract_status');
        DB::statement('ALTER TABLE protocols DROP CONSTRAINT IF EXISTS chk_protocol_status');
        DB::statement('ALTER TABLE borrow_records DROP CONSTRAINT IF EXISTS chk_borrow_status');
        DB::statement('ALTER TABLE plant_stocks DROP CONSTRAINT IF EXISTS chk_stock_status');
        DB::statement('ALTER TABLE plant_samples DROP CONSTRAINT IF EXISTS chk_sample_status');
        DB::statement('ALTER TABLE payments DROP CONSTRAINT IF EXISTS chk_payment_status');
        DB::statement('ALTER TABLE lab_services DROP CONSTRAINT IF EXISTS chk_lab_service_status');
        DB::statement('ALTER TABLE lab_services DROP CONSTRAINT IF EXISTS chk_lab_service_payment_status');
        DB::statement('ALTER TABLE contract_milestones DROP CONSTRAINT IF EXISTS chk_milestone_status');
        DB::statement('ALTER TABLE equipment DROP CONSTRAINT IF EXISTS chk_equipment_status');
        DB::statement('ALTER TABLE equipment DROP CONSTRAINT IF EXISTS chk_equipment_condition');
    }
};

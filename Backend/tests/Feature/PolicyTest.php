<?php

declare(strict_types=1);

use App\Models\Achievement;
use App\Models\BorrowRecord;
use App\Models\Chemical;
use App\Models\ChemicalBatch;
use App\Models\ChemicalUsageLog;
use App\Models\Equipment;
use App\Models\MaintenanceRecord;
use App\Models\PlantSample;
use App\Models\PlantSpecies;
use App\Models\PlantVariety;
use App\Models\Transaction;
use App\Models\User;
use App\Models\UserDocument;
use Database\Seeders\RolePermissionSeeder;
use Spatie\Permission\Models\Role;

/* ═══════════════════════════════════════════════════════════════════════════
 * Policy Authorization Tests — Verifies RBAC across admin, lab-manager,
 * and student roles for all major policies.
 *
 * Addresses: P4.3 (14 policies × key methods)
 * ═══════════════════════════════════════════════════════════════════════════ */

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole(Role::findByName('admin', 'api'));

    $this->manager = User::factory()->create();
    $this->manager->assignRole(Role::findByName('lab-manager', 'api'));

    $this->student = User::factory()->create();
    $this->student->assignRole(Role::findByName('student', 'api'));
});

// ═══════════════════════════════════════════════════════════════════════════
// CHEMICAL POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('admin can CRUD chemicals', function (): void {
    $this->actingAs($this->admin, 'api');
    $chemical = Chemical::factory()->create();

    expect($this->admin->can('viewAny', Chemical::class))->toBeTrue()
        ->and($this->admin->can('view', $chemical))->toBeTrue()
        ->and($this->admin->can('create', Chemical::class))->toBeTrue()
        ->and($this->admin->can('update', $chemical))->toBeTrue()
        ->and($this->admin->can('delete', $chemical))->toBeTrue();
});

it('student can only view chemicals', function (): void {
    $this->actingAs($this->student, 'api');
    $chemical = Chemical::factory()->create();

    expect($this->student->can('viewAny', Chemical::class))->toBeTrue()
        ->and($this->student->can('view', $chemical))->toBeTrue()
        ->and($this->student->can('create', Chemical::class))->toBeFalse()
        ->and($this->student->can('update', $chemical))->toBeFalse()
        ->and($this->student->can('delete', $chemical))->toBeFalse();
});

// ═══════════════════════════════════════════════════════════════════════════
// EQUIPMENT POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('lab-manager can CRUD equipment', function (): void {
    $this->actingAs($this->manager, 'api');
    $equipment = Equipment::factory()->create();

    expect($this->manager->can('viewAny', Equipment::class))->toBeTrue()
        ->and($this->manager->can('create', Equipment::class))->toBeTrue()
        ->and($this->manager->can('update', $equipment))->toBeTrue()
        ->and($this->manager->can('delete', $equipment))->toBeTrue();
});

it('student cannot create or delete equipment', function (): void {
    $this->actingAs($this->student, 'api');
    $equipment = Equipment::factory()->create();

    expect($this->student->can('viewAny', Equipment::class))->toBeTrue()
        ->and($this->student->can('create', Equipment::class))->toBeFalse()
        ->and($this->student->can('delete', $equipment))->toBeFalse();
});

// ═══════════════════════════════════════════════════════════════════════════
// PLANT SPECIES POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('admin can delete plant species', function (): void {
    $this->actingAs($this->admin, 'api');
    $species = PlantSpecies::factory()->create();

    expect($this->admin->can('delete', $species))->toBeTrue();
});

it('student can view and create but not delete plant species', function (): void {
    $this->actingAs($this->student, 'api');
    $species = PlantSpecies::factory()->create();

    expect($this->student->can('viewAny', PlantSpecies::class))->toBeTrue()
        ->and($this->student->can('create', PlantSpecies::class))->toBeTrue()
        ->and($this->student->can('update', $species))->toBeTrue()
        ->and($this->student->can('delete', $species))->toBeFalse();
});

// ═══════════════════════════════════════════════════════════════════════════
// BORROW RECORD POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('admin can approve borrows', function (): void {
    $this->actingAs($this->admin, 'api');
    $record = BorrowRecord::factory()->create();

    expect($this->admin->can('approve', $record))->toBeTrue();
});

it('lab-manager can approve borrows', function (): void {
    $this->actingAs($this->manager, 'api');
    $record = BorrowRecord::factory()->create();

    expect($this->manager->can('approve', $record))->toBeTrue();
});

it('student cannot approve borrows', function (): void {
    $this->actingAs($this->student, 'api');
    $record = BorrowRecord::factory()->create();

    expect($this->student->can('approve', $record))->toBeFalse();
});

it('student can view their own borrow record', function (): void {
    $this->actingAs($this->student, 'api');
    $record = BorrowRecord::factory()->create(['user_id' => $this->student->id]);

    expect($this->student->can('view', $record))->toBeTrue();
});

it('student cannot return borrows without permission', function (): void {
    $this->actingAs($this->student, 'api');
    $record = BorrowRecord::factory()->create();

    expect($this->student->can('return', $record))->toBeFalse();
});

// ═══════════════════════════════════════════════════════════════════════════
// CHEMICAL BATCH POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('admin can manage chemical batches', function (): void {
    $this->actingAs($this->admin, 'api');
    $batch = ChemicalBatch::factory()->create();

    expect($this->admin->can('viewAny', ChemicalBatch::class))->toBeTrue()
        ->and($this->admin->can('create', ChemicalBatch::class))->toBeTrue()
        ->and($this->admin->can('update', $batch))->toBeTrue()
        ->and($this->admin->can('delete', $batch))->toBeTrue();
});

it('student can only view chemical batches', function (): void {
    $this->actingAs($this->student, 'api');
    $batch = ChemicalBatch::factory()->create();

    expect($this->student->can('viewAny', ChemicalBatch::class))->toBeTrue()
        ->and($this->student->can('create', ChemicalBatch::class))->toBeFalse()
        ->and($this->student->can('delete', $batch))->toBeFalse();
});

// ═══════════════════════════════════════════════════════════════════════════
// CHEMICAL USAGE LOG POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('student can create chemical usage logs', function (): void {
    $this->actingAs($this->student, 'api');

    expect($this->student->can('viewAny', ChemicalUsageLog::class))->toBeTrue()
        ->and($this->student->can('create', ChemicalUsageLog::class))->toBeTrue();
});

// ═══════════════════════════════════════════════════════════════════════════
// USER POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('admin can manage users', function (): void {
    $this->actingAs($this->admin, 'api');
    $user = User::factory()->create();

    expect($this->admin->can('viewAny', User::class))->toBeTrue()
        ->and($this->admin->can('create', User::class))->toBeTrue()
        ->and($this->admin->can('update', $user))->toBeTrue()
        ->and($this->admin->can('delete', $user))->toBeTrue();
});

it('student cannot manage users', function (): void {
    $this->actingAs($this->student, 'api');
    $user = User::factory()->create();

    expect($this->student->can('viewAny', User::class))->toBeFalse()
        ->and($this->student->can('create', User::class))->toBeFalse()
        ->and($this->student->can('delete', $user))->toBeFalse();
});

it('lab-manager can view but not create or delete users', function (): void {
    $this->actingAs($this->manager, 'api');
    $user = User::factory()->create();

    expect($this->manager->can('viewAny', User::class))->toBeTrue()
        ->and($this->manager->can('create', User::class))->toBeFalse()
        ->and($this->manager->can('delete', $user))->toBeFalse();
});

// ═══════════════════════════════════════════════════════════════════════════
// MAINTENANCE RECORD POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('lab-manager can CRUD maintenance records', function (): void {
    $this->actingAs($this->manager, 'api');
    $record = MaintenanceRecord::factory()->create();

    expect($this->manager->can('viewAny', MaintenanceRecord::class))->toBeTrue()
        ->and($this->manager->can('create', MaintenanceRecord::class))->toBeTrue()
        ->and($this->manager->can('update', $record))->toBeTrue()
        ->and($this->manager->can('delete', $record))->toBeTrue();
});

it('student can only view maintenance records', function (): void {
    $this->actingAs($this->student, 'api');
    $record = MaintenanceRecord::factory()->create();

    expect($this->student->can('viewAny', MaintenanceRecord::class))->toBeTrue()
        ->and($this->student->can('create', MaintenanceRecord::class))->toBeFalse()
        ->and($this->student->can('delete', $record))->toBeFalse();
});

// ═══════════════════════════════════════════════════════════════════════════
// ACHIEVEMENT POLICY
// ═══════════════════════════════════════════════════════════════════════════

it('admin can CRUD achievements', function (): void {
    $this->actingAs($this->admin, 'api');
    $ach = Achievement::factory()->create();

    expect($this->admin->can('viewAny', Achievement::class))->toBeTrue()
        ->and($this->admin->can('create', Achievement::class))->toBeTrue()
        ->and($this->admin->can('update', $ach))->toBeTrue()
        ->and($this->admin->can('delete', $ach))->toBeTrue();
});

it('student can only view achievements', function (): void {
    $this->actingAs($this->student, 'api');
    $ach = Achievement::factory()->create();

    expect($this->student->can('viewAny', Achievement::class))->toBeTrue()
        ->and($this->student->can('create', Achievement::class))->toBeFalse()
        ->and($this->student->can('delete', $ach))->toBeFalse();
});

// ═══════════════════════════════════════════════════════════════════════════
// TRANSACTION POLICY  (view-only)
// ═══════════════════════════════════════════════════════════════════════════

it('all roles can view transactions', function (): void {
    $tx = Transaction::factory()->create();

    $this->actingAs($this->admin, 'api');
    expect($this->admin->can('viewAny', Transaction::class))->toBeTrue();

    $this->actingAs($this->manager, 'api');
    expect($this->manager->can('view', $tx))->toBeTrue();

    $this->actingAs($this->student, 'api');
    expect($this->student->can('viewAny', Transaction::class))->toBeTrue();
});

// ═══════════════════════════════════════════════════════════════════════════
// USER DOCUMENT POLICY  (owner bypass)
// ═══════════════════════════════════════════════════════════════════════════

it('student can view their own documents', function (): void {
    $this->actingAs($this->student, 'api');
    $doc = UserDocument::factory()->create(['user_id' => $this->student->id]);

    expect($this->student->can('view', $doc))->toBeTrue()
        ->and($this->student->can('delete', $doc))->toBeTrue();
});

it('student can create user documents', function (): void {
    $this->actingAs($this->student, 'api');

    expect($this->student->can('create', UserDocument::class))->toBeTrue();
});

// ═══════════════════════════════════════════════════════════════════════════
// PLANT VARIETY & SAMPLE POLICIES  (share plants.* namespace)
// ═══════════════════════════════════════════════════════════════════════════

it('student can create plant varieties but not delete them', function (): void {
    $this->actingAs($this->student, 'api');
    $variety = PlantVariety::factory()->create();

    expect($this->student->can('viewAny', PlantVariety::class))->toBeTrue()
        ->and($this->student->can('create', PlantVariety::class))->toBeTrue()
        ->and($this->student->can('update', $variety))->toBeTrue()
        ->and($this->student->can('delete', $variety))->toBeFalse();
});

it('student can view plant samples but not delete them', function (): void {
    $this->actingAs($this->student, 'api');
    $sample = PlantSample::factory()->create();

    expect($this->student->can('viewAny', PlantSample::class))->toBeTrue()
        ->and($this->student->can('create', PlantSample::class))->toBeTrue()
        ->and($this->student->can('delete', $sample))->toBeFalse();
});

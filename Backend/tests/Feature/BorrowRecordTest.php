<?php

declare(strict_types=1);

use App\Enums\BorrowStatus;
use App\Enums\EquipmentStatus;
use App\Models\BorrowRecord;
use App\Models\Chemical;
use App\Models\Equipment;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole(\Spatie\Permission\Models\Role::findByName('admin', 'api'));

    $this->actingAs($this->admin, 'api');
});

// ─── STORE (Borrow) ──────────────────────────────────────────────────────────

it('borrows available equipment and returns 201', function (): void {
    $user = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => EquipmentStatus::AVAILABLE->value, 'condition' => 'good']);

    $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'equipment',
        'borrowable_id' => $equipment->id,
        'quantity' => 1,
        'due_at' => now()->addDays(7)->toIso8601String(),
    ])->assertCreated()
        ->assertJsonPath('data.status', 'borrowed')
        ->assertJsonPath('data.item.type', 'equipment')
        ->assertJsonPath('data.item.id', $equipment->id);

    // Equipment status should change to borrowed
    expect($equipment->refresh()->status)->toBe(EquipmentStatus::BORROWED);
});

it('borrows chemical and decrements stock', function (): void {
    $user = User::factory()->create();
    $chemical = Chemical::factory()->create(['quantity' => 100]);

    $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'chemical',
        'borrowable_id' => $chemical->id,
        'quantity' => 25,
    ])->assertCreated()
        ->assertJsonPath('data.quantity', 25);

    expect($chemical->refresh()->quantity)->toBe(75);
});

it('rejects borrowing unavailable equipment', function (): void {
    $user = User::factory()->create();
    $equipment = Equipment::factory()->borrowed()->create();

    $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'equipment',
        'borrowable_id' => $equipment->id,
        'quantity' => 1,
    ])->assertStatus(400) // ItemNotBorrowableException
        ->assertJsonPath('error', 'item_not_borrowable');
});

it('rejects borrowing more chemical than available', function (): void {
    $user = User::factory()->create();
    $chemical = Chemical::factory()->create(['quantity' => 5]);

    $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'chemical',
        'borrowable_id' => $chemical->id,
        'quantity' => 50,
    ])->assertStatus(422) // InsufficientStockException
        ->assertJsonPath('error', 'insufficient_stock');
});

it('rejects unknown borrowable_type', function (): void {
    $user = User::factory()->create();

    $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'spaceship',
        'borrowable_id' => 1,
        'quantity' => 1,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('borrowable_type');
});

// ─── RETURN ──────────────────────────────────────────────────────────────────

it('returns a borrowed equipment item', function (): void {
    $user = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => EquipmentStatus::AVAILABLE->value, 'condition' => 'good']);

    // Borrow first
    $response = $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'equipment',
        'borrowable_id' => $equipment->id,
        'quantity' => 1,
    ])->assertCreated();

    $recordId = $response->json('data.id');

    // Return it
    $this->postJson("/api/borrow-records/{$recordId}/return", [
        'notes' => 'Returned in good condition',
    ])->assertOk()
        ->assertJsonPath('data.status', 'returned')
        ->assertJsonPath('data.notes', 'Returned in good condition');

    // Equipment status should be available again
    expect($equipment->refresh()->status)->toBe(EquipmentStatus::AVAILABLE);
});

it('returns a borrowed chemical and restores stock', function (): void {
    $user = User::factory()->create();
    $chemical = Chemical::factory()->create(['quantity' => 100]);

    // Borrow 30
    $response = $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'chemical',
        'borrowable_id' => $chemical->id,
        'quantity' => 30,
    ])->assertCreated();

    $recordId = $response->json('data.id');
    expect($chemical->refresh()->quantity)->toBe(70);

    // Return
    $this->postJson("/api/borrow-records/{$recordId}/return")
        ->assertOk()
        ->assertJsonPath('data.status', 'returned');

    expect($chemical->refresh()->quantity)->toBe(100);
});

it('is idempotent when returning an already returned record', function (): void {
    $user = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => EquipmentStatus::AVAILABLE->value, 'condition' => 'good']);

    $response = $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'equipment',
        'borrowable_id' => $equipment->id,
        'quantity' => 1,
    ])->assertCreated();

    $recordId = $response->json('data.id');

    // Return twice — second should be a no-op
    $this->postJson("/api/borrow-records/{$recordId}/return")->assertOk();
    $this->postJson("/api/borrow-records/{$recordId}/return")->assertOk();

    expect(BorrowRecord::find($recordId)->status)->toBe(BorrowStatus::RETURNED);
});

// ─── INDEX ────────────────────────────────────────────────────────────────────

it('returns paginated list of borrow records', function (): void {
    BorrowRecord::factory()->count(5)->create();

    $this->getJson('/api/borrow-records')
        ->assertOk()
        ->assertJsonStructure(['data', 'meta', 'links']);
});

it('filters borrow records by status', function (): void {
    BorrowRecord::factory()->count(2)->create(['status' => BorrowStatus::BORROWED->value]);
    BorrowRecord::factory()->returned()->create();

    $this->getJson('/api/borrow-records?status=borrowed')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

// ─── SHOW ────────────────────────────────────────────────────────────────────

it('returns a single borrow record with embedded relations', function (): void {
    $record = BorrowRecord::factory()->create();

    $this->getJson("/api/borrow-records/{$record->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $record->id)
        ->assertJsonStructure(['data' => ['user', 'item']]);
});

// ─── OVERDUE ─────────────────────────────────────────────────────────────────

it('returns overdue borrow records', function (): void {
    BorrowRecord::factory()->overdue()->count(2)->create();
    BorrowRecord::factory()->create(); // not overdue

    $this->getJson('/api/borrow-records/overdue')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

// ─── TRANSACTION LOGGING ─────────────────────────────────────────────────────

it('creates a transaction log when borrowing', function (): void {
    $user = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => EquipmentStatus::AVAILABLE->value, 'condition' => 'good']);

    $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'equipment',
        'borrowable_id' => $equipment->id,
        'quantity' => 1,
    ])->assertCreated();

    $this->assertDatabaseHas('transactions', [
        'user_id' => $user->id,
        'transactionable_type' => 'equipment',
        'transactionable_id' => $equipment->id,
        'action' => 'borrowed',
    ]);
});

it('creates a transaction log when returning', function (): void {
    $user = User::factory()->create();
    $equipment = Equipment::factory()->create(['status' => EquipmentStatus::AVAILABLE->value, 'condition' => 'good']);

    $response = $this->postJson('/api/borrow-records', [
        'user_id' => $user->id,
        'borrowable_type' => 'equipment',
        'borrowable_id' => $equipment->id,
        'quantity' => 1,
    ])->assertCreated();

    $this->postJson("/api/borrow-records/{$response->json('data.id')}/return")
        ->assertOk();

    $this->assertDatabaseHas('transactions', [
        'user_id' => $user->id,
        'transactionable_type' => 'equipment',
        'transactionable_id' => $equipment->id,
        'action' => 'returned',
    ]);
});

// ─── APPROVE ─────────────────────────────────────────────────────────────────

it('approves a pending borrow request', function (): void {
    $user = User::factory()->create();
    $equipment = Equipment::factory()->create([
        'status' => EquipmentStatus::AVAILABLE->value,
        'condition' => 'good',
    ]);

    $record = BorrowRecord::factory()->pending()->create([
        'user_id' => $user->id,
        'borrowable_type' => 'equipment',
        'borrowable_id' => $equipment->id,
        'quantity' => 1,
    ]);

    $this->postJson("/api/borrow-records/{$record->id}/approve", [
        'notes' => 'Approved for lab work',
    ])->assertOk()
        ->assertJsonPath('data.status', 'borrowed');

    expect($equipment->refresh()->status)->toBe(EquipmentStatus::BORROWED);
});

it('rejects approving a non-pending record', function (): void {
    $record = BorrowRecord::factory()->create([
        'status' => BorrowStatus::BORROWED->value,
    ]);

    $this->postJson("/api/borrow-records/{$record->id}/approve")
        ->assertStatus(422);
});

// ─── REJECT ──────────────────────────────────────────────────────────────────

it('rejects a pending borrow request with a reason', function (): void {
    $user = User::factory()->create();
    $equipment = Equipment::factory()->create([
        'status' => EquipmentStatus::AVAILABLE->value,
        'condition' => 'good',
    ]);

    $record = BorrowRecord::factory()->pending()->create([
        'user_id' => $user->id,
        'borrowable_type' => 'equipment',
        'borrowable_id' => $equipment->id,
    ]);

    $this->postJson("/api/borrow-records/{$record->id}/reject", [
        'rejected_reason' => 'Equipment reserved for another project',
    ])->assertOk()
        ->assertJsonPath('data.status', 'rejected');

    // Stock should remain unchanged
    expect($equipment->refresh()->status)->toBe(EquipmentStatus::AVAILABLE);
});

it('requires a reason when rejecting', function (): void {
    $record = BorrowRecord::factory()->pending()->create();

    $this->postJson("/api/borrow-records/{$record->id}/reject", [])
        ->assertUnprocessable()
        ->assertJsonValidationErrors('rejected_reason');
});

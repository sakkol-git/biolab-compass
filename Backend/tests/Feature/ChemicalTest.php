<?php

declare(strict_types=1);

use App\Enums\ChemicalCategory;
use App\Models\Chemical;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);

    $admin = User::factory()->create();
    $admin->assignRole(\Spatie\Permission\Models\Role::findByName('admin', 'api'));

    $this->actingAs($admin, 'api');
});

// ─── INDEX ────────────────────────────────────────────────────────────────────

it('returns paginated list of chemicals', function (): void {
    Chemical::factory()->count(5)->create();

    $this->getJson('/api/chemicals')
        ->assertOk()
        ->assertJsonStructure(['data', 'meta', 'links']);
});

it('filters chemicals by search term', function (): void {
    Chemical::factory()->create(['common_name' => 'Hydrochloric Acid']);
    Chemical::factory()->create(['common_name' => 'Sodium Chloride']);

    $this->getJson('/api/chemicals?search=Hydrochloric')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('filters chemicals by category', function (): void {
    Chemical::factory()->count(3)->create(['category' => ChemicalCategory::ACID->value]);
    Chemical::factory()->create(['category' => ChemicalCategory::SOLVENT->value]);

    $this->getJson('/api/chemicals?category=acid')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

it('filters available chemicals only', function (): void {
    Chemical::factory()->count(2)->create(['quantity' => 50]);
    Chemical::factory()->outOfStock()->create();

    $this->getJson('/api/chemicals?available_only=1')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('filters expired chemicals only', function (): void {
    Chemical::factory()->expired()->create();
    Chemical::factory()->create(['expiry_date' => now()->addYear()]);

    $this->getJson('/api/chemicals?expired_only=1')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

// ─── STORE ────────────────────────────────────────────────────────────────────

it('creates a chemical and returns 201', function (): void {
    $this->postJson('/api/chemicals', [
        'common_name' => 'Ethanol',
        'chemical_code' => 'CHM-ETH-01',
        'category' => 'solvent',
        'quantity' => 500,
        'danger_level' => 'medium',
    ])->assertCreated()
        ->assertJsonPath('data.common_name', 'Ethanol')
        ->assertJsonPath('data.category', 'solvent')
        ->assertJsonPath('data.danger_level', 'medium');

    $this->assertDatabaseHas('chemicals', ['chemical_code' => 'CHM-ETH-01']);
});

it('rejects invalid category on store', function (): void {
    $this->postJson('/api/chemicals', [
        'common_name' => 'Test',
        'category' => 'invalid_cat',
        'quantity' => 10,
        'danger_level' => 'low',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('category');
});

it('rejects negative quantity on store', function (): void {
    $this->postJson('/api/chemicals', [
        'common_name' => 'Test',
        'category' => 'acid',
        'quantity' => -5,
        'danger_level' => 'low',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('quantity');
});

// ─── SHOW ────────────────────────────────────────────────────────────────────

it('returns a single chemical', function (): void {
    $chemical = Chemical::factory()->create();

    $this->getJson("/api/chemicals/{$chemical->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $chemical->id);
});

it('returns 404 for non-existent chemical', function (): void {
    $this->getJson('/api/chemicals/999999')->assertNotFound();
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

it('updates a chemical', function (): void {
    $chemical = Chemical::factory()->create(['common_name' => 'Old Name']);

    $this->putJson("/api/chemicals/{$chemical->id}", ['common_name' => 'New Name'])
        ->assertOk()
        ->assertJsonPath('data.common_name', 'New Name');
});

// ─── DESTROY ─────────────────────────────────────────────────────────────────

it('soft-deletes a chemical', function (): void {
    $chemical = Chemical::factory()->create();

    $this->deleteJson("/api/chemicals/{$chemical->id}")
        ->assertOk()
        ->assertJsonPath('message', 'Chemical deleted successfully.');

    $this->assertSoftDeleted('chemicals', ['id' => $chemical->id]);
});

it('excludes soft-deleted chemicals from index', function (): void {
    Chemical::factory()->count(2)->create();
    Chemical::factory()->create()->delete();

    $this->getJson('/api/chemicals')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

// ─── COMPUTED ────────────────────────────────────────────────────────────────

it('correctly computes is_expired for expired chemical', function (): void {
    $chemical = Chemical::factory()->expired()->create();

    $this->getJson("/api/chemicals/{$chemical->id}")
        ->assertOk()
        ->assertJsonPath('data.is_expired', true);
});

it('correctly computes is_expired for non-expired chemical', function (): void {
    $chemical = Chemical::factory()->create(['expiry_date' => now()->addYear()]);

    $this->getJson("/api/chemicals/{$chemical->id}")
        ->assertOk()
        ->assertJsonPath('data.is_expired', false);
});

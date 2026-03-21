<?php

declare(strict_types=1);

use App\Enums\EquipmentCategory;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentStatus;
use App\Models\Equipment;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);

    $admin = User::factory()->create();
    $admin->assignRole(\Spatie\Permission\Models\Role::findByName('admin', 'api'));

    $this->actingAs($admin, 'api');
});

// ─── INDEX ────────────────────────────────────────────────────────────────────

it('returns paginated list of equipment', function (): void {
    Equipment::factory()->count(5)->create();

    $this->getJson('/api/equipment')
        ->assertOk()
        ->assertJsonStructure(['data', 'meta', 'links']);
});

it('filters equipment by search term', function (): void {
    Equipment::factory()->create(['equipment_name' => 'Zeiss Microscope']);
    Equipment::factory()->create(['equipment_name' => 'Eppendorf Centrifuge']);

    $this->getJson('/api/equipment?search=Zeiss')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('filters equipment by category', function (): void {
    Equipment::factory()->count(2)->create(['category' => EquipmentCategory::MICROSCOPE->value]);
    Equipment::factory()->create(['category' => EquipmentCategory::CENTRIFUGE->value]);

    $this->getJson('/api/equipment?category=microscope')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

it('filters available equipment only', function (): void {
    Equipment::factory()->count(2)->create(['status' => EquipmentStatus::AVAILABLE->value, 'condition' => EquipmentCondition::GOOD->value]);
    Equipment::factory()->borrowed()->create();

    $this->getJson('/api/equipment?available_only=1')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

// ─── STORE ────────────────────────────────────────────────────────────────────

it('creates equipment and returns 201', function (): void {
    $this->postJson('/api/equipment', [
        'equipment_name' => 'Test Microscope',
        'equipment_code' => 'EQP-MICRO-01',
        'category' => 'microscope',
        'status' => 'available',
        'condition' => 'good',
    ])->assertCreated()
        ->assertJsonPath('data.equipment_name', 'Test Microscope')
        ->assertJsonPath('data.is_borrowable', true);

    $this->assertDatabaseHas('equipment', ['equipment_code' => 'EQP-MICRO-01']);
});

it('rejects invalid status on store', function (): void {
    $this->postJson('/api/equipment', [
        'equipment_name' => 'Test',
        'category' => 'microscope',
        'status' => 'flying',
        'condition' => 'good',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('status');
});

// ─── SHOW ────────────────────────────────────────────────────────────────────

it('returns a single equipment', function (): void {
    $equipment = Equipment::factory()->create();

    $this->getJson("/api/equipment/{$equipment->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $equipment->id);
});

it('returns 404 for non-existent equipment', function (): void {
    $this->getJson('/api/equipment/999999')->assertNotFound();
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

it('updates equipment', function (): void {
    $equipment = Equipment::factory()->create(['equipment_name' => 'Old Microscope']);

    $this->putJson("/api/equipment/{$equipment->id}", ['equipment_name' => 'Updated Microscope'])
        ->assertOk()
        ->assertJsonPath('data.equipment_name', 'Updated Microscope');
});

// ─── DESTROY ─────────────────────────────────────────────────────────────────

it('soft-deletes equipment', function (): void {
    $equipment = Equipment::factory()->create();

    $this->deleteJson("/api/equipment/{$equipment->id}")
        ->assertOk()
        ->assertJsonPath('message', 'Equipment deleted successfully.');

    $this->assertSoftDeleted('equipment', ['id' => $equipment->id]);
});

// ─── COMPUTED ────────────────────────────────────────────────────────────────

it('marks broken equipment as not borrowable', function (): void {
    $equipment = Equipment::factory()->broken()->create(['status' => EquipmentStatus::AVAILABLE->value]);

    $this->getJson("/api/equipment/{$equipment->id}")
        ->assertOk()
        ->assertJsonPath('data.is_borrowable', false);
});

it('marks borrowed equipment as not borrowable', function (): void {
    $equipment = Equipment::factory()->borrowed()->create();

    $this->getJson("/api/equipment/{$equipment->id}")
        ->assertOk()
        ->assertJsonPath('data.is_borrowable', false);
});

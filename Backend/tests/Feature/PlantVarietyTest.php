<?php

declare(strict_types=1);

use App\Models\PlantSpecies;
use App\Models\PlantVariety;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);

    $admin = User::factory()->create();
    $admin->assignRole(\Spatie\Permission\Models\Role::findByName('admin', 'api'));

    $this->actingAs($admin, 'api');
});

// ─── INDEX ────────────────────────────────────────────────────────────────────

it('returns paginated list of varieties with embedded species', function (): void {
    PlantVariety::factory()->count(5)->create();

    $this->getJson('/api/plant-varieties')
        ->assertOk()
        ->assertJsonStructure(['data' => [['id', 'name', 'variety_code', 'plant_species']]]);
});

it('filters varieties by search term', function (): void {
    PlantVariety::factory()->create(['name' => 'Roma Tomato', 'variety_code' => 'VAR-0001']);
    PlantVariety::factory()->create(['name' => 'Cherry', 'variety_code' => 'VAR-0002']);

    $this->getJson('/api/plant-varieties?search=Roma')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('filters varieties by species_id', function (): void {
    $species = PlantSpecies::factory()->create();
    PlantVariety::factory()->count(3)->create(['plant_species_id' => $species->id]);
    PlantVariety::factory()->create(); // different species

    $this->getJson("/api/plant-varieties?species_id={$species->id}")
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

// ─── STORE ────────────────────────────────────────────────────────────────────

it('creates a plant variety and returns 201', function (): void {
    $species = PlantSpecies::factory()->create();

    $this->postJson('/api/plant-varieties', [
        'plant_species_id' => $species->id,
        'name' => 'Roma Tomato',
        'variety_code' => 'VAR-ROMA-01',
    ])->assertCreated()
        ->assertJsonPath('data.name', 'Roma Tomato')
        ->assertJsonPath('data.plant_species_id', $species->id)
        ->assertJsonStructure(['data' => ['plant_species']]);

    $this->assertDatabaseHas('plant_varieties', ['variety_code' => 'VAR-ROMA-01']);
});

it('rejects duplicate variety_code on store', function (): void {
    $species = PlantSpecies::factory()->create();
    PlantVariety::factory()->create(['variety_code' => 'VAR-DUP']);

    $this->postJson('/api/plant-varieties', [
        'plant_species_id' => $species->id,
        'name' => 'Other',
        'variety_code' => 'VAR-DUP',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('variety_code');
});

it('allows reuse of variety_code from a soft-deleted variety', function (): void {
    $species = PlantSpecies::factory()->create();
    $deleted = PlantVariety::factory()->create(['variety_code' => 'VAR-REUSE']);
    $deleted->delete();

    $this->postJson('/api/plant-varieties', [
        'plant_species_id' => $species->id,
        'name' => 'Reused Code',
        'variety_code' => 'VAR-REUSE',
    ])->assertCreated();
});

it('rejects non-existent species on store', function (): void {
    $this->postJson('/api/plant-varieties', [
        'plant_species_id' => 999999,
        'name' => 'Ghost',
        'variety_code' => 'VAR-GHOST',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('plant_species_id');
});

// ─── SHOW ────────────────────────────────────────────────────────────────────

it('returns a single variety with embedded species', function (): void {
    $variety = PlantVariety::factory()->create();

    $this->getJson("/api/plant-varieties/{$variety->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $variety->id)
        ->assertJsonStructure(['data' => ['plant_species']]);
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

it('updates a plant variety', function (): void {
    $variety = PlantVariety::factory()->create(['name' => 'Old Variety']);

    $this->putJson("/api/plant-varieties/{$variety->id}", ['name' => 'Updated Variety'])
        ->assertOk()
        ->assertJsonPath('data.name', 'Updated Variety');
});

it('ignores own variety_code when updating', function (): void {
    $variety = PlantVariety::factory()->create(['variety_code' => 'VAR-SELF']);

    $this->putJson("/api/plant-varieties/{$variety->id}", [
        'variety_code' => 'VAR-SELF',
    ])->assertOk();
});

// ─── DESTROY ─────────────────────────────────────────────────────────────────

it('soft-deletes a plant variety', function (): void {
    $variety = PlantVariety::factory()->create();

    $this->deleteJson("/api/plant-varieties/{$variety->id}")
        ->assertOk()
        ->assertJsonPath('message', 'Plant variety deleted successfully.');

    $this->assertSoftDeleted('plant_varieties', ['id' => $variety->id]);
});

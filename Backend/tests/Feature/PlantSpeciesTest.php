<?php

declare(strict_types=1);

use App\Models\PlantSpecies;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);

    $admin = User::factory()->create();
    $admin->assignRole(\Spatie\Permission\Models\Role::findByName('admin', 'api'));

    $this->actingAs($admin, 'api');
});

// ─── INDEX ────────────────────────────────────────────────────────────────────

it('returns paginated list of plant species', function (): void {
    PlantSpecies::factory()->count(15)->create();

    $this->getJson('/api/plant-species')
        ->assertOk()
        ->assertJsonStructure(['data', 'meta', 'links']);
});

it('filters species by search term', function (): void {
    PlantSpecies::factory()->create(['common_name' => 'Rose Plant']);
    PlantSpecies::factory()->create(['common_name' => 'Cactus']);

    $this->getJson('/api/plant-species?search=Rose')
        ->assertOk()
        ->assertJsonCount(1, 'data')
        ->assertJsonPath('data.0.common_name', 'Rose Plant');
});

it('filters species by family', function (): void {
    PlantSpecies::factory()->count(3)->create(['family' => 'Rosaceae']);
    PlantSpecies::factory()->create(['family' => 'Fabaceae']);

    $this->getJson('/api/plant-species?family=Rosaceae')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

// ─── STORE ────────────────────────────────────────────────────────────────────

it('creates a plant species and returns 201', function (): void {
    $payload = [
        'common_name' => 'Sunflower',
        'scientific_name' => 'Helianthus annuus',
        'growth_type' => 'annual',
    ];

    $this->postJson('/api/plant-species', $payload)
        ->assertCreated()
        ->assertJsonPath('data.common_name', 'Sunflower')
        ->assertJsonPath('data.growth_type', 'annual');

    $this->assertDatabaseHas('plant_species', ['scientific_name' => 'Helianthus annuus']);
});

it('rejects duplicate scientific_name on store', function (): void {
    PlantSpecies::factory()->create(['scientific_name' => 'Helianthus annuus']);

    $this->postJson('/api/plant-species', [
        'common_name' => 'Another Sunflower',
        'scientific_name' => 'Helianthus annuus',
        'growth_type' => 'annual',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('scientific_name');
});

it('allows reuse of scientific_name from a soft-deleted species', function (): void {
    $deleted = PlantSpecies::factory()->create(['scientific_name' => 'Helianthus annuus']);
    $deleted->delete();

    $this->postJson('/api/plant-species', [
        'common_name' => 'New Sunflower',
        'scientific_name' => 'Helianthus annuus',
        'growth_type' => 'perennial',
    ])->assertCreated();
});

it('rejects invalid growth_type on store', function (): void {
    $this->postJson('/api/plant-species', [
        'common_name' => 'Test',
        'scientific_name' => 'Test scientificus',
        'growth_type' => 'invalid_type',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('growth_type');
});

// ─── SHOW ────────────────────────────────────────────────────────────────────

it('returns a single plant species', function (): void {
    $species = PlantSpecies::factory()->create();

    $this->getJson("/api/plant-species/{$species->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $species->id);
});

it('returns 404 for a non-existent species', function (): void {
    $this->getJson('/api/plant-species/999999')
        ->assertNotFound();
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

it('updates a plant species', function (): void {
    $species = PlantSpecies::factory()->create(['common_name' => 'Old Name']);

    $this->putJson("/api/plant-species/{$species->id}", ['common_name' => 'New Name'])
        ->assertOk()
        ->assertJsonPath('data.common_name', 'New Name');
});

it('ignores own scientific_name when updating', function (): void {
    $species = PlantSpecies::factory()->create(['scientific_name' => 'Helianthus annuus']);

    $this->putJson("/api/plant-species/{$species->id}", [
        'scientific_name' => 'Helianthus annuus',
    ])->assertOk();
});

// ─── DESTROY ─────────────────────────────────────────────────────────────────

it('soft-deletes a plant species', function (): void {
    $species = PlantSpecies::factory()->create();

    $this->deleteJson("/api/plant-species/{$species->id}")
        ->assertOk()
        ->assertJsonPath('message', 'Plant species deleted successfully.');

    $this->assertSoftDeleted('plant_species', ['id' => $species->id]);
});

it('excludes soft-deleted species from the index', function (): void {
    PlantSpecies::factory()->count(2)->create();
    PlantSpecies::factory()->create()->delete();

    $this->getJson('/api/plant-species')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

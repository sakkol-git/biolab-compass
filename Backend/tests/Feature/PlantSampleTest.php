<?php

declare(strict_types=1);

use App\Enums\SampleStatus;
use App\Models\PlantSample;
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

it('returns paginated list of samples with embedded relationships', function (): void {
    PlantSample::factory()->count(5)->create();

    $this->getJson('/api/plant-samples')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [['id', 'identity', 'relationships', 'details', 'lab_info', 'meta']],
        ]);
});

it('filters samples by search term', function (): void {
    PlantSample::factory()->create(['sample_name' => 'Alpha Rose', 'sample_code' => 'SMP-0001']);
    PlantSample::factory()->create(['sample_name' => 'Beta Cactus', 'sample_code' => 'SMP-0002']);

    $this->getJson('/api/plant-samples?search=Alpha')
        ->assertOk()
        ->assertJsonCount(1, 'data');
});

it('filters samples by status', function (): void {
    PlantSample::factory()->count(3)->create(['status' => SampleStatus::ACTIVE->value]);
    PlantSample::factory()->create(['status' => SampleStatus::ARCHIVED->value]);

    $this->getJson('/api/plant-samples?status=active')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

it('filters samples by species_id', function (): void {
    $species = PlantSpecies::factory()->create();
    PlantSample::factory()->count(2)->create(['plant_species_id' => $species->id]);
    PlantSample::factory()->create(); // different species

    $this->getJson("/api/plant-samples?species_id={$species->id}")
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

// ─── STORE ────────────────────────────────────────────────────────────────────

it('creates a plant sample and returns 201', function (): void {
    $species = PlantSpecies::factory()->create();

    $payload = [
        'plant_species_id' => $species->id,
        'sample_name' => 'Test Sample',
        'sample_code' => 'SMP-TEST-01',
        'status' => SampleStatus::ACTIVE->value,
        'quantity' => 10,
    ];

    $this->postJson('/api/plant-samples', $payload)
        ->assertCreated()
        ->assertJsonPath('data.identity.name', 'Test Sample')
        ->assertJsonPath('data.identity.code', 'SMP-TEST-01')
        ->assertJsonPath('data.details.quantity', 10);

    $this->assertDatabaseHas('plant_samples', ['sample_code' => 'SMP-TEST-01']);
});

it('creates a sample linked to a variety', function (): void {
    $variety = PlantVariety::factory()->create();

    $this->postJson('/api/plant-samples', [
        'plant_species_id' => $variety->plant_species_id,
        'plant_variety_id' => $variety->id,
        'sample_name' => 'Variety Sample',
        'sample_code' => 'SMP-VAR-01',
        'status' => SampleStatus::ACTIVE->value,
        'quantity' => 5,
    ])->assertCreated()
        ->assertJsonPath('data.relationships.variety.id', $variety->id);
});

it('rejects duplicate sample_code on store', function (): void {
    $species = PlantSpecies::factory()->create();
    PlantSample::factory()->create(['sample_code' => 'SMP-DUP']);

    $this->postJson('/api/plant-samples', [
        'plant_species_id' => $species->id,
        'sample_name' => 'Dup Sample',
        'sample_code' => 'SMP-DUP',
        'status' => SampleStatus::ACTIVE->value,
        'quantity' => 1,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('sample_code');
});

it('allows reuse of sample_code from a soft-deleted sample', function (): void {
    $species = PlantSpecies::factory()->create();
    PlantSample::factory()->create(['sample_code' => 'SMP-REUSE'])->delete();

    $this->postJson('/api/plant-samples', [
        'plant_species_id' => $species->id,
        'sample_name' => 'Reused Code',
        'sample_code' => 'SMP-REUSE',
        'status' => SampleStatus::ACTIVE->value,
        'quantity' => 1,
    ])->assertCreated();
});

it('rejects quantity below zero', function (): void {
    $species = PlantSpecies::factory()->create();

    $this->postJson('/api/plant-samples', [
        'plant_species_id' => $species->id,
        'sample_name' => 'Negative',
        'sample_code' => 'SMP-NEG',
        'status' => SampleStatus::ACTIVE->value,
        'quantity' => -1,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('quantity');
});

// ─── SHOW ────────────────────────────────────────────────────────────────────

it('returns a single sample with embedded relationships', function (): void {
    $sample = PlantSample::factory()->create();

    $this->getJson("/api/plant-samples/{$sample->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $sample->id)
        ->assertJsonStructure(['data' => ['identity', 'relationships', 'details', 'lab_info', 'meta']]);
});

it('returns 404 for non-existent sample', function (): void {
    $this->getJson('/api/plant-samples/999999')->assertNotFound();
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

it('updates a plant sample', function (): void {
    $sample = PlantSample::factory()->create(['sample_name' => 'Old Name']);

    $this->putJson("/api/plant-samples/{$sample->id}", ['sample_name' => 'New Name'])
        ->assertOk()
        ->assertJsonPath('data.identity.name', 'New Name');
});

it('ignores own sample_code when updating', function (): void {
    $sample = PlantSample::factory()->create(['sample_code' => 'SMP-SELF']);

    $this->putJson("/api/plant-samples/{$sample->id}", ['sample_code' => 'SMP-SELF'])
        ->assertOk();
});

// ─── DESTROY ─────────────────────────────────────────────────────────────────

it('soft-deletes a plant sample', function (): void {
    $sample = PlantSample::factory()->create();

    $this->deleteJson("/api/plant-samples/{$sample->id}")
        ->assertOk()
        ->assertJsonPath('message', 'Plant sample deleted successfully.');

    $this->assertSoftDeleted('plant_samples', ['id' => $sample->id]);
});

it('excludes soft-deleted samples from index', function (): void {
    PlantSample::factory()->count(2)->create();
    PlantSample::factory()->create()->delete();

    $this->getJson('/api/plant-samples')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

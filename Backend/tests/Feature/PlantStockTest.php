<?php

declare(strict_types=1);

use App\Enums\StockStatus;
use App\Models\PlantSample;
use App\Models\PlantSpecies;
use App\Models\PlantStock;
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

it('returns paginated list of stocks with embedded relationships', function (): void {
    PlantStock::factory()->count(5)->create();

    $this->getJson('/api/plant-stocks')
        ->assertOk()
        ->assertJsonStructure([
            'data' => [['id', 'inventory', 'relations']],
        ]);
});

it('filters stocks by species_id', function (): void {
    $species = PlantSpecies::factory()->create();
    PlantStock::factory()->count(3)->create(['plant_species_id' => $species->id]);
    PlantStock::factory()->create(); // different species

    $this->getJson("/api/plant-stocks?species_id={$species->id}")
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

it('filters stocks by status', function (): void {
    PlantStock::factory()->count(2)->create(['status' => StockStatus::AVAILABLE->value]);
    PlantStock::factory()->create(['status' => StockStatus::OUT_OF_STOCK->value]);

    $this->getJson('/api/plant-stocks?status=available')
        ->assertOk()
        ->assertJsonCount(2, 'data');
});

// ─── STORE ────────────────────────────────────────────────────────────────────

it('creates a plant stock and returns 201', function (): void {
    $species = PlantSpecies::factory()->create();

    $this->postJson('/api/plant-stocks', [
        'plant_species_id' => $species->id,
        'quantity' => 100,
        'reserved_quantity' => 20,
        'status' => StockStatus::AVAILABLE->value,
    ])->assertCreated()
        ->assertJsonPath('data.inventory.total', 100)
        ->assertJsonPath('data.inventory.reserved', 20)
        ->assertJsonPath('data.inventory.net_available', 80);
});

it('net_available is always total minus reserved', function (): void {
    $species = PlantSpecies::factory()->create();

    $response = $this->postJson('/api/plant-stocks', [
        'plant_species_id' => $species->id,
        'quantity' => 50,
        'reserved_quantity' => 30,
        'status' => StockStatus::AVAILABLE->value,
    ])->assertCreated();

    expect($response->json('data.inventory.net_available'))->toBe(20);
});

it('creates stock linked to a variety and sample', function (): void {
    $variety = PlantVariety::factory()->create();
    $sample = PlantSample::factory()->create(['plant_species_id' => $variety->plant_species_id]);

    $this->postJson('/api/plant-stocks', [
        'plant_species_id' => $variety->plant_species_id,
        'plant_variety_id' => $variety->id,
        'plant_sample_id' => $sample->id,
        'quantity' => 10,
        'reserved_quantity' => 0,
        'status' => StockStatus::AVAILABLE->value,
    ])->assertCreated()
        ->assertJsonPath('data.relations.variety.id', $variety->id)
        ->assertJsonPath('data.relations.sample.id', $sample->id);
});

it('rejects reserved_quantity greater than quantity on store', function (): void {
    $species = PlantSpecies::factory()->create();

    $this->postJson('/api/plant-stocks', [
        'plant_species_id' => $species->id,
        'quantity' => 10,
        'reserved_quantity' => 50, // exceeds quantity
        'status' => StockStatus::AVAILABLE->value,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('reserved_quantity');
});

it('rejects negative quantity on store', function (): void {
    $species = PlantSpecies::factory()->create();

    $this->postJson('/api/plant-stocks', [
        'plant_species_id' => $species->id,
        'quantity' => -5,
        'reserved_quantity' => 0,
        'status' => StockStatus::AVAILABLE->value,
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('quantity');
});

// ─── SHOW ────────────────────────────────────────────────────────────────────

it('returns a single stock record', function (): void {
    $stock = PlantStock::factory()->create();

    $this->getJson("/api/plant-stocks/{$stock->id}")
        ->assertOk()
        ->assertJsonPath('data.id', $stock->id)
        ->assertJsonStructure(['data' => ['inventory' => ['total', 'reserved', 'net_available', 'status']]]);
});

it('returns 404 for non-existent stock', function (): void {
    $this->getJson('/api/plant-stocks/999999')->assertNotFound();
});

// ─── UPDATE ───────────────────────────────────────────────────────────────────

it('updates quantity and net_available recalculates correctly', function (): void {
    $stock = PlantStock::factory()->create(['quantity' => 50, 'reserved_quantity' => 10]);

    $this->putJson("/api/plant-stocks/{$stock->id}", ['quantity' => 80])
        ->assertOk()
        ->assertJsonPath('data.inventory.total', 80)
        ->assertJsonPath('data.inventory.reserved', 10)
        ->assertJsonPath('data.inventory.net_available', 70);
});

it('rejects update where reserved would exceed new quantity (partial update guard)', function (): void {
    // Stock has reserved=50 already persisted; we try to lower quantity below that.
    $stock = PlantStock::factory()->create(['quantity' => 100, 'reserved_quantity' => 50]);

    $this->putJson("/api/plant-stocks/{$stock->id}", ['quantity' => 30])
        ->assertUnprocessable();
});

it('rejects update where new reserved exceeds current quantity (partial update guard)', function (): void {
    $stock = PlantStock::factory()->create(['quantity' => 40, 'reserved_quantity' => 10]);

    $this->putJson("/api/plant-stocks/{$stock->id}", ['reserved_quantity' => 99])
        ->assertUnprocessable();
});

it('allows simultaneous quantity and reserved_quantity update when valid', function (): void {
    $stock = PlantStock::factory()->create(['quantity' => 20, 'reserved_quantity' => 5]);

    $this->putJson("/api/plant-stocks/{$stock->id}", [
        'quantity' => 60,
        'reserved_quantity' => 40,
    ])->assertOk()
        ->assertJsonPath('data.inventory.net_available', 20);
});

// ─── DESTROY ─────────────────────────────────────────────────────────────────

it('soft-deletes a plant stock', function (): void {
    $stock = PlantStock::factory()->create();

    $this->deleteJson("/api/plant-stocks/{$stock->id}")
        ->assertOk()
        ->assertJsonPath('message', 'Stock record deleted successfully.');

    $this->assertSoftDeleted('plant_stocks', ['id' => $stock->id]);
});

it('excludes soft-deleted stocks from index', function (): void {
    PlantStock::factory()->count(3)->create();
    PlantStock::factory()->create()->delete();

    $this->getJson('/api/plant-stocks')
        ->assertOk()
        ->assertJsonCount(3, 'data');
});

// ─── INVARIANT: net_available never below zero ────────────────────────────────

it('net_available is never negative regardless of data', function (): void {
    // Force an edge-case: quantity=0, reserved=0
    $stock = PlantStock::factory()->create(['quantity' => 0, 'reserved_quantity' => 0]);

    $this->getJson("/api/plant-stocks/{$stock->id}")
        ->assertOk()
        ->assertJsonPath('data.inventory.net_available', 0);
});

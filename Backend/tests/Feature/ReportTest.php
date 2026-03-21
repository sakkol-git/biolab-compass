<?php

declare(strict_types=1);

use App\Enums\BorrowStatus;
use App\Models\BorrowRecord;
use App\Models\Chemical;
use App\Models\ChemicalUsageLog;
use App\Models\PlantSpecies;
use App\Models\User;
use Database\Seeders\RolePermissionSeeder;

beforeEach(function (): void {
    $this->seed(RolePermissionSeeder::class);

    $this->admin = User::factory()->create();
    $this->admin->assignRole(\Spatie\Permission\Models\Role::findByName('admin', 'api'));

    $this->actingAs($this->admin, 'api');
});

// ─── INVENTORY REPORT ────────────────────────────────────────────────────────

it('returns paginated inventory report', function (): void {
    Chemical::factory()->count(2)->create();

    $this->getJson('/api/reports/inventory?section=chemicals')
        ->assertOk()
        ->assertJsonStructure([
            'data',
            'section',
            'meta' => ['current_page', 'last_page', 'per_page', 'total'],
        ]);
});

// ─── CHEMICAL USAGE REPORT ───────────────────────────────────────────────────

it('returns chemical usage report', function (): void {
    $chemical = Chemical::factory()->create();
    ChemicalUsageLog::factory()->count(3)->create([
        'chemical_id' => $chemical->id,
    ]);

    $this->getJson('/api/reports/chemical-usage')
        ->assertOk()
        ->assertJsonStructure(['data']);
});

it('filters chemical usage by date range', function (): void {
    $chemical = Chemical::factory()->create();
    ChemicalUsageLog::factory()->create([
        'chemical_id' => $chemical->id,
        'used_at' => now()->subDays(5),
    ]);
    ChemicalUsageLog::factory()->create([
        'chemical_id' => $chemical->id,
        'used_at' => now()->subDays(30),
    ]);

    $from = now()->subDays(7)->toDateString();
    $to = now()->toDateString();

    $this->getJson("/api/reports/chemical-usage?from={$from}&to={$to}")
        ->assertOk();
});

// ─── EXPIRED ITEMS REPORT ────────────────────────────────────────────────────

it('returns expired items report', function (): void {
    Chemical::factory()->create([
        'expiry_date' => now()->subDays(10),
    ]);
    Chemical::factory()->create([
        'expiry_date' => now()->addDays(30),
    ]);

    $this->getJson('/api/reports/expired-items')
        ->assertOk()
        ->assertJsonStructure(['data']);
});

// ─── BORROWED ITEMS REPORT ──────────────────────────────────────────────────

it('returns borrowed items report', function (): void {
    BorrowRecord::factory()->count(3)->create([
        'status' => BorrowStatus::BORROWED->value,
    ]);
    BorrowRecord::factory()->returned()->create();

    $this->getJson('/api/reports/borrowed-items')
        ->assertOk()
        ->assertJsonStructure(['data']);
});

// ─── USER ACTIVITY REPORT ───────────────────────────────────────────────────

it('returns user activity report', function (): void {
    User::factory()->count(3)->create();

    $this->getJson('/api/reports/user-activity')
        ->assertOk()
        ->assertJsonStructure(['data']);
});

// ─── CSV EXPORT ──────────────────────────────────────────────────────────────

it('exports inventory report as CSV', function (): void {
    PlantSpecies::factory()->count(2)->create();

    $this->getJson('/api/reports/inventory/export')
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');
});

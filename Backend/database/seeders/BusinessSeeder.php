<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ClientType;
use App\Enums\ContractStatus;
use App\Enums\LabServiceStatus;
use App\Enums\MilestoneStatus;
use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Enums\ServicePaymentStatus;
use App\Models\Client;
use App\Models\Contract;
use App\Models\ContractMilestone;
use App\Models\LabService;
use App\Models\Payment;
use App\Models\PlantSpecies;
use App\Models\ProductionForecast;
use App\Models\User;
use Illuminate\Database\Seeder;

class BusinessSeeder extends Seeder
{
    public function run(): void
    {
        // ── Gather existing references ───────────────────────────────────────
        $admin = User::where('email', 'admin@biolab.test')->first();
        $manager = User::where('email', 'manager@biolab.test')->first();
        $users = User::all();
        $species = PlantSpecies::all();

        // ── Clients ──────────────────────────────────────────────────────────
        $namedClients = [
            [
                'client_code' => 'CLT-0001',
                'company_name' => 'Green Valley Farms',
                'contact_name' => 'Sok Dara',
                'email' => 'dara@greenvalley.kh',
                'phone' => '+855-12-345-678',
                'address' => 'Battambang Province, Cambodia',
                'client_type' => ClientType::FARM_OWNER,
                'notes' => 'Long-term partner. Orders cassava and banana plantlets each season.',
            ],
            [
                'client_code' => 'CLT-0002',
                'company_name' => 'MAFF Cambodia',
                'contact_name' => 'Chan Rith',
                'email' => 'rith@maff.gov.kh',
                'phone' => '+855-23-211-500',
                'address' => 'Phnom Penh, Cambodia',
                'client_type' => ClientType::GOVERNMENT,
                'notes' => 'Ministry of Agriculture, Forestry and Fisheries. Contract for reforestation project.',
            ],
            [
                'client_code' => 'CLT-0003',
                'company_name' => 'Asia Plant Research Institute',
                'contact_name' => 'Dr. Ly Meng',
                'email' => 'ly.meng@apri.org',
                'phone' => '+855-16-789-012',
                'address' => 'Siem Reap, Cambodia',
                'client_type' => ClientType::RESEARCH_PARTNER,
                'notes' => 'Collaborative research partner for orchid tissue culture.',
            ],
            [
                'client_code' => 'CLT-0004',
                'company_name' => 'EcoGrowth NGO',
                'contact_name' => 'Sarah Chen',
                'email' => 'sarah@ecogrowth.org',
                'phone' => '+855-17-456-789',
                'address' => 'Kampong Cham, Cambodia',
                'client_type' => ClientType::NGO,
                'notes' => 'Community farming support program.',
            ],
        ];

        $clients = [];
        foreach ($namedClients as $data) {
            $clients[] = Client::factory()->create($data);
        }

        // 4 random clients
        Client::factory()->count(4)->create();

        $this->command->info('  ✓ Clients seeded (4 named + 4 random = 8 total)');

        // ── Contracts ────────────────────────────────────────────────────────
        $firstSpecies = $species->first();
        $secondSpecies = $species->count() > 1 ? $species->skip(1)->first() : $firstSpecies;

        $namedContracts = [
            [
                'contract_code' => 'CTR-0001',
                'client_id' => $clients[0]->id,
                'plant_species_id' => $firstSpecies?->id,
                'species_name' => $firstSpecies?->scientific_name ?? 'Manihot esculenta',
                'common_name' => $firstSpecies?->common_name ?? 'Cassava',
                'quantity_ordered' => 2000,
                'quantity_delivered' => 500,
                'unit_price' => 1.50,
                'total_value' => 3000.00,
                'contract_date' => now()->subMonths(4)->toDateString(),
                'delivery_deadline' => now()->addMonths(2)->toDateString(),
                'status' => ContractStatus::IN_PRODUCTION,
                'managed_by' => $manager?->id,
                'progress_pct' => 25,
                'terms' => 'Deliver 2000 cassava plantlets in 3 batches. Payment 50% deposit, 50% on delivery.',
            ],
            [
                'contract_code' => 'CTR-0002',
                'client_id' => $clients[1]->id,
                'plant_species_id' => $secondSpecies?->id,
                'species_name' => $secondSpecies?->scientific_name ?? 'Tectona grandis',
                'common_name' => $secondSpecies?->common_name ?? 'Teak',
                'quantity_ordered' => 5000,
                'quantity_delivered' => 0,
                'unit_price' => 2.00,
                'total_value' => 10000.00,
                'contract_date' => now()->subMonths(1)->toDateString(),
                'delivery_deadline' => now()->addMonths(6)->toDateString(),
                'status' => ContractStatus::SIGNED,
                'managed_by' => $admin?->id,
                'progress_pct' => 5,
                'terms' => 'Government reforestation contract. 5000 teak seedlings. Payment on milestones.',
            ],
            [
                'contract_code' => 'CTR-0003',
                'client_id' => $clients[2]->id,
                'plant_species_id' => $firstSpecies?->id,
                'species_name' => 'Dendrobium nobile',
                'common_name' => 'Dendrobium Orchid',
                'quantity_ordered' => 500,
                'quantity_delivered' => 500,
                'unit_price' => 5.00,
                'total_value' => 2500.00,
                'contract_date' => now()->subMonths(8)->toDateString(),
                'delivery_deadline' => now()->subMonths(1)->toDateString(),
                'actual_delivery_date' => now()->subWeeks(3)->toDateString(),
                'status' => ContractStatus::DELIVERED,
                'managed_by' => $manager?->id,
                'progress_pct' => 100,
                'terms' => 'Research collaboration. 500 orchid plantlets for joint study.',
            ],
        ];

        $contracts = [];
        foreach ($namedContracts as $data) {
            $contracts[] = Contract::factory()->create($data);
        }

        // 4 random contracts
        Contract::factory()->count(4)->create([
            'client_id' => fn () => Client::inRandomOrder()->first()->id,
            'plant_species_id' => fn () => $species->random()->id,
            'species_name' => fn () => $species->random()->scientific_name,
            'common_name' => fn () => $species->random()->common_name,
            'managed_by' => fn () => $users->random()->id,
        ]);

        $this->command->info('  ✓ Contracts seeded (3 named + 4 random = 7 total)');

        // ── Contract Milestones ──────────────────────────────────────────────
        // Milestones for CTR-0001 (in production)
        ContractMilestone::factory()->create([
            'contract_id' => $contracts[0]->id,
            'milestone_name' => 'Batch 1 — 700 Plantlets',
            'target_date' => now()->subMonths(1)->toDateString(),
            'actual_date' => now()->subMonths(1)->addDays(3)->toDateString(),
            'projected_count' => 700,
            'actual_count' => 500,
            'status' => MilestoneStatus::COMPLETED,
        ]);
        ContractMilestone::factory()->create([
            'contract_id' => $contracts[0]->id,
            'milestone_name' => 'Batch 2 — 700 Plantlets',
            'target_date' => now()->addMonth()->toDateString(),
            'projected_count' => 700,
            'status' => MilestoneStatus::ON_TRACK,
        ]);
        ContractMilestone::factory()->create([
            'contract_id' => $contracts[0]->id,
            'milestone_name' => 'Batch 3 — Final 600 Plantlets',
            'target_date' => now()->addMonths(2)->toDateString(),
            'projected_count' => 600,
            'status' => MilestoneStatus::PENDING,
        ]);

        // Milestones for CTR-0002 (signed)
        ContractMilestone::factory()->create([
            'contract_id' => $contracts[1]->id,
            'milestone_name' => 'Phase 1 — Seedling Preparation',
            'target_date' => now()->addMonths(2)->toDateString(),
            'projected_count' => 1500,
            'status' => MilestoneStatus::PENDING,
        ]);
        ContractMilestone::factory()->create([
            'contract_id' => $contracts[1]->id,
            'milestone_name' => 'Phase 2 — First Delivery',
            'target_date' => now()->addMonths(4)->toDateString(),
            'projected_count' => 2000,
            'status' => MilestoneStatus::PENDING,
        ]);

        $this->command->info('  ✓ Contract milestones seeded (5 named)');

        // ── Payments ─────────────────────────────────────────────────────────
        // Payments for CTR-0001
        Payment::factory()->create([
            'contract_id' => $contracts[0]->id,
            'amount' => 1500.00,
            'payment_type' => PaymentType::DEPOSIT,
            'payment_method' => 'bank_transfer',
            'payment_date' => now()->subMonths(4)->toDateString(),
            'due_date' => now()->subMonths(4)->toDateString(),
            'status' => PaymentStatus::RECEIVED,
            'reference_number' => 'PAY-CTR0001-DEP',
        ]);
        Payment::factory()->create([
            'contract_id' => $contracts[0]->id,
            'amount' => 750.00,
            'payment_type' => PaymentType::MILESTONE,
            'payment_method' => 'bank_transfer',
            'due_date' => now()->addMonth()->toDateString(),
            'status' => PaymentStatus::PENDING,
            'reference_number' => 'PAY-CTR0001-M1',
        ]);

        // Payments for CTR-0002
        Payment::factory()->create([
            'contract_id' => $contracts[1]->id,
            'amount' => 3000.00,
            'payment_type' => PaymentType::DEPOSIT,
            'payment_method' => 'bank_transfer',
            'payment_date' => now()->subWeeks(2)->toDateString(),
            'due_date' => now()->subWeeks(3)->toDateString(),
            'status' => PaymentStatus::RECEIVED,
            'reference_number' => 'PAY-CTR0002-DEP',
        ]);

        // Payments for CTR-0003 (delivered — fully paid)
        Payment::factory()->create([
            'contract_id' => $contracts[2]->id,
            'amount' => 1250.00,
            'payment_type' => PaymentType::DEPOSIT,
            'payment_method' => 'bank_transfer',
            'payment_date' => now()->subMonths(8)->toDateString(),
            'due_date' => now()->subMonths(8)->toDateString(),
            'status' => PaymentStatus::RECEIVED,
            'reference_number' => 'PAY-CTR0003-DEP',
        ]);
        Payment::factory()->create([
            'contract_id' => $contracts[2]->id,
            'amount' => 1250.00,
            'payment_type' => PaymentType::FINAL,
            'payment_method' => 'bank_transfer',
            'payment_date' => now()->subWeeks(3)->toDateString(),
            'due_date' => now()->subMonths(1)->toDateString(),
            'status' => PaymentStatus::RECEIVED,
            'reference_number' => 'PAY-CTR0003-FIN',
        ]);

        // 3 random payments
        Payment::factory()->count(3)->create([
            'contract_id' => fn () => Contract::inRandomOrder()->first()->id,
        ]);

        $this->command->info('  ✓ Payments seeded (5 named + 3 random = 8 total)');

        // ── Update client counters ───────────────────────────────────────────
        foreach ($clients as $client) {
            $client->recalculateCounters();
        }

        // ── Production Forecasts ─────────────────────────────────────────────
        if ($firstSpecies) {
            ProductionForecast::factory()->create([
                'plant_species_id' => $firstSpecies->id,
                'species_name' => $firstSpecies->scientific_name,
                'common_name' => $firstSpecies->common_name,
                'desired_quantity' => 2000,
                'recommended_initial_stock' => 150,
                'estimated_weeks' => 16,
                'confidence_lower_weeks' => 14,
                'confidence_upper_weeks' => 19,
                'estimated_cycles' => 4,
                'estimated_survival_rate' => 87.50,
                'estimated_multiplication_rate' => 3.60,
                'weekly_milestones' => [
                    ['week' => 4, 'expected_count' => 540],
                    ['week' => 8, 'expected_count' => 1080],
                    ['week' => 12, 'expected_count' => 1620],
                    ['week' => 16, 'expected_count' => 2000],
                ],
                'resource_requirements' => [
                    'growth_chambers' => 2,
                    'ms_medium_liters' => 40,
                    'person_hours_per_week' => 8,
                ],
                'propagation_method' => 'tissue_culture',
                'calculated_by' => $admin?->id,
            ]);
        }

        // 3 random forecasts
        ProductionForecast::factory()->count(3)->create([
            'plant_species_id' => fn () => $species->random()->id,
            'species_name' => fn () => $species->random()->scientific_name,
            'common_name' => fn () => $species->random()->common_name,
            'calculated_by' => fn () => $users->random()->id,
        ]);

        $this->command->info('  ✓ Production forecasts seeded (1 named + 3 random = 4 total)');

        // ── Lab Services ─────────────────────────────────────────────────────
        $namedServices = [
            [
                'service_code' => 'SVC-0001',
                'service_title' => 'Soil pH & Nutrient Analysis',
                'client_name' => 'Green Valley Farms',
                'client_contact' => '+855-12-345-678',
                'service_description' => 'Complete soil analysis including pH, NPK levels, organic matter, and micronutrient profiling.',
                'assigned_staff' => [$admin?->name ?? 'admin'],
                'start_date' => now()->subWeeks(2)->toDateString(),
                'status' => LabServiceStatus::IN_PROGRESS,
                'service_fee' => 250.00,
                'payment_status' => ServicePaymentStatus::PARTIAL,
            ],
            [
                'service_code' => 'SVC-0002',
                'service_title' => 'Plant Disease Diagnosis',
                'client_name' => 'EcoGrowth NGO',
                'client_contact' => '+855-17-456-789',
                'service_description' => 'Identify pathogen causing leaf blight in community farm cassava crop.',
                'assigned_staff' => [$manager?->name ?? 'manager'],
                'start_date' => now()->subMonths(1)->toDateString(),
                'end_date' => now()->subWeeks(1)->toDateString(),
                'status' => LabServiceStatus::COMPLETED,
                'result_summary' => 'Identified Xanthomonas axonopodis. Recommended copper-based fungicide treatment.',
                'service_fee' => 180.00,
                'payment_status' => ServicePaymentStatus::PAID,
            ],
            [
                'service_code' => 'SVC-0003',
                'service_title' => 'Tissue Culture Training Workshop',
                'client_name' => 'MAFF Cambodia',
                'client_contact' => '+855-23-211-500',
                'service_description' => 'Two-day hands-on tissue culture training for 15 agricultural extension officers.',
                'assigned_staff' => [$admin?->name ?? 'admin', $manager?->name ?? 'manager'],
                'start_date' => now()->addWeeks(2)->toDateString(),
                'status' => LabServiceStatus::PENDING,
                'service_fee' => 1500.00,
                'payment_status' => ServicePaymentStatus::UNPAID,
            ],
        ];

        foreach ($namedServices as $data) {
            LabService::factory()->create($data);
        }

        // 5 random lab services
        LabService::factory()->count(5)->create();

        $this->command->info('  ✓ Lab services seeded (3 named + 5 random = 8 total)');
    }
}

<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\ExperimentStatus;
use App\Enums\GrowthStage;
use App\Enums\PropagationMethod;
use App\Enums\ProtocolStatus;
use App\Models\Experiment;
use App\Models\GrowthLog;
use App\Models\LabNotebook;
use App\Models\PlantSpecies;
use App\Models\Protocol;
use App\Models\ProtocolStep;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class ResearchSeeder extends Seeder
{
    public function run(): void
    {
        // ── Gather existing references ───────────────────────────────────────
        $admin = User::where('email', 'admin@biolab.test')->first();
        $manager = User::where('email', 'manager@biolab.test')->first();
        $users = User::all();
        $species = PlantSpecies::all();

        // ── Tags ─────────────────────────────────────────────────────────────
        $tags = collect([
            'tissue-culture', 'propagation', 'orchid', 'cassava',
            'high-priority', 'long-term', 'field-trial', 'greenhouse',
        ])->map(fn (string $name) => Tag::firstOrCreate(
            ['slug' => $name],
            ['name' => str_replace('-', ' ', ucfirst($name)), 'slug' => $name],
        ));

        $this->command->info('  ✓ Tags seeded (8 named)');

        // ── Protocols ────────────────────────────────────────────────────────
        $protocols = [];

        $namedProtocols = [
            [
                'protocol_code' => 'PRT-0001',
                'title' => 'Standard Tissue Culture Initiation',
                'description' => 'Step-by-step protocol for initiating tissue culture from explants.',
                'category' => 'Propagation',
                'version' => '2.0',
                'status' => ProtocolStatus::ACTIVE,
                'author_id' => $admin?->id,
                'author_name' => $admin?->name ?? 'Admin',
                'steps' => [
                    ['title' => 'Prepare MS Medium', 'description' => 'Mix macronutrients, micronutrients and vitamins. Adjust pH to 5.8.', 'duration_minutes' => 60],
                    ['title' => 'Sterilize Explants', 'description' => 'Surface sterilize using 70% ethanol then 10% NaOCl.', 'duration_minutes' => 30],
                    ['title' => 'Inoculate', 'description' => 'Place sterilized explants on medium under laminar flow.', 'duration_minutes' => 45],
                    ['title' => 'Incubate', 'description' => 'Transfer to growth chamber at 25°C, 16h light cycle.', 'duration_minutes' => 5],
                ],
            ],
            [
                'protocol_code' => 'PRT-0002',
                'title' => 'Seed Germination Test Protocol',
                'description' => 'Standard seed viability and germination rate testing.',
                'category' => 'Growth Monitoring',
                'version' => '1.0',
                'status' => ProtocolStatus::ACTIVE,
                'author_id' => $manager?->id,
                'author_name' => $manager?->name ?? 'Manager',
                'steps' => [
                    ['title' => 'Soak Seeds', 'description' => 'Soak seeds in distilled water for 12h.', 'duration_minutes' => 720],
                    ['title' => 'Plate on Moist Filter Paper', 'description' => 'Place 25 seeds per petri dish on moistened filter paper.', 'duration_minutes' => 20],
                    ['title' => 'Record Germination', 'description' => 'Count germinated seeds daily for 14 days.', 'duration_minutes' => 15],
                ],
            ],
            [
                'protocol_code' => 'PRT-0003',
                'title' => 'Acclimatization Protocol',
                'description' => 'Transfer plantlets from in-vitro to greenhouse conditions.',
                'category' => 'Acclimatization',
                'version' => '1.1',
                'status' => ProtocolStatus::ACTIVE,
                'author_id' => $admin?->id,
                'author_name' => $admin?->name ?? 'Admin',
                'steps' => [
                    ['title' => 'Wash Roots', 'description' => 'Remove agar from roots under running water.', 'duration_minutes' => 15],
                    ['title' => 'Pot in Substrate', 'description' => 'Plant in sterile peat/perlite mix.', 'duration_minutes' => 20],
                    ['title' => 'Misting Regime', 'description' => 'Maintain 80% humidity for 2 weeks, then gradually reduce.', 'duration_minutes' => 10],
                ],
            ],
        ];

        foreach ($namedProtocols as $data) {
            $steps = $data['steps'];
            unset($data['steps']);

            $protocol = Protocol::factory()->create(array_merge($data, [
                'steps_count' => count($steps),
            ]));

            foreach ($steps as $i => $step) {
                ProtocolStep::factory()->create(array_merge($step, [
                    'protocol_id' => $protocol->id,
                    'step_number' => $i + 1,
                ]));
            }

            $protocols[] = $protocol;
        }

        // 3 random protocols
        Protocol::factory()->count(3)->create([
            'author_id' => $users->random()->id,
            'author_name' => $users->random()->name,
        ]);

        $this->command->info('  ✓ Protocols seeded (3 named + 3 random = 6 total)');

        // ── Experiments ──────────────────────────────────────────────────────
        $namedExperiments = [
            [
                'experiment_code' => 'EXP-0001',
                'title' => 'Cassava Tissue Culture Multiplication',
                'plant_species_id' => $species->first()?->id,
                'species_name' => $species->first()?->scientific_name ?? 'Manihot esculenta',
                'common_name' => $species->first()?->common_name ?? 'Cassava',
                'objective' => 'Mass propagation of cassava through tissue culture to supply 2000 plantlets.',
                'propagation_method' => PropagationMethod::TISSUE_CULTURE,
                'growth_medium' => 'MS Medium',
                'environment' => 'Growth Chamber',
                'initial_seed_count' => 50,
                'current_count' => 180,
                'start_date' => now()->subMonths(3)->toDateString(),
                'expected_end_date' => now()->addMonths(3)->toDateString(),
                'status' => ExperimentStatus::ACTIVE,
                'avg_survival_rate' => 87.50,
                'multiplication_rate' => 3.60,
                'created_by' => $admin?->id,
            ],
            [
                'experiment_code' => 'EXP-0002',
                'title' => 'Orchid Seed Germination Rate Study',
                'plant_species_id' => $species->count() > 1 ? $species->skip(1)->first()?->id : $species->first()?->id,
                'species_name' => 'Dendrobium nobile',
                'common_name' => 'Dendrobium Orchid',
                'objective' => 'Evaluate germination rates under varying light conditions.',
                'propagation_method' => PropagationMethod::SEED,
                'growth_medium' => 'Agar',
                'environment' => 'Lab Bench',
                'initial_seed_count' => 100,
                'current_count' => 72,
                'start_date' => now()->subMonths(2)->toDateString(),
                'expected_end_date' => now()->addMonths(1)->toDateString(),
                'status' => ExperimentStatus::ACTIVE,
                'avg_survival_rate' => 72.00,
                'multiplication_rate' => 1.00,
                'created_by' => $manager?->id,
            ],
            [
                'experiment_code' => 'EXP-0003',
                'title' => 'Banana Stool Cutting Trial',
                'plant_species_id' => $species->count() > 2 ? $species->skip(2)->first()?->id : $species->first()?->id,
                'species_name' => 'Musa acuminata',
                'common_name' => 'Banana',
                'objective' => 'Test cutting propagation efficiency for banana varieties.',
                'propagation_method' => PropagationMethod::CUTTING,
                'growth_medium' => 'Soil Mix',
                'environment' => 'Greenhouse',
                'initial_seed_count' => 30,
                'current_count' => 45,
                'start_date' => now()->subMonths(5)->toDateString(),
                'expected_end_date' => now()->subMonths(1)->toDateString(),
                'actual_end_date' => now()->subWeeks(2)->toDateString(),
                'status' => ExperimentStatus::COMPLETED,
                'avg_survival_rate' => 93.33,
                'multiplication_rate' => 1.50,
                'final_yield' => 45,
                'conclusion' => 'Stool cutting propagation yielded 93% survival rate. Recommended for scale-up.',
                'created_by' => $admin?->id,
            ],
        ];

        $experiments = [];
        foreach ($namedExperiments as $data) {
            $experiments[] = Experiment::factory()->create($data);
        }

        // 5 random experiments
        $randomExperiments = Experiment::factory()
            ->count(5)
            ->create([
                'plant_species_id' => fn () => $species->random()->id,
                'species_name' => fn () => $species->random()->scientific_name,
                'common_name' => fn () => $species->random()->common_name,
                'created_by' => fn () => $users->random()->id,
            ]);

        $allExperiments = collect($experiments)->merge($randomExperiments);

        // Attach protocols to experiments
        foreach ($experiments as $i => $exp) {
            if (isset($protocols[$i])) {
                $exp->protocols()->attach($protocols[$i]->id);
            }
        }

        // Attach tags to experiments
        $experiments[0]->tags()->attach($tags->whereIn('slug', ['tissue-culture', 'high-priority'])->pluck('id'));
        $experiments[1]->tags()->attach($tags->whereIn('slug', ['greenhouse', 'orchid'])->pluck('id'));
        $experiments[2]->tags()->attach($tags->whereIn('slug', ['propagation', 'field-trial'])->pluck('id'));

        // Assign users to experiments
        foreach ($experiments as $exp) {
            $exp->assignedUsers()->attach($users->random(min(2, $users->count()))->pluck('id'), ['role' => 'researcher']);
        }

        $this->command->info('  ✓ Experiments seeded (3 named + 5 random = 8 total)');

        // ── Growth Logs ──────────────────────────────────────────────────────
        $stages = GrowthStage::cases();

        foreach ($allExperiments as $experiment) {
            $weekCount = rand(3, 8);
            $seedling = $experiment->initial_seed_count ?: rand(20, 100);

            for ($w = 1; $w <= $weekCount; $w++) {
                $alive = max(1, (int) ($seedling * (1 - ($w * rand(1, 5) / 100))));
                $dead = $seedling - $alive;
                $propagations = $w > 2 ? rand(0, 10) : 0;
                $seedling = $alive + $propagations;

                GrowthLog::factory()->create([
                    'experiment_id' => $experiment->id,
                    'week_number' => $w,
                    'log_date' => $experiment->start_date->addWeeks($w),
                    'seedling_count' => $seedling,
                    'alive_count' => $alive,
                    'dead_count' => $dead,
                    'new_propagations' => $propagations,
                    'survival_rate_pct' => round(($alive / max(1, $seedling)) * 100, 2),
                    'multiplication_rate' => round($seedling / max(1, $experiment->initial_seed_count ?: 1), 2),
                    'health_score' => round(rand(50, 100) / 10, 1),
                    'avg_height_cm' => round($w * rand(5, 20) / 10, 2),
                    'growth_stage' => $stages[min($w - 1, count($stages) - 1)],
                    'observations' => "Week {$w} observation — normal growth patterns observed.",
                    'recorded_by' => $users->random()->id,
                ]);
            }

            // Update experiment current count
            $experiment->update(['current_count' => $seedling]);
        }

        $this->command->info('  ✓ Growth logs seeded (~5 logs per experiment)');

        // ── Lab Notebooks ────────────────────────────────────────────────────
        $namedNotebooks = [
            [
                'notebook_code' => 'NB-0001',
                'title' => 'Cassava TC — Daily Observations',
                'content' => "## Week 1\nExplants placed on MS medium. No contamination observed.\n\n## Week 2\nCallus formation visible on 80% of explants.\n\n## Week 3\nShoot initiation on 15 out of 50 explants.",
                'author_id' => $admin?->id,
                'author_name' => $admin?->name ?? 'Admin',
                'experiment_id' => $experiments[0]->id,
                'is_locked' => false,
            ],
            [
                'notebook_code' => 'NB-0002',
                'title' => 'Orchid Germination — Light Trial Notes',
                'content' => "Testing three light conditions: full, partial, dark.\nPreliminary results show partial light has best germination rates.",
                'author_id' => $manager?->id,
                'author_name' => $manager?->name ?? 'Manager',
                'experiment_id' => $experiments[1]->id,
                'is_locked' => false,
            ],
            [
                'notebook_code' => 'NB-0003',
                'title' => 'Banana Cutting Trial — Final Report',
                'content' => "Experiment completed successfully. 93% survival rate achieved.\nRecommend scale-up using stool cutting method for future production contracts.",
                'author_id' => $admin?->id,
                'author_name' => $admin?->name ?? 'Admin',
                'experiment_id' => $experiments[2]->id,
                'is_locked' => true,
            ],
        ];

        foreach ($namedNotebooks as $data) {
            LabNotebook::factory()->create($data);
        }

        // 5 random notebooks
        LabNotebook::factory()->count(5)->create([
            'author_id' => fn () => $users->random()->id,
            'author_name' => fn () => $users->random()->name,
        ]);

        $this->command->info('  ✓ Lab notebooks seeded (3 named + 5 random = 8 total)');
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Research\Services;

use App\Concerns\ParsesCsv;
use App\Enums\ExperimentStatus;
use App\Modules\Research\Models\Experiment;
use App\Modules\Core\Models\Tag;
use App\Modules\Core\Models\User;
use App\Modules\Core\Services\CodeGeneratorService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ExperimentService
{
    use ParsesCsv;

    /**
     * Paginated listing with search, status filter, species filter.
     */
    public function list(
        ?string $search = null,
        ?string $status = null,
        ?string $species = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return Experiment::query()
            ->with(['tags', 'assignedUsers', 'species'])
            ->search($search)
            ->when($status, fn ($q) => $q->byStatus(ExperimentStatus::from($status)))
            ->when($species, fn ($q) => $q->where('plant_species_id', $species))
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * Single experiment with all relations.
     */
    public function get(int $id): Experiment
    {
        return Experiment::with([
            'growthLogs' => fn ($q) => $q->orderBy('week_number'),
            'growthLogs.recorder',
            'assignedUsers',
            'tags',
            'protocols',
            'species',
            'creator',
        ])->findOrFail($id);
    }

    /**
     * Create a new experiment.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?User $user = null): Experiment
    {
        return DB::transaction(function () use ($data, $user): Experiment {
            $code = CodeGeneratorService::next(Experiment::class, 'EXP', 'experiment_code');

            $experiment = Experiment::create([
                'experiment_code' => $code,
                'plant_species_id' => $data['plant_species_id'] ?? null,
                'species_name' => $data['species_name'],
                'common_name' => $data['common_name'],
                'title' => $data['title'],
                'objective' => $data['objective'] ?? null,
                'propagation_method' => $data['propagation_method'],
                'growth_medium' => $data['growth_medium'] ?? null,
                'environment' => $data['environment'] ?? null,
                'initial_seed_count' => $data['initial_seed_count'],
                'current_count' => 0,
                'start_date' => $data['start_date'],
                'expected_end_date' => $data['expected_end_date'] ?? null,
                'status' => ExperimentStatus::PLANNING,
                'image_url' => $data['image_url'] ?? null,
                'created_by' => $user?->id,
            ]);

            // Sync assigned users
            if (! empty($data['assigned_to'])) {
                $this->syncAssignedUsers($experiment, $data['assigned_to']);
            }

            // Sync tags
            if (! empty($data['tags'])) {
                $tagIds = Tag::resolveNames($this->parseCsv($data['tags']));
                $experiment->tags()->sync($tagIds);
            }

            return $experiment->load(['tags', 'assignedUsers']);
        });
    }

    /**
     * Update an existing experiment.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws \App\Exceptions\InvalidStatusTransitionException
     */
    public function update(Experiment $experiment, array $data): Experiment
    {
        return DB::transaction(function () use ($experiment, $data): Experiment {
            // Validate status transition if status is being changed
            if (isset($data['status'])) {
                $newStatus = ExperimentStatus::from($data['status']);

                if ($newStatus !== $experiment->status && ! $experiment->status->canTransitionTo($newStatus)) {
                    throw new \App\Exceptions\InvalidStatusTransitionException(
                        $experiment->status->value,
                        $newStatus->value,
                    );
                }

                // If completing, auto-set actual_end_date
                if ($newStatus === ExperimentStatus::COMPLETED && $experiment->status !== ExperimentStatus::COMPLETED) {
                    $data['actual_end_date'] = $data['actual_end_date'] ?? now()->toDateString();
                }
            }

            $experiment->update(collect($data)->except(['assigned_to', 'tags'])->all());

            if (array_key_exists('assigned_to', $data)) {
                $this->syncAssignedUsers($experiment, $data['assigned_to'] ?? '');
            }

            if (array_key_exists('tags', $data)) {
                $tagIds = Tag::resolveNames($this->parseCsv($data['tags'] ?? ''));
                $experiment->tags()->sync($tagIds);
            }

            return $experiment->load(['tags', 'assignedUsers']);
        });
    }

    /**
     * Soft-delete an experiment.
     */
    public function delete(Experiment $experiment): void
    {
        $experiment->delete();
    }

    /**
     * Dashboard-level statistics.
     *
     * @return array<string, mixed>
     */
    public function getStats(): array
    {
        $experiments = Experiment::query();

        return [
            'total' => (clone $experiments)->count(),
            'active' => (clone $experiments)->active()->count(),
            'completed' => (clone $experiments)->completed()->count(),
            'planning' => (clone $experiments)->byStatus(ExperimentStatus::PLANNING)->count(),
            'total_seedlings' => (int) Experiment::sum('current_count'),
            'avg_survival_rate' => round((float) Experiment::whereNotNull('avg_survival_rate')->avg('avg_survival_rate'), 2),
            'avg_multiplication_rate' => round((float) Experiment::whereNotNull('multiplication_rate')->avg('multiplication_rate'), 2),
            'species_count' => Experiment::distinct('plant_species_id')->count('plant_species_id'),
        ];
    }

    // ─── Private Helpers ─────────────────────────────────────────────────────

    /**
     * Sync assigned users from a CSV string of user names or IDs.
     */
    private function syncAssignedUsers(Experiment $experiment, string $input): void
    {
        if (empty(trim($input))) {
            $experiment->assignedUsers()->detach();

            return;
        }

        $names = $this->parseCsv($input);
        $userIds = User::whereIn('name', $names)->pluck('id');

        // Also try treating as IDs if no matches found
        if ($userIds->isEmpty()) {
            $numericIds = collect($names)->filter(fn ($n) => is_numeric($n))->map(fn ($n) => (int) $n);
            $userIds = User::whereIn('id', $numericIds)->pluck('id');
        }

        $experiment->assignedUsers()->sync($userIds);
    }
}

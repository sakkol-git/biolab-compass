<?php

declare(strict_types=1);

namespace App\Modules\Research\Services;

use App\Concerns\ParsesCsv;
use App\Exceptions\LockedNotebookException;
use App\Modules\Research\Models\LabNotebook;
use App\Modules\Core\Models\Tag;
use App\Modules\Core\Services\CodeGeneratorService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class LabNotebookService
{
    use ParsesCsv;

    /**
     * Paginated listing with search, experiment filter, lock status.
     */
    public function list(
        ?string $search = null,
        ?int $experimentId = null,
        ?bool $isLocked = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return LabNotebook::query()
            ->with(['tags', 'author', 'experiment'])
            ->search($search)
            ->when($experimentId, fn ($q) => $q->linkedToExperiment($experimentId))
            ->when(! is_null($isLocked), fn ($q) => $isLocked ? $q->locked() : $q->unlocked())
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * Single notebook with all relations.
     */
    public function get(int $id): LabNotebook
    {
        return LabNotebook::with(['tags', 'author', 'experiment'])->findOrFail($id);
    }

    /**
     * Create a new notebook.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, int $userId): LabNotebook
    {
        return DB::transaction(function () use ($data, $userId): LabNotebook {
            $code = CodeGeneratorService::next(LabNotebook::class, 'NB', 'notebook_code');

            $notebook = LabNotebook::create([
                'notebook_code' => $code,
                'title' => $data['title'],
                'content' => $data['content'] ?? '',
                'experiment_id' => $data['experiment_id'] ?? null,
                'author_id' => $userId,
                'is_locked' => false,
            ]);

            if (! empty($data['tags'])) {
                $tagIds = Tag::resolveNames($this->parseCsv($data['tags']));
                $notebook->tags()->sync($tagIds);
            }

            return $notebook->load('tags');
        });
    }

    /**
     * Update a notebook (only if unlocked).
     *
     * @param  array<string, mixed>  $data
     *
     * @throws LockedNotebookException
     */
    public function update(LabNotebook $notebook, array $data): LabNotebook
    {
        if (! $notebook->isEditable()) {
            throw new LockedNotebookException;
        }

        return DB::transaction(function () use ($notebook, $data): LabNotebook {
            $notebook->update(collect($data)->except('tags')->all());

            if (array_key_exists('tags', $data)) {
                $tagIds = Tag::resolveNames($this->parseCsv($data['tags'] ?? ''));
                $notebook->tags()->sync($tagIds);
            }

            return $notebook->load('tags');
        });
    }

    /**
     * Toggle the lock status of a notebook.
     */
    public function toggleLock(LabNotebook $notebook): LabNotebook
    {
        $notebook->update(['is_locked' => ! $notebook->is_locked]);

        return $notebook;
    }

    /**
     * Delete a notebook (only if unlocked).
     *
     * @throws LockedNotebookException
     */
    public function delete(LabNotebook $notebook): void
    {
        if (! $notebook->isEditable()) {
            throw new LockedNotebookException;
        }

        $notebook->delete();
    }
}

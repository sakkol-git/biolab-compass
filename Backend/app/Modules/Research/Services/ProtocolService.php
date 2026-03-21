<?php

declare(strict_types=1);

namespace App\Modules\Research\Services;

use App\Concerns\ParsesCsv;
use App\Enums\ProtocolStatus;
use App\Modules\Research\Models\Protocol;
use App\Modules\Core\Models\Tag;
use App\Modules\Core\Services\CodeGeneratorService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ProtocolService
{
    use ParsesCsv;

    /**
     * Paginated listing with search, status filter, category filter.
     */
    public function list(
        ?string $search = null,
        ?string $status = null,
        ?string $category = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return Protocol::query()
            ->with('tags')
            ->search($search)
            ->when($status, fn ($q) => $q->byStatus(ProtocolStatus::from($status)))
            ->when($category, fn ($q) => $q->where('category', $category))
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * Single protocol with all relations.
     */
    public function get(int $id): Protocol
    {
        return Protocol::with(['tags', 'steps', 'experiments', 'author'])->findOrFail($id);
    }

    /**
     * Create a new protocol.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $authorId = null): Protocol
    {
        return DB::transaction(function () use ($data, $authorId): Protocol {
            $code = CodeGeneratorService::next(Protocol::class, 'PRT', 'protocol_code');

            $protocol = Protocol::create([
                'protocol_code' => $code,
                'title' => $data['title'],
                'description' => $data['description'] ?? null,
                'category' => $data['category'],
                'version' => '1.0',
                'status' => ProtocolStatus::from($data['status'] ?? 'draft'),
                'author_id' => $authorId,
                'author_name' => $data['author_name'] ?? null,
                'steps_count' => (int) ($data['steps_count'] ?? 0),
                'linked_experiments_count' => 0,
                'last_updated' => now()->toDateString(),
            ]);

            if (! empty($data['tags'])) {
                $tagIds = Tag::resolveNames($this->parseCsv($data['tags']));
                $protocol->tags()->sync($tagIds);
            }

            return $protocol->load('tags');
        });
    }

    /**
     * Update a protocol.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Protocol $protocol, array $data): Protocol
    {
        return DB::transaction(function () use ($protocol, $data): Protocol {
            $data['last_updated'] = now()->toDateString();

            $protocol->update(collect($data)->except('tags')->all());

            if (array_key_exists('tags', $data)) {
                $tagIds = Tag::resolveNames($this->parseCsv($data['tags'] ?? ''));
                $protocol->tags()->sync($tagIds);
            }

            return $protocol->load('tags');
        });
    }

    /**
     * Soft-delete a protocol.
     */
    public function delete(Protocol $protocol): void
    {
        $protocol->delete();
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Research\Models;

use App\Concerns\HasActivityLogging;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Core\Models\User;
use App\Concerns\EscapesSearchTerm;
use App\Modules\Core\Models\Tag;

class LabNotebook extends Model
{
    use EscapesSearchTerm, HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'notebook_code',
        'title',
        'content',
        'experiment_id',
        'author_id',
        'author_name',
        'is_locked',
    ];

    protected function casts(): array
    {
        return [
            'is_locked' => 'boolean',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function experiment(): BelongsTo
    {
        return $this->belongsTo(Experiment::class);
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
            ->withTimestamps();
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeLocked(Builder $query): void
    {
        $query->where('is_locked', true);
    }

    public function scopeUnlocked(Builder $query): void
    {
        $query->where('is_locked', false);
    }

    public function scopeLinkedToExperiment(Builder $query, ?int $experimentId = null): void
    {
        if ($experimentId) {
            $query->where('experiment_id', $experimentId);
        } else {
            $query->whereNotNull('experiment_id');
        }
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        if (! $term) {
            return;
        }

        $escaped = $this->escapeLike($term);

        $query->where(function (Builder $q) use ($escaped): void {
            $q->where('title', 'like', "%{$escaped}%")
                ->orWhere('notebook_code', 'like', "%{$escaped}%")
                ->orWhere('author_name', 'like', "%{$escaped}%");
        });
    }

    // ─── Computed ────────────────────────────────────────────────────────────

    public function isEditable(): bool
    {
        return ! $this->is_locked;
    }
}

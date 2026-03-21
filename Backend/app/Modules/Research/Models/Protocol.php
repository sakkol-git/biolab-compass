<?php

declare(strict_types=1);

namespace App\Modules\Research\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\ProtocolStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Core\Models\User;
use App\Concerns\EscapesSearchTerm;
use App\Modules\Core\Models\Tag;

class Protocol extends Model
{
    use EscapesSearchTerm, HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'protocol_code',
        'title',
        'description',
        'category',
        'version',
        'status',
        'author_id',
        'author_name',
        'last_updated',
    ];

    protected function casts(): array
    {
        return [
            'status' => ProtocolStatus::class,
            'last_updated' => 'date',
        ];
    }

    // ─── Computed Attributes ─────────────────────────────────────────────────

    public function getStepsCountAttribute(): int
    {
        return $this->steps()->count();
    }

    public function getLinkedExperimentsCountAttribute(): int
    {
        return $this->experiments()->count();
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function steps(): HasMany
    {
        return $this->hasMany(ProtocolStep::class)->orderBy('step_number');
    }

    public function experiments(): BelongsToMany
    {
        return $this->belongsToMany(Experiment::class, 'experiment_protocol')
            ->withTimestamps();
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
            ->withTimestamps();
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeActive(Builder $query): void
    {
        $query->where('status', ProtocolStatus::ACTIVE);
    }

    public function scopeByStatus(Builder $query, ProtocolStatus $status): void
    {
        $query->where('status', $status);
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        if (! $term) {
            return;
        }

        $escaped = $this->escapeLike($term);

        $query->where(function (Builder $q) use ($escaped): void {
            $q->where('title', 'like', "%{$escaped}%")
                ->orWhere('protocol_code', 'like', "%{$escaped}%")
                ->orWhere('category', 'like', "%{$escaped}%");
        });
    }
}

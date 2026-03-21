<?php

declare(strict_types=1);

namespace App\Modules\Research\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\ExperimentStatus;
use App\Enums\PropagationMethod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Inventory\Models\PlantSpecies;
use App\Modules\Core\Models\User;
use App\Concerns\EscapesSearchTerm;
use App\Modules\Core\Models\Tag;

class Experiment extends Model
{
    use EscapesSearchTerm, HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'experiment_code',
        'plant_species_id',
        'species_name',
        'common_name',
        'species_snapshot',
        'title',
        'objective',
        'propagation_method',
        'growth_medium',
        'environment',
        'initial_seed_count',
        'current_count',
        'final_yield',
        'avg_survival_rate',
        'multiplication_rate',
        'start_date',
        'expected_end_date',
        'actual_end_date',
        'status',
        'image_url',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'status' => ExperimentStatus::class,
            'propagation_method' => PropagationMethod::class,
            'species_snapshot' => 'array',
            'start_date' => 'date',
            'expected_end_date' => 'date',
            'actual_end_date' => 'date',
            'avg_survival_rate' => 'decimal:2',
            'multiplication_rate' => 'decimal:2',
            'initial_seed_count' => 'integer',
            'current_count' => 'integer',
            'final_yield' => 'integer',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function species(): BelongsTo
    {
        return $this->belongsTo(PlantSpecies::class, 'plant_species_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignedUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'experiment_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    public function growthLogs(): HasMany
    {
        return $this->hasMany(GrowthLog::class);
    }

    public function protocols(): BelongsToMany
    {
        return $this->belongsToMany(Protocol::class, 'experiment_protocol')
            ->withTimestamps();
    }

    public function notebooks(): HasMany
    {
        return $this->hasMany(LabNotebook::class);
    }

    public function materials(): HasMany
    {
        return $this->hasMany(ExperimentMaterial::class);
    }

    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable')
            ->withTimestamps();
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeActive(Builder $query): void
    {
        $query->where('status', ExperimentStatus::ACTIVE);
    }

    public function scopeCompleted(Builder $query): void
    {
        $query->where('status', ExperimentStatus::COMPLETED);
    }

    public function scopeByStatus(Builder $query, ExperimentStatus $status): void
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
                ->orWhere('experiment_code', 'like', "%{$escaped}%")
                ->orWhere('species_name', 'like', "%{$escaped}%")
                ->orWhere('common_name', 'like', "%{$escaped}%");
        });
    }

    // ─── Computed ────────────────────────────────────────────────────────────

    /**
     * Get the latest growth log for this experiment.
     */
    public function latestGrowthLog(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(GrowthLog::class)->latestOfMany('week_number');
    }
}

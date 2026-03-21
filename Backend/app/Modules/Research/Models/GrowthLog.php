<?php

declare(strict_types=1);

namespace App\Modules\Research\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\GrowthStage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Core\Models\User;

class GrowthLog extends Model
{
    use HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'experiment_id',
        'recorded_by',
        'week_number',
        'log_date',
        'growth_stage',
        'seedling_count',
        'alive_count',
        'dead_count',
        'new_propagations',
        'survival_rate_pct',
        'multiplication_rate',
        'health_score',
        'avg_height_cm',
        'photo_urls',
        'environmental_data',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'growth_stage' => GrowthStage::class,
            'log_date' => 'date',
            'week_number' => 'integer',
            'seedling_count' => 'integer',
            'alive_count' => 'integer',
            'dead_count' => 'integer',
            'new_propagations' => 'integer',
            'survival_rate_pct' => 'decimal:2',
            'multiplication_rate' => 'decimal:2',
            'health_score' => 'decimal:1',
            'avg_height_cm' => 'decimal:2',
            'photo_urls' => 'array',
            'environmental_data' => 'array',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function experiment(): BelongsTo
    {
        return $this->belongsTo(Experiment::class);
    }

    public function recorder(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recorded_by');
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeForExperiment(Builder $query, int $experimentId): void
    {
        $query->where('experiment_id', $experimentId);
    }

    public function scopeByStage(Builder $query, GrowthStage $stage): void
    {
        $query->where('growth_stage', $stage);
    }

    public function scopeOrderedByWeek(Builder $query): void
    {
        $query->orderBy('week_number', 'asc');
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Models;

use Database\Factories\ChemicalUsageLogFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Core\Models\User;
use App\Modules\Research\Models\Experiment;

class ChemicalUsageLog extends Model
{
    /** @use HasFactory<ChemicalUsageLogFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'chemical_usage_logs';

    protected $fillable = [
        'chemical_id',
        'chemical_batch_id',
        'user_id',
        'quantity_used',
        'unit',
        'purpose',
        'experiment_name',
        'experiment_id',
        'used_at',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'quantity_used' => 'decimal:2',
            'used_at' => 'datetime',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function chemical(): BelongsTo
    {
        return $this->belongsTo(Chemical::class);
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(ChemicalBatch::class, 'chemical_batch_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function experiment(): BelongsTo
    {
        return $this->belongsTo(Experiment::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeForChemical(Builder $query, int $chemicalId): void
    {
        $query->where('chemical_id', $chemicalId);
    }

    public function scopeForUser(Builder $query, int $userId): void
    {
        $query->where('user_id', $userId);
    }

    public function scopeRecent(Builder $query, int $days = 30): void
    {
        $query->where('used_at', '>=', now()->subDays($days));
    }

    public function scopeBetweenDates(Builder $query, string $from, string $to): void
    {
        $query->whereBetween('used_at', [$from, $to]);
    }
}

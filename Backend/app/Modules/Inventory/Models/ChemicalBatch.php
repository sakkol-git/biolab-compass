<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Models;

use App\Concerns\HasActivityLogging;
use App\Concerns\HasTransactions;
use Database\Factories\ChemicalBatchFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChemicalBatch extends Model
{
    /** @use HasFactory<ChemicalBatchFactory> */
    use HasActivityLogging, HasFactory, HasTransactions, SoftDeletes;

    protected $table = 'chemical_batches';

    protected $fillable = [
        'chemical_id',
        'batch_number',
        'quantity',
        'unit',
        'expiry_date',
        'supplier_name',
        'supplier_contact',
        'received_at',
        'cost_per_unit',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'expiry_date' => 'date',
            'received_at' => 'date',
            'quantity' => 'integer',
            'cost_per_unit' => 'decimal:2',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function chemical(): BelongsTo
    {
        return $this->belongsTo(Chemical::class);
    }

    public function usageLogs(): HasMany
    {
        return $this->hasMany(ChemicalUsageLog::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeAvailable(Builder $query): void
    {
        $query->where('quantity', '>', 0)
            ->where(function (Builder $q): void {
                $q->whereNull('expiry_date')
                    ->orWhere('expiry_date', '>', now());
            });
    }

    public function scopeExpiringSoon(Builder $query, int $days = 30): void
    {
        $query->whereNotNull('expiry_date')
            ->whereBetween('expiry_date', [now(), now()->addDays($days)]);
    }

    public function scopeExpired(Builder $query): void
    {
        $query->whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now());
    }

    public function scopeForChemical(Builder $query, int $chemicalId): void
    {
        $query->where('chemical_id', $chemicalId);
    }

    // ─── Computed ────────────────────────────────────────────────────────────

    public function getIsExpiredAttribute(): bool
    {
        return $this->expiry_date !== null && $this->expiry_date->isPast();
    }

    public function getRemainingQuantityAttribute(): int
    {
        $used = $this->usageLogs()->sum('quantity_used');

        return max(0, $this->quantity - (int) $used);
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Business\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\ContractStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Inventory\Models\PlantSpecies;
use App\Concerns\EscapesSearchTerm;
use App\Modules\Core\Models\User;

class Contract extends Model
{
    use EscapesSearchTerm, HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_code',
        'client_id',
        'plant_species_id',
        'common_name',
        'species_snapshot',
        'managed_by',
        'status',
        'contract_date',
        'delivery_deadline',
        'actual_delivery_date',
        'quantity_ordered',
        'unit_price',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => ContractStatus::class,
            'species_snapshot' => 'array',
            'contract_date' => 'date',
            'delivery_deadline' => 'date',
            'actual_delivery_date' => 'date',
            'quantity_ordered' => 'integer',
            'quantity_delivered' => 'integer',
            'unit_price' => 'decimal:2',
            'total_value' => 'decimal:2',
            'progress_pct' => 'integer',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function species(): BelongsTo
    {
        return $this->belongsTo(PlantSpecies::class, 'plant_species_id');
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(User::class, 'managed_by');
    }

    public function milestones(): HasMany
    {
        return $this->hasMany(ContractMilestone::class)->orderBy('target_date');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeByStatus(Builder $query, ContractStatus $status): void
    {
        $query->where('status', $status);
    }

    public function scopeActiveContracts(Builder $query): void
    {
        $query->whereNotIn('status', [
            ContractStatus::CANCELLED,
            ContractStatus::DELIVERED,
        ]);
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        if (! $term) {
            return;
        }

        $escaped = $this->escapeLike($term);

        $query->where(function (Builder $q) use ($escaped): void {
            $q->where('contract_code', 'like', "%{$escaped}%")
                ->orWhere('common_name', 'like', "%{$escaped}%")
                ->orWhereHas('client', fn (Builder $cq) => $cq->where('company_name', 'like', "%{$escaped}%"));
        });
    }

    // ─── Computed ────────────────────────────────────────────────────────────

    /**
     * Total amount received for this contract.
     */
    public function totalPaid(): float
    {
        return (float) $this->payments()
            ->where('status', 'received')
            ->sum('amount');
    }

    /**
     * Total amount still pending.
     */
    public function totalPending(): float
    {
        return (float) $this->total_value - $this->totalPaid();
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Business\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\MilestoneStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContractMilestone extends Model
{
    use HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_id',
        'title',
        'target_date',
        'actual_date',
        'projected_count',
        'actual_count',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'status' => MilestoneStatus::class,
            'target_date' => 'date',
            'actual_date' => 'date',
            'projected_count' => 'integer',
            'actual_count' => 'integer',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeByStatus(Builder $query, MilestoneStatus $status): void
    {
        $query->where('status', $status);
    }

    public function scopeCompleted(Builder $query): void
    {
        $query->where('status', MilestoneStatus::COMPLETED);
    }

    public function scopeOverdue(Builder $query): void
    {
        $query->where('status', MilestoneStatus::MISSED);
    }

    public function scopeAtRisk(Builder $query): void
    {
        $query->where('status', MilestoneStatus::AT_RISK);
    }
}

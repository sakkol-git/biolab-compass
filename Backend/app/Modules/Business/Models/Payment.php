<?php

declare(strict_types=1);

namespace App\Modules\Business\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Concerns\EscapesSearchTerm;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use EscapesSearchTerm, HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'contract_id',
        'reference_number',
        'amount',
        'payment_type',
        'status',
        'due_date',
        'payment_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => PaymentStatus::class,
            'payment_type' => PaymentType::class,
            'payment_date' => 'date',
            'due_date' => 'date',
            'amount' => 'decimal:2',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeByStatus(Builder $query, PaymentStatus $status): void
    {
        $query->where('status', $status);
    }

    public function scopeReceived(Builder $query): void
    {
        $query->where('status', PaymentStatus::RECEIVED);
    }

    public function scopePending(Builder $query): void
    {
        $query->where('status', PaymentStatus::PENDING);
    }

    public function scopeOverdue(Builder $query): void
    {
        $query->where('status', PaymentStatus::OVERDUE);
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        if (! $term) {
            return;
        }

        $escaped = $this->escapeLike($term);

        $query->where(function (Builder $q) use ($escaped): void {
            $q->where('reference_number', 'like', "%{$escaped}%")
                ->orWhereHas('contract', function (Builder $cq) use ($escaped): void {
                    $cq->where('contract_code', 'like', "%{$escaped}%")
                        ->orWhereHas('client', fn (Builder $clq) => $clq->where('company_name', 'like', "%{$escaped}%"));
                });
        });
    }
}

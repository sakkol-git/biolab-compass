<?php

declare(strict_types=1);

namespace App\Modules\Business\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\LabServiceStatus;
use App\Enums\ServicePaymentStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Concerns\EscapesSearchTerm;
use Illuminate\Database\Eloquent\SoftDeletes;

class LabService extends Model
{
    use EscapesSearchTerm, HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'service_code',
        'service_title',
        'service_description',
        'client_id',
        'client_name',
        'client_contact',
        'status',
        'payment_status',
        'start_date',
        'end_date',
        'service_fee',
        'assigned_staff',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => LabServiceStatus::class,
            'payment_status' => ServicePaymentStatus::class,
            'start_date' => 'date',
            'end_date' => 'date',
            'service_fee' => 'decimal:2',
            'assigned_staff' => 'array',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeByStatus(Builder $query, LabServiceStatus $status): void
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
            $q->where('service_title', 'like', "%{$escaped}%")
                ->orWhere('service_code', 'like', "%{$escaped}%")
                ->orWhere('client_name', 'like', "%{$escaped}%")
                ->orWhere('service_description', 'like', "%{$escaped}%");
        });
    }
}

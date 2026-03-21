<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\MaintenanceType;
use Database\Factories\MaintenanceRecordFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Core\Models\User;

class MaintenanceRecord extends Model
{
    /** @use HasFactory<MaintenanceRecordFactory> */
    use HasActivityLogging, HasFactory, SoftDeletes;

    protected $table = 'maintenance_records';

    protected $fillable = [
        'equipment_id',
        'performed_by',
        'maintenance_type',
        'description',
        'technician_name',
        'technician_contact',
        'cost',
        'started_at',
        'completed_at',
        'next_service_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'maintenance_type' => MaintenanceType::class,
            'cost' => 'decimal:2',
            'started_at' => 'date',
            'completed_at' => 'date',
            'next_service_date' => 'date',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeForEquipment(Builder $query, int $equipmentId): void
    {
        $query->where('equipment_id', $equipmentId);
    }

    public function scopeUpcoming(Builder $query, int $days = 30): void
    {
        $query->whereNotNull('next_service_date')
            ->whereBetween('next_service_date', [now(), now()->addDays($days)]);
    }

    public function scopeOverdue(Builder $query): void
    {
        $query->whereNotNull('next_service_date')
            ->where('next_service_date', '<', now());
    }

    public function scopeOfType(Builder $query, MaintenanceType $type): void
    {
        $query->where('maintenance_type', $type);
    }

    // ─── Computed ────────────────────────────────────────────────────────────

    public function getIsOverdueAttribute(): bool
    {
        return $this->next_service_date !== null && $this->next_service_date->isPast();
    }

    public function getIsCompletedAttribute(): bool
    {
        return $this->completed_at !== null;
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Models;

use App\Concerns\HasActivityLogging;
use App\Concerns\HasImageUpload;
use App\Concerns\HasTransactions;
use App\Enums\EquipmentCategory;
use App\Enums\EquipmentCondition;
use App\Enums\EquipmentStatus;
use Database\Factories\EquipmentFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Concerns\EscapesSearchTerm;
use Illuminate\Database\Eloquent\SoftDeletes;

class Equipment extends Model
{
    /** @use HasFactory<EquipmentFactory> */
    use EscapesSearchTerm, HasActivityLogging, HasFactory, HasImageUpload, HasTransactions, SoftDeletes;

    protected $table = 'equipment';

    protected $fillable = [
        'equipment_name',
        'equipment_code',
        'category',
        'status',
        'condition',
        'location',
        'manufacturer',
        'model_name',
        'serial_number',
        'purchase_date',
        'purchase_price',
        'description',
        'image_url',
        'image_path',
    ];

    protected function casts(): array
    {
        return [
            'category' => EquipmentCategory::class,
            'status' => EquipmentStatus::class,
            'condition' => EquipmentCondition::class,
            'purchase_date' => 'date',
            'purchase_price' => 'decimal:2',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function maintenanceRecords(): HasMany
    {
        return $this->hasMany(MaintenanceRecord::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeAvailable(Builder $query): void
    {
        $query->where('status', EquipmentStatus::AVAILABLE)
            ->where('condition', '!=', EquipmentCondition::BROKEN);
    }

    public function scopeBorrowed(Builder $query): void
    {
        $query->where('status', EquipmentStatus::BORROWED);
    }

    public function scopeUnderMaintenance(Builder $query): void
    {
        $query->where('status', EquipmentStatus::UNDER_MAINTENANCE);
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        if (! $term) {
            return;
        }

        $escaped = $this->escapeLike($term);

        $query->where(function (Builder $q) use ($escaped): void {
            $q->where('equipment_name', 'like', "%{$escaped}%")
                ->orWhere('equipment_code', 'like', "%{$escaped}%")
                ->orWhere('serial_number', 'like', "%{$escaped}%");
        });
    }

    // ─── Computed ────────────────────────────────────────────────────────────

    public function getIsBorrowableAttribute(): bool
    {
        return $this->status === EquipmentStatus::AVAILABLE
            && $this->condition !== EquipmentCondition::BROKEN;
    }
}

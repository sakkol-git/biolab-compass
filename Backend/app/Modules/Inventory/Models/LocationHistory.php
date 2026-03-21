<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Models;

use App\Modules\Core\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Tracks location movements of inventory items (equipment, samples).
 * Supports compliance and traceability requirements.
 */
class LocationHistory extends Model
{
    protected $table = 'location_history';

    protected $fillable = [
        'entity_type',
        'entity_id',
        'from_location',
        'to_location',
        'moved_by',
        'moved_at',
        'reason',
    ];

    protected function casts(): array
    {
        return [
            'moved_at' => 'datetime',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function entity(): MorphTo
    {
        return $this->morphTo();
    }

    public function mover(): BelongsTo
    {
        return $this->belongsTo(User::class, 'moved_by');
    }
}

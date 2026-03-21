<?php

declare(strict_types=1);

namespace App\Modules\Research\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProtocolStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'protocol_id',
        'step_number',
        'title',
        'description',
        'duration_minutes',
        'materials',
    ];

    protected function casts(): array
    {
        return [
            'step_number' => 'integer',
            'duration_minutes' => 'integer',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function protocol(): BelongsTo
    {
        return $this->belongsTo(Protocol::class);
    }
}

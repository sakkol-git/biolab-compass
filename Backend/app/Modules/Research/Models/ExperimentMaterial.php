<?php

declare(strict_types=1);

namespace App\Modules\Research\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * Tracks materials (chemicals, stocks, samples) consumed or produced by experiments.
 * Bridges the Research and Inventory modules.
 */
class ExperimentMaterial extends Model
{
    use HasFactory;

    protected $table = 'experiment_materials';

    protected $fillable = [
        'experiment_id',
        'materialable_type',
        'materialable_id',
        'quantity_used',
        'unit',
        'purpose',
        'usage_type',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'quantity_used' => 'decimal:2',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function experiment(): BelongsTo
    {
        return $this->belongsTo(Experiment::class);
    }

    public function materialable(): MorphTo
    {
        return $this->morphTo();
    }
}

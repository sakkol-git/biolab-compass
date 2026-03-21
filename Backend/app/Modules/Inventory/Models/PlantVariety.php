<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Models;

use App\Concerns\HasActivityLogging;
use App\Concerns\HasImageUpload;
use App\Concerns\HasTransactions;
use Database\Factories\PlantVarietyFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Concerns\EscapesSearchTerm;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlantVariety extends Model
{
    /** @use HasFactory<PlantVarietyFactory> */
    use EscapesSearchTerm, HasActivityLogging, HasFactory, HasImageUpload, HasTransactions, SoftDeletes;

    protected $table = 'plant_varieties';

    protected $fillable = [
        'plant_species_id',
        'name',
        'variety_code',
        'description',
        'image_url',
        'image_path',
    ];

    // ─── Relationships ───────────────────────────────────────────────────────

    /**
     * The parent species.
     */
    public function plantSpecies(): BelongsTo
    {
        return $this->belongsTo(PlantSpecies::class, 'plant_species_id');
    }

    public function samples(): HasMany
    {
        return $this->hasMany(PlantSample::class, 'plant_variety_id');
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(PlantStock::class, 'plant_variety_id');
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeSearch(Builder $query, ?string $term): void
    {
        if (! $term) {
            return;
        }

        $escaped = $this->escapeLike($term);

        $query->where(function (Builder $q) use ($escaped): void {
            $q->where('name', 'like', "%{$escaped}%")
                ->orWhere('variety_code', 'like', "%{$escaped}%");
        });
    }
}

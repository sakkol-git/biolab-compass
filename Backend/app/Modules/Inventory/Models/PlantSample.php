<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Models;

use App\Concerns\HasActivityLogging;
use App\Concerns\HasImageUpload;
use App\Concerns\HasTransactions;
use App\Enums\LabLocation;
use App\Enums\SampleStatus;
use Database\Factories\PlantSampleFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Concerns\EscapesSearchTerm;
use App\Modules\Core\Models\User;

class PlantSample extends Model
{
    /** @use HasFactory<PlantSampleFactory> */
    use EscapesSearchTerm, HasActivityLogging, HasFactory, HasImageUpload, HasTransactions, SoftDeletes;

    protected $table = 'plant_samples';

    protected $fillable = [
        'plant_species_id',
        'plant_variety_id',
        'contributor_id',
        'sample_name',
        'sample_code',
        'owner_name',
        'department',
        'origin_location',
        'brought_at',
        'lab_location',
        'status',
        'description',
        'image_url',
        'image_path',
        'quantity',
    ];

    protected function casts(): array
    {
        return [
            'brought_at' => 'date',
            'lab_location' => LabLocation::class,
            'status' => SampleStatus::class,
            'quantity' => 'integer',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function species(): BelongsTo
    {
        return $this->belongsTo(PlantSpecies::class, 'plant_species_id');
    }

    public function variety(): BelongsTo
    {
        return $this->belongsTo(PlantVariety::class, 'plant_variety_id');
    }

    public function contributor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'contributor_id');
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(PlantStock::class, 'plant_sample_id');
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeAvailable(Builder $query): void
    {
        $query->where('status', SampleStatus::ACTIVE);
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        if (! $term) {
            return;
        }

        $escaped = $this->escapeLike($term);

        $query->where(function (Builder $q) use ($escaped): void {
            $q->where('sample_name', 'like', "%{$escaped}%")
                ->orWhere('sample_code', 'like', "%{$escaped}%");
        });
    }
}

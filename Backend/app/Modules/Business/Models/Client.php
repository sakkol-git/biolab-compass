<?php

declare(strict_types=1);

namespace App\Modules\Business\Models;

use App\Concerns\HasActivityLogging;
use App\Enums\ClientType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Concerns\EscapesSearchTerm;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use EscapesSearchTerm, HasActivityLogging, HasFactory, SoftDeletes;

    protected $fillable = [
        'client_code',
        'company_name',
        'contact_name',
        'contact_email',
        'contact_phone',
        'address',
        'client_type',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'client_type' => ClientType::class,
            'total_contracts' => 'integer',
            'total_value' => 'decimal:2',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }

    // ─── Scopes ──────────────────────────────────────────────────────────────

    public function scopeByType(Builder $query, ClientType $type): void
    {
        $query->where('client_type', $type);
    }

    public function scopeSearch(Builder $query, ?string $term): void
    {
        if (! $term) {
            return;
        }

        $escaped = $this->escapeLike($term);

        $query->where(function (Builder $q) use ($escaped): void {
            $q->where('company_name', 'like', "%{$escaped}%")
                ->orWhere('contact_name', 'like', "%{$escaped}%");
        });
    }

    // ─── Counter Cache Helpers ───────────────────────────────────────────────

    /**
     * Recalculate counter caches from actual contract data.
     */
    public function recalculateCounters(): void
    {
        $this->update([
            'total_contracts' => $this->contracts()->count(),
            'total_value' => $this->contracts()->sum('total_value'),
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Business\Models;

use App\Concerns\HasActivityLogging;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Modules\Inventory\Models\PlantSpecies;
use App\Modules\Core\Models\User;

class ProductionForecast extends Model
{
    use HasActivityLogging, HasFactory;

    protected $fillable = [
        'plant_species_id',
        'contract_id',
        'calculated_by',
        'desired_quantity',
        'recommended_initial_stock',
        'estimated_weeks',
        'confidence_lower_weeks',
        'confidence_upper_weeks',
        'estimated_cycles',
        'estimated_survival_rate',
        'estimated_multiplication_rate',
        'weekly_milestones',
        'resource_requirements',
    ];

    protected function casts(): array
    {
        return [
            'desired_quantity' => 'integer',
            'recommended_initial_stock' => 'integer',
            'estimated_weeks' => 'integer',
            'confidence_lower_weeks' => 'integer',
            'confidence_upper_weeks' => 'integer',
            'estimated_cycles' => 'integer',
            'estimated_survival_rate' => 'decimal:2',
            'estimated_multiplication_rate' => 'decimal:2',
            'weekly_milestones' => 'array',
            'resource_requirements' => 'array',
        ];
    }

    // ─── Relationships ───────────────────────────────────────────────────────

    public function species(): BelongsTo
    {
        return $this->belongsTo(PlantSpecies::class, 'plant_species_id');
    }

    public function contract(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Business\Models\Contract::class);
    }

    public function calculator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'calculated_by');
    }
}

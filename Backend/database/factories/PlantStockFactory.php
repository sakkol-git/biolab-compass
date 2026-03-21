<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\StockStatus;
use App\Models\PlantSpecies;
use App\Models\PlantStock;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PlantStock>
 */
class PlantStockFactory extends Factory
{
    public function definition(): array
    {
        $quantity = $this->faker->numberBetween(0, 200);
        // reserved is always <= quantity — invariant enforced at factory level too
        $reserved = $this->faker->numberBetween(0, $quantity);

        return [
            'plant_species_id' => PlantSpecies::factory(),
            'plant_variety_id' => null,
            'plant_sample_id' => null,
            'quantity' => $quantity,
            'reserved_quantity' => $reserved,
            'status' => $this->faker->randomElement(StockStatus::cases())->value,
        ];
    }
}

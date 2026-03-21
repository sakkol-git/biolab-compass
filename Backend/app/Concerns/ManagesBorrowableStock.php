<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Enums\EquipmentStatus;
use App\Enums\SampleStatus;
use App\Enums\StockStatus;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\ItemNotBorrowableException;
use App\Modules\Inventory\Models\Chemical;
use App\Modules\Inventory\Models\Equipment;
use App\Modules\Inventory\Models\PlantSample;
use App\Modules\Inventory\Models\PlantStock;
use Illuminate\Database\Eloquent\Model;

/**
 * Polymorphic stock-management helpers used by BorrowService.
 *
 * Extracts assertBorrowable / decrementStock / incrementStock so the
 * service stays focused on orchestrating the borrow-return lifecycle.
 */
trait ManagesBorrowableStock
{
    private function assertBorrowable(Model $item, int $quantity): void
    {
        if ($item instanceof Equipment) {
            if (! $item->is_borrowable) {
                throw new ItemNotBorrowableException(
                    "Equipment '{$item->equipment_name}' is not available for borrowing (status: {$item->status->value})."
                );
            }
        } elseif ($item instanceof Chemical) {
            if ($item->quantity < $quantity) {
                throw new InsufficientStockException(
                    requested: $quantity,
                    available: $item->quantity,
                );
            }
            if ($item->is_expired) {
                throw new ItemNotBorrowableException('Cannot borrow expired chemicals.');
            }
        } elseif ($item instanceof PlantSample) {
            if ($item->status !== SampleStatus::ACTIVE) {
                throw new ItemNotBorrowableException(
                    "Plant sample '{$item->sample_name}' is not active (status: {$item->status->value})."
                );
            }
            if ($item->quantity < $quantity) {
                throw new InsufficientStockException(
                    requested: $quantity,
                    available: $item->quantity,
                );
            }
        } elseif ($item instanceof PlantStock) {
            if ($item->status !== StockStatus::AVAILABLE) {
                throw new ItemNotBorrowableException(
                    "Plant stock #{$item->getKey()} is not available (status: {$item->status->value})."
                );
            }
            if ($item->available_quantity < $quantity) {
                throw new InsufficientStockException(
                    requested: $quantity,
                    available: $item->available_quantity,
                );
            }
        } else {
            throw new ItemNotBorrowableException('This item type is not borrowable.');
        }
    }

    private function decrementStock(Model $item, int $quantity): void
    {
        if ($item instanceof Equipment) {
            $item->update(['status' => EquipmentStatus::BORROWED]);
        } elseif ($item instanceof Chemical) {
            $item->decrement('quantity', $quantity);
        } elseif ($item instanceof PlantSample) {
            $item->decrement('quantity', $quantity);
        } elseif ($item instanceof PlantStock) {
            $item->increment('reserved_quantity', $quantity);
        }
    }

    private function incrementStock(Model $item, int $quantity): void
    {
        if ($item instanceof Equipment) {
            $item->update(['status' => EquipmentStatus::AVAILABLE]);
        } elseif ($item instanceof Chemical) {
            $item->increment('quantity', $quantity);
        } elseif ($item instanceof PlantSample) {
            $item->increment('quantity', $quantity);
        } elseif ($item instanceof PlantStock) {
            $item->decrement('reserved_quantity', $quantity);
        }
    }
}

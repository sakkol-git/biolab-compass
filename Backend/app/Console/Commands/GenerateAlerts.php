<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Modules\Core\Models\User;
use App\Modules\Inventory\Models\Equipment;
use App\Modules\Inventory\Models\MaintenanceRecord;
use App\Modules\Inventory\Models\PlantStock;
use Illuminate\Console\Command;

/**
 * WF-05: Generate daily notifications for maintenance, low stock, etc.
 */
class GenerateAlerts extends Command
{
    protected $signature = 'notifications:generate-alerts';

    protected $description = 'Generate daily notification alerts for maintenance, low stock, and other events';

    public function handle(): int
    {
        $alertCount = 0;
        $managers = User::role(['admin', 'lab-manager'], 'api')->get();

        // 1. Overdue maintenance records
        $overdueMaintenances = MaintenanceRecord::query()
            ->whereNotNull('next_service_date')
            ->where('next_service_date', '<', now())
            ->with('equipment')
            ->get();

        foreach ($overdueMaintenances as $record) {
            $equipmentName = $record->equipment?->equipment_name ?? 'Unknown';
            foreach ($managers as $manager) {
                $manager->notifications()->create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'type' => 'App\\Notifications\\MaintenanceOverdueNotification',
                    'data' => [
                        'type' => 'maintenance_overdue',
                        'title' => 'Maintenance Overdue',
                        'message' => "Maintenance for {$equipmentName} is overdue (due: {$record->next_service_date->toDateString()}).",
                        'equipment_id' => $record->equipment_id,
                        'maintenance_record_id' => $record->id,
                    ],
                ]);
            }
            $alertCount++;
        }

        // 2. Low stock warnings (threshold: 10)
        $lowStockItems = PlantStock::query()
            ->where('quantity', '<=', 10)
            ->where('quantity', '>', 0)
            ->with('species')
            ->get();

        foreach ($lowStockItems as $stock) {
            $speciesName = $stock->species?->common_name ?? 'Unknown';
            foreach ($managers as $manager) {
                $manager->notifications()->create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'type' => 'App\\Notifications\\LowStockNotification',
                    'data' => [
                        'type' => 'low_stock',
                        'title' => 'Low Stock Warning',
                        'message' => "{$speciesName} stock is low (quantity: {$stock->quantity}).",
                        'plant_stock_id' => $stock->id,
                        'quantity' => $stock->quantity,
                    ],
                ]);
            }
            $alertCount++;
        }

        // 3. Upcoming maintenance (within 7 days)
        $upcomingMaintenances = MaintenanceRecord::query()
            ->whereNotNull('next_service_date')
            ->whereBetween('next_service_date', [now(), now()->addDays(7)])
            ->with('equipment')
            ->get();

        foreach ($upcomingMaintenances as $record) {
            $equipmentName = $record->equipment?->equipment_name ?? 'Unknown';
            foreach ($managers as $manager) {
                $manager->notifications()->create([
                    'id' => \Illuminate\Support\Str::uuid(),
                    'type' => 'App\\Notifications\\MaintenanceUpcomingNotification',
                    'data' => [
                        'type' => 'maintenance_upcoming',
                        'title' => 'Upcoming Maintenance',
                        'message' => "Maintenance for {$equipmentName} is due on {$record->next_service_date->toDateString()}.",
                        'equipment_id' => $record->equipment_id,
                        'maintenance_record_id' => $record->id,
                    ],
                ]);
            }
            $alertCount++;
        }

        $this->info("Generated {$alertCount} alert notification(s).");

        return self::SUCCESS;
    }
}

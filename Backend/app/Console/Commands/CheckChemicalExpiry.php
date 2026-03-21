<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Modules\Inventory\Models\Chemical;
use App\Modules\Core\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * WF-05: Check for expiring chemicals and generate notifications.
 *
 * Creates database notifications for chemicals expiring in 7, 3, and 1 day(s).
 */
class CheckChemicalExpiry extends Command
{
    protected $signature = 'chemicals:check-expiry';

    protected $description = 'Check for chemicals expiring soon and generate notifications';

    public function handle(): int
    {
        $warnings = [
            7 => 'will expire in 7 days',
            3 => 'will expire in 3 days',
            1 => 'expires tomorrow',
        ];

        $totalNotifications = 0;
        $managers = User::role(['admin', 'lab-manager'], 'api')->get();

        foreach ($warnings as $days => $message) {
            $expiringChemicals = Chemical::query()
                ->whereNotNull('expiry_date')
                ->whereDate('expiry_date', now()->addDays($days)->toDateString())
                ->get();

            foreach ($expiringChemicals as $chemical) {
                $urgency = $days <= 1 ? 'critical' : ($days <= 3 ? 'high' : 'medium');

                foreach ($managers as $manager) {
                    $manager->notifications()->create([
                        'id' => Str::uuid(),
                        'type' => 'App\\Notifications\\ChemicalExpiryNotification',
                        'data' => [
                            'type' => 'chemical_expiry',
                            'title' => 'Chemical Expiry Warning',
                            'message' => "{$chemical->common_name} ({$chemical->chemical_code}) {$message}.",
                            'chemical_id' => $chemical->id,
                            'expiry_date' => $chemical->expiry_date->toDateString(),
                            'urgency' => $urgency,
                        ],
                    ]);
                }

                $totalNotifications++;
            }
        }

        $this->info("Generated {$totalNotifications} chemical expiry notification(s).");

        return self::SUCCESS;
    }
}

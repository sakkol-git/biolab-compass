<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Modules\Inventory\Models\ChemicalBatch;
use App\Modules\Core\Models\User;
use App\Notifications\ExpiryAlertNotification;
use Illuminate\Console\Command;

class CheckChemicalExpiryCommand extends Command
{
    protected $signature = 'lab:check-chemical-expiry {--days=30 : Days threshold for expiring soon}';

    protected $description = 'Check for expired or expiring-soon chemical batches and notify lab managers';

    public function handle(): int
    {
        $days = (int) $this->option('days');

        $expiredBatches = ChemicalBatch::expired()->with('chemical')->get();
        $expiringSoonBatches = ChemicalBatch::expiringSoon($days)->with('chemical')->get();

        if ($expiredBatches->isEmpty() && $expiringSoonBatches->isEmpty()) {
            $this->info('No expired or expiring-soon chemical batches found.');

            return self::SUCCESS;
        }

        // Notify all admins and lab managers
        $notifyUsers = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['admin', 'lab-manager']);
        })->get();

        foreach ($notifyUsers as $user) {
            if ($expiredBatches->isNotEmpty()) {
                $user->notify(new ExpiryAlertNotification(
                    type: 'expired',
                    items: $expiredBatches,
                ));
            }

            if ($expiringSoonBatches->isNotEmpty()) {
                $user->notify(new ExpiryAlertNotification(
                    type: 'expiring_soon',
                    items: $expiringSoonBatches,
                ));
            }
        }

        $this->info("Notified {$notifyUsers->count()} users about {$expiredBatches->count()} expired and {$expiringSoonBatches->count()} expiring-soon batches.");

        return self::SUCCESS;
    }
}

<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Modules\Business\Models\Contract;
use App\Modules\Core\Models\User;
use App\Notifications\ContractDeadlineNotification;
use Illuminate\Console\Command;

class CheckContractDeadlinesCommand extends Command
{
    protected $signature = 'lab:check-contract-deadlines {--days=7 : Days threshold for approaching deadlines}';

    protected $description = 'Notify managers about contracts approaching their delivery deadline';

    public function handle(): int
    {
        $days = (int) $this->option('days');

        // Active contracts with delivery deadline within $days
        $approachingContracts = Contract::with(['client', 'manager'])
            ->activeContracts()
            ->whereNotNull('delivery_deadline')
            ->whereBetween('delivery_deadline', [now(), now()->addDays($days)])
            ->get();

        // Overdue active contracts
        $overdueContracts = Contract::with(['client', 'manager'])
            ->activeContracts()
            ->whereNotNull('delivery_deadline')
            ->where('delivery_deadline', '<', now())
            ->get();

        if ($approachingContracts->isEmpty() && $overdueContracts->isEmpty()) {
            $this->info('No approaching or overdue contract deadlines found.');

            return self::SUCCESS;
        }

        // Notify admins and lab managers
        $managers = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['admin', 'lab-manager']);
        })->get();

        foreach ($managers as $manager) {
            if ($overdueContracts->isNotEmpty()) {
                $manager->notify(new ContractDeadlineNotification(
                    contracts: $overdueContracts,
                    type: 'overdue',
                ));
            }

            if ($approachingContracts->isNotEmpty()) {
                $manager->notify(new ContractDeadlineNotification(
                    contracts: $approachingContracts,
                    type: 'approaching',
                ));
            }
        }

        $this->info(
            "Notified {$managers->count()} managers: "
            ."{$overdueContracts->count()} overdue, "
            ."{$approachingContracts->count()} approaching deadline.",
        );

        return self::SUCCESS;
    }
}

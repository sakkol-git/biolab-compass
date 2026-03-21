<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\ContractStatus;
use App\Events\ContractStatusChanged;
use App\Notifications\ContractDeliveredNotification;
use App\Notifications\ContractSignedNotification;

class HandleContractStatusChange
{
    public function handle(ContractStatusChanged $event): void
    {
        $manager = $event->contract->manager;

        if (! $manager) {
            return;
        }

        match ($event->newStatus) {
            ContractStatus::SIGNED => $manager->notify(
                new ContractSignedNotification($event->contract),
            ),
            ContractStatus::DELIVERED => $manager->notify(
                new ContractDeliveredNotification($event->contract),
            ),
            default => null,
        };
    }
}

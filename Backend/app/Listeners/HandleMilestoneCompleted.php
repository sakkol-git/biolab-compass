<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Events\MilestoneCompleted;
use App\Notifications\MilestoneCompletedNotification;

class HandleMilestoneCompleted
{
    public function handle(MilestoneCompleted $event): void
    {
        $milestone = $event->milestone;
        $contract = $milestone->contract;

        if (! $contract?->manager) {
            return;
        }

        $contract->manager->notify(
            new MilestoneCompletedNotification($milestone),
        );
    }
}

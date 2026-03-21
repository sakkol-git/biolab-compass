<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Enums\ExperimentStatus;
use App\Events\ExperimentStatusChanged;
use App\Notifications\ExperimentCompletedNotification;

class HandleExperimentStatusChange
{
    public function handle(ExperimentStatusChanged $event): void
    {
        // On completion, notify the experiment creator
        if ($event->newStatus === ExperimentStatus::COMPLETED && $event->experiment->creator) {
            $event->experiment->creator->notify(
                new ExperimentCompletedNotification($event->experiment),
            );
        }
    }
}

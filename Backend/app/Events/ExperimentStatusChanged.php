<?php

declare(strict_types=1);

namespace App\Events;

use App\Enums\ExperimentStatus;
use App\Modules\Research\Models\Experiment;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExperimentStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Experiment $experiment,
        public ExperimentStatus $oldStatus,
        public ExperimentStatus $newStatus,
    ) {}
}

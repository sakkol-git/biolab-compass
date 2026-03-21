<?php

declare(strict_types=1);

namespace App\Events;

use App\Modules\Business\Models\ContractMilestone;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MilestoneCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public ContractMilestone $milestone,
    ) {}
}

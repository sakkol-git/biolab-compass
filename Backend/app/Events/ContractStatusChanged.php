<?php

declare(strict_types=1);

namespace App\Events;

use App\Enums\ContractStatus;
use App\Modules\Business\Models\Contract;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ContractStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Contract $contract,
        public ContractStatus $oldStatus,
        public ContractStatus $newStatus,
    ) {}
}

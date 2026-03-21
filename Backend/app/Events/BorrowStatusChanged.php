<?php

declare(strict_types=1);

namespace App\Events;

use App\Modules\Inventory\Models\BorrowRecord;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BorrowStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public BorrowRecord $borrowRecord,
        public string $oldStatus,
        public string $newStatus,
    ) {}
}

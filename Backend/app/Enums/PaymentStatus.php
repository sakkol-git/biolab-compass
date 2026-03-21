<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentStatus: string
{
    case PENDING = 'pending';
    case RECEIVED = 'received';
    case OVERDUE = 'overdue';
    case CANCELLED = 'cancelled';
}

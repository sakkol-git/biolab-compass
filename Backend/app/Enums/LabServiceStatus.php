<?php

declare(strict_types=1);

namespace App\Enums;

enum LabServiceStatus: string
{
    case PENDING = 'pending';
    case IN_PROGRESS = 'in_progress';
    case COMPLETED = 'completed';
    case DELIVERED = 'delivered';
}

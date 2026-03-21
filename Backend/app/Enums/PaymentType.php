<?php

declare(strict_types=1);

namespace App\Enums;

enum PaymentType: string
{
    case DEPOSIT = 'deposit';
    case MILESTONE = 'milestone';
    case FINAL = 'final';
    case REFUND = 'refund';
}

<?php

declare(strict_types=1);

namespace App\Enums;

enum GrowthStage: string
{
    case GERMINATION = 'germination';
    case SEEDLING = 'seedling';
    case VEGETATIVE = 'vegetative';
    case HARDENING = 'hardening';
    case READY = 'ready';
}

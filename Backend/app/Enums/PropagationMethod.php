<?php

declare(strict_types=1);

namespace App\Enums;

enum PropagationMethod: string
{
    case SEED = 'seed';
    case CUTTING = 'cutting';
    case GRAFTING = 'grafting';
    case TISSUE_CULTURE = 'tissue_culture';
}

<?php

declare(strict_types=1);

namespace App\Enums;

enum ClientType: string
{
    case FARM_OWNER = 'farm_owner';
    case INVESTOR = 'investor';
    case GOVERNMENT = 'government';
    case NGO = 'ngo';
    case RESEARCH_PARTNER = 'research_partner';
}

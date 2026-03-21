<?php

declare(strict_types=1);

namespace App\Enums;

use Carbon\Carbon;

enum MilestoneStatus: string
{
    case PENDING = 'pending';
    case ON_TRACK = 'on_track';
    case AT_RISK = 'at_risk';
    case COMPLETED = 'completed';
    case MISSED = 'missed';

    /**
     * Infer milestone status from target date and actual vs projected count.
     * Port of frontend business-rules.ts `inferMilestoneStatus()`.
     */
    public static function infer(
        string $targetDate,
        ?int $actualCount,
        int $projectedCount,
    ): self {
        $today = Carbon::today();
        $target = Carbon::parse($targetDate);

        if ($actualCount !== null && $actualCount >= $projectedCount) {
            return self::COMPLETED;
        }

        if ($target->lt($today) && ($actualCount === null || $actualCount < $projectedCount)) {
            return self::MISSED;
        }

        if ($actualCount !== null && $actualCount < (int) ($projectedCount * 0.7) && $target->gt($today)) {
            return self::AT_RISK;
        }

        if ($target->gt($today)) {
            return self::ON_TRACK;
        }

        return self::PENDING;
    }
}

<?php

declare(strict_types=1);

namespace App\Enums;

enum ExperimentStatus: string
{
    case PLANNING = 'planning';
    case ACTIVE = 'active';
    case PAUSED = 'paused';
    case COMPLETED = 'completed';
    case FAILED = 'failed';

    /**
     * Returns the statuses that are considered terminal (no further transitions).
     *
     * @return self[]
     */
    public static function terminalStatuses(): array
    {
        return [self::COMPLETED, self::FAILED];
    }

    /**
     * Returns the legal transitions from the current status.
     *
     * @return self[]
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::PLANNING => [self::ACTIVE, self::FAILED],
            self::ACTIVE => [self::PAUSED, self::COMPLETED, self::FAILED],
            self::PAUSED => [self::ACTIVE, self::FAILED],
            default => [],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions(), true);
    }

    public function isTerminal(): bool
    {
        return in_array($this, self::terminalStatuses(), true);
    }
}

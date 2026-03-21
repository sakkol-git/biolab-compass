<?php

declare(strict_types=1);

namespace App\Enums;

enum ContractStatus: string
{
    case DRAFT = 'draft';
    case SENT = 'sent';
    case SIGNED = 'signed';
    case IN_PRODUCTION = 'in_production';
    case READY = 'ready';
    case DELIVERED = 'delivered';
    case CANCELLED = 'cancelled';

    /**
     * Returns the statuses that are considered terminal (no further transitions).
     *
     * @return self[]
     */
    public static function terminalStatuses(): array
    {
        return [self::DELIVERED, self::CANCELLED];
    }

    /**
     * Returns the legal transitions from the current status.
     *
     * @return self[]
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::DRAFT => [self::SENT, self::SIGNED, self::CANCELLED],
            self::SENT => [self::SIGNED, self::CANCELLED],
            self::SIGNED => [self::IN_PRODUCTION, self::CANCELLED],
            self::IN_PRODUCTION => [self::READY, self::CANCELLED],
            self::READY => [self::DELIVERED, self::IN_PRODUCTION, self::CANCELLED],
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

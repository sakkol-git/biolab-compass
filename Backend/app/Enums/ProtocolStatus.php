<?php

declare(strict_types=1);

namespace App\Enums;

enum ProtocolStatus: string
{
    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case ARCHIVED = 'archived';

    /**
     * Returns the legal transitions from the current status.
     *
     * @return self[]
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::DRAFT => [self::ACTIVE, self::ARCHIVED],
            self::ACTIVE => [self::ARCHIVED],
            self::ARCHIVED => [self::ACTIVE], // Allow reactivation
            default => [],
        };
    }

    public function canTransitionTo(self $target): bool
    {
        return in_array($target, $this->allowedTransitions(), true);
    }

    public function isTerminal(): bool
    {
        return false; // Protocols can always be reactivated
    }
}

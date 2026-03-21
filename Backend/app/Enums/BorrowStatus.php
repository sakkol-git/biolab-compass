<?php

declare(strict_types=1);

namespace App\Enums;

enum BorrowStatus: string
{
    case PENDING = 'pending';
    case BORROWED = 'borrowed';
    case RETURNED = 'returned';
    case OVERDUE = 'overdue';
    case REJECTED = 'rejected';

    /**
     * Define valid state transitions for borrow workflow.
     *
     * @return array<self>
     */
    public function allowedTransitions(): array
    {
        return match ($this) {
            self::PENDING   => [self::BORROWED, self::REJECTED],
            self::BORROWED  => [self::RETURNED, self::OVERDUE],
            self::OVERDUE   => [self::RETURNED],
            default         => [],
        };
    }

    /**
     * Check if transition to the given status is allowed.
     */
    public function canTransitionTo(self $newStatus): bool
    {
        return in_array($newStatus, $this->allowedTransitions(), true);
    }

    /**
     * Check if this is a terminal (final) state.
     */
    public function isTerminal(): bool
    {
        return in_array($this, self::terminalStatuses(), true);
    }

    /**
     * @return array<self>
     */
    public static function terminalStatuses(): array
    {
        return [self::RETURNED, self::REJECTED];
    }
}

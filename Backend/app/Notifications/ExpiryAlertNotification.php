<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExpiryAlertNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly string $type,
        public readonly Collection $items,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->type === 'expired'
            ? 'Chemical Batches Expired'
            : 'Chemical Batches Expiring Soon';

        $message = (new MailMessage)
            ->subject("⚠️ {$subject}")
            ->greeting("Hello {$notifiable->name},");

        if ($this->type === 'expired') {
            $message->line("The following {$this->items->count()} chemical batch(es) have expired:");
        } else {
            $message->line("The following {$this->items->count()} chemical batch(es) are expiring soon:");
        }

        foreach ($this->items->take(10) as $batch) {
            $message->line("• {$batch->chemical?->common_name} (Batch: {$batch->batch_number}) — Expires: {$batch->expiry_date}");
        }

        if ($this->items->count() > 10) {
            $remaining = $this->items->count() - 10;
            $message->line("... and {$remaining} more.");
        }

        return $message->line('Please take appropriate action.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'count' => $this->items->count(),
            'items' => $this->items->take(5)->map(fn ($b) => [
                'batch_id' => $b->id,
                'batch_number' => $b->batch_number,
                'chemical_name' => $b->chemical?->common_name,
                'expiry_date' => $b->expiry_date?->toDateString(),
            ])->toArray(),
            'message' => $this->type === 'expired'
                ? "{$this->items->count()} chemical batch(es) have expired."
                : "{$this->items->count()} chemical batch(es) are expiring soon.",
        ];
    }
}

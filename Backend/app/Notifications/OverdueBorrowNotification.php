<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Modules\Inventory\Models\BorrowRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OverdueBorrowNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly BorrowRecord $borrowRecord,
        public readonly ?string $summary = null,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->subject('⏰ Overdue Borrow Record')
            ->greeting("Hello {$notifiable->name},");

        if ($this->summary) {
            $message->line($this->summary);
        } else {
            $message->line("Your borrow of {$this->borrowRecord->borrowable_type} (ID: {$this->borrowRecord->borrowable_id}) is overdue.")
                ->line("Due date: {$this->borrowRecord->due_at?->toDateTimeString()}")
                ->line("Borrowed at: {$this->borrowRecord->borrowed_at?->toDateTimeString()}");
        }

        return $message->line('Please return the item as soon as possible.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'borrow_record_id' => $this->borrowRecord->id,
            'borrowable_type' => $this->borrowRecord->borrowable_type,
            'borrowable_id' => $this->borrowRecord->borrowable_id,
            'due_at' => $this->borrowRecord->due_at?->toIso8601String(),
            'borrowed_at' => $this->borrowRecord->borrowed_at?->toIso8601String(),
            'summary' => $this->summary,
            'message' => $this->summary ?? 'Your borrow is overdue. Please return the item.',
        ];
    }
}

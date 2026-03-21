<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Modules\Inventory\Models\BorrowRecord;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BorrowRequestNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly BorrowRecord $borrowRecord,
        public readonly string $action = 'requested',
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $message = (new MailMessage)
            ->greeting("Hello {$notifiable->name},");

        return match ($this->action) {
            'requested' => $message
                ->subject('📋 New Borrow Request')
                ->line("A new borrow request has been submitted by {$this->borrowRecord->user?->name}.")
                ->line("Item: {$this->borrowRecord->borrowable_type} (ID: {$this->borrowRecord->borrowable_id})")
                ->line("Quantity: {$this->borrowRecord->quantity}")
                ->line('Please review and approve or reject this request.'),
            'approved' => $message
                ->subject('✅ Borrow Request Approved')
                ->line("Your borrow request for {$this->borrowRecord->borrowable_type} (ID: {$this->borrowRecord->borrowable_id}) has been approved.")
                ->line("Due date: {$this->borrowRecord->due_at?->toDateTimeString()}"),
            'rejected' => $message
                ->subject('❌ Borrow Request Rejected')
                ->line("Your borrow request for {$this->borrowRecord->borrowable_type} (ID: {$this->borrowRecord->borrowable_id}) has been rejected.")
                ->line("Reason: {$this->borrowRecord->rejected_reason}"),
            default => $message
                ->subject('Borrow Record Update')
                ->line("Your borrow record has been updated. Status: {$this->borrowRecord->status->value}"),
        };
    }

    public function toArray(object $notifiable): array
    {
        return [
            'borrow_record_id' => $this->borrowRecord->id,
            'borrowable_type' => $this->borrowRecord->borrowable_type,
            'borrowable_id' => $this->borrowRecord->borrowable_id,
            'quantity' => $this->borrowRecord->quantity,
            'action' => $this->action,
            'user_name' => $this->borrowRecord->user?->name,
            'status' => $this->borrowRecord->status->value,
            'message' => match ($this->action) {
                'requested' => "New borrow request from {$this->borrowRecord->user?->name}",
                'approved' => 'Your borrow request has been approved.',
                'rejected' => "Your borrow request was rejected: {$this->borrowRecord->rejected_reason}",
                default => "Borrow record status: {$this->borrowRecord->status->value}",
            },
        ];
    }
}

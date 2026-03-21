<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Modules\Business\Models\ContractMilestone;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MilestoneCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly ContractMilestone $milestone,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $contract = $this->milestone->contract;

        return (new MailMessage)
            ->subject("Milestone Completed: {$this->milestone->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("A milestone has been completed for contract **{$contract?->contract_code}**.")
            ->line("Milestone: {$this->milestone->title}")
            ->line("Contract Progress: {$contract?->progress_pct}%")
            ->line('Check the contract details for remaining milestones.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'milestone_completed',
            'milestone_id' => $this->milestone->id,
            'milestone_title' => $this->milestone->title,
            'contract_id' => $this->milestone->contract_id,
            'contract_code' => $this->milestone->contract?->contract_code,
        ];
    }
}

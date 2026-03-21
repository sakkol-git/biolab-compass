<?php

declare(strict_types=1);

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractDeadlineNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Collection $contracts,
        public readonly string $type, // 'overdue' or 'approaching'
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subject = $this->type === 'overdue'
            ? 'Overdue Contract Deadlines'
            : 'Contract Deadlines Approaching';

        $message = (new MailMessage)
            ->subject("⚠️ {$subject}")
            ->greeting("Hello {$notifiable->name},");

        if ($this->type === 'overdue') {
            $message->line("The following {$this->contracts->count()} contract(s) have passed their delivery deadline:");
        } else {
            $message->line("The following {$this->contracts->count()} contract(s) are approaching their delivery deadline:");
        }

        foreach ($this->contracts->take(10) as $contract) {
            $clientName = $contract->client?->company_name ?? 'N/A';
            $deadline = $contract->delivery_deadline?->format('M d, Y') ?? 'N/A';
            $message->line(
                "• {$contract->contract_code} — {$clientName} — Deadline: {$deadline}",
            );
        }

        if ($this->contracts->count() > 10) {
            $remaining = $this->contracts->count() - 10;
            $message->line("... and {$remaining} more.");
        }

        return $message->line('Please review and take appropriate action.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => "contract_deadline_{$this->type}",
            'count' => $this->contracts->count(),
            'contracts' => $this->contracts->take(5)->map(fn ($c) => [
                'id' => $c->id,
                'contract_code' => $c->contract_code,
                'client_name' => $c->client?->company_name,
                'delivery_deadline' => $c->delivery_deadline?->toDateString(),
            ])->all(),
        ];
    }
}

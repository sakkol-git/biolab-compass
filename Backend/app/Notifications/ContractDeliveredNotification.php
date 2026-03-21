<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Modules\Business\Models\Contract;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractDeliveredNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Contract $contract,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Contract Delivered: {$this->contract->contract_code}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Contract **{$this->contract->contract_code}** has been successfully delivered.")
            ->line("Client: {$this->contract->client?->company_name}")
            ->line("Quantity Delivered: {$this->contract->quantity_delivered}")
            ->line('Total Value: $'.number_format((float) $this->contract->total_value, 2))
            ->line('The contract lifecycle is now complete.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'contract_delivered',
            'contract_id' => $this->contract->id,
            'contract_code' => $this->contract->contract_code,
            'client_name' => $this->contract->client?->company_name,
            'quantity_delivered' => $this->contract->quantity_delivered,
        ];
    }
}

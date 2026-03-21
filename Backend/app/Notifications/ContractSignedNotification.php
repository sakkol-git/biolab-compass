<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Modules\Business\Models\Contract;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ContractSignedNotification extends Notification implements ShouldQueue
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
        $clientName = $this->contract->client?->company_name ?? 'N/A';
        $deadline = $this->contract->delivery_deadline?->format('M d, Y') ?? 'N/A';

        return (new MailMessage)
            ->subject("Contract Signed: {$this->contract->contract_code}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Contract **{$this->contract->contract_code}** has been signed by the client.")
            ->line("Client: {$clientName}")
            ->line('Value: $'.number_format((float) $this->contract->total_value, 2))
            ->line("Delivery Deadline: {$deadline}")
            ->line('The contract is now ready for production planning.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'contract_signed',
            'contract_id' => $this->contract->id,
            'contract_code' => $this->contract->contract_code,
            'client_name' => $this->contract->client?->company_name,
            'total_value' => (float) $this->contract->total_value,
        ];
    }
}

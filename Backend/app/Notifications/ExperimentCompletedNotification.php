<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Modules\Research\Models\Experiment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExperimentCompletedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Experiment $experiment,
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Experiment Completed: {$this->experiment->title}")
            ->greeting("Hello {$notifiable->name},")
            ->line("Experiment **{$this->experiment->experiment_code}** — \"{$this->experiment->title}\" has been marked as completed.")
            ->line("Species: {$this->experiment->species_name}")
            ->line('Final Yield: '.($this->experiment->final_yield ?? 'N/A'))
            ->line('Survival Rate: '.($this->experiment->avg_survival_rate ? $this->experiment->avg_survival_rate.'%' : 'N/A'))
            ->line('Review the results in the lab management system.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'experiment_completed',
            'experiment_id' => $this->experiment->id,
            'experiment_code' => $this->experiment->experiment_code,
            'title' => $this->experiment->title,
            'species_name' => $this->experiment->species_name,
        ];
    }
}

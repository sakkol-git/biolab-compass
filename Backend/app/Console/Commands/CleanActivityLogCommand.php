<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Activitylog\Models\Activity;

class CleanActivityLogCommand extends Command
{
    protected $signature = 'lab:clean-activity-log {--days=365 : Delete records older than this many days}';

    protected $description = 'Clean old activity log entries to prevent unbounded growth';

    public function handle(): int
    {
        $days = (int) $this->option('days');

        $cutoff = now()->subDays($days);

        $deleted = Activity::where('created_at', '<', $cutoff)->delete();

        $this->info("Deleted {$deleted} activity log entries older than {$days} days.");

        return self::SUCCESS;
    }
}

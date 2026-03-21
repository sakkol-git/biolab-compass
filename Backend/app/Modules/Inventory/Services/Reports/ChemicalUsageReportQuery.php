<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services\Reports;

use App\Modules\Inventory\Models\ChemicalUsageLog;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class ChemicalUsageReportQuery
{
    public function get(string $from, string $to): Collection
    {
        return ChemicalUsageLog::with(['chemical', 'user'])
            ->betweenDates($from, $to)
            ->latest('used_at')
            ->get()
            ->groupBy('chemical_id')
            ->map(fn ($logs) => [
                'chemical' => $logs->first()->chemical?->common_name,
                'total_used' => $logs->sum('quantity_used'),
                'usage_count' => $logs->count(),
                'unique_users' => $logs->pluck('user_id')->unique()->count(),
                'entries' => $logs->map(fn ($l) => [
                    'user' => $l->user?->name,
                    'quantity_used' => $l->quantity_used,
                    'purpose' => $l->purpose,
                    'used_at' => $l->used_at?->toIso8601String(),
                ]),
            ]);
    }

    public function exportCsv(string $from, string $to): StreamedResponse
    {
        return ReportCsvHelper::stream('chemical_usage_report.csv', function ($handle) use ($from, $to): void {
            fputcsv($handle, ['Chemical', 'User', 'Quantity', 'Unit', 'Purpose', 'Date']);

            ChemicalUsageLog::with(['chemical', 'user'])
                ->betweenDates($from, $to)
                ->latest('used_at')
                ->chunk(200, function ($logs) use ($handle): void {
                    foreach ($logs as $log) {
                        fputcsv($handle, [
                            $log->chemical?->common_name,
                            $log->user?->name,
                            $log->quantity_used,
                            $log->unit,
                            $log->purpose,
                            $log->used_at?->toDateTimeString(),
                        ]);
                    }
                });
        });
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services\Reports;

use App\Enums\BorrowStatus;
use App\Modules\Inventory\Models\BorrowRecord;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class BorrowedItemsReportQuery
{
    private const ACTIVE_STATUSES = [
        BorrowStatus::BORROWED,
        BorrowStatus::PENDING,
        BorrowStatus::OVERDUE,
    ];

    /**
     * @return array{total: int, pending: int, active: int, overdue: int, records: Collection}
     */
    public function get(): array
    {
        $records = BorrowRecord::with(['user', 'borrowable'])
            ->whereIn('status', array_map(fn ($s) => $s->value, self::ACTIVE_STATUSES))
            ->latest('borrowed_at')
            ->get();

        return [
            'total' => $records->count(),
            'pending' => $records->where('status', BorrowStatus::PENDING->value)->count(),
            'active' => $records->where('status', BorrowStatus::BORROWED->value)->count(),
            'overdue' => $records->where('status', BorrowStatus::OVERDUE->value)->count(),
            'records' => $records,
        ];
    }

    public function exportCsv(): StreamedResponse
    {
        return ReportCsvHelper::stream('borrowed_items_report.csv', function ($handle): void {
            fputcsv($handle, ['User', 'Item Type', 'Item ID', 'Quantity', 'Status', 'Borrowed At', 'Due At']);

            BorrowRecord::with(['user', 'borrowable'])
                ->whereIn('status', array_map(fn ($s) => $s->value, self::ACTIVE_STATUSES))
                ->chunk(200, function ($records) use ($handle): void {
                    foreach ($records as $r) {
                        fputcsv($handle, [
                            $r->user?->name,
                            $r->borrowable_type,
                            $r->borrowable_id,
                            $r->quantity,
                            $r->status->value,
                            $r->borrowed_at?->toDateTimeString(),
                            $r->due_at?->toDateTimeString(),
                        ]);
                    }
                });
        });
    }
}

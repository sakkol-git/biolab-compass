<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services\Reports;

use App\Modules\Inventory\Models\Chemical;
use App\Modules\Inventory\Models\ChemicalBatch;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class ExpiredItemsReportQuery
{
    /**
     * @return array{expired_chemicals: \Illuminate\Support\Collection, expired_batches: \Illuminate\Support\Collection, expiring_soon_batches: \Illuminate\Support\Collection}
     */
    public function get(): array
    {
        return [
            'expired_chemicals' => Chemical::expired()->get(),
            'expired_batches' => ChemicalBatch::expired()->with('chemical')->get(),
            'expiring_soon_batches' => ChemicalBatch::expiringSoon()->with('chemical')->get(),
        ];
    }

    public function exportCsv(): StreamedResponse
    {
        return ReportCsvHelper::stream('expired_items_report.csv', function ($handle): void {
            fputcsv($handle, ['Type', 'ID', 'Name', 'Expiry Date', 'Quantity']);

            Chemical::expired()->get()->each(fn ($c) => fputcsv($handle, [
                'Chemical', $c->id, $c->common_name, $c->expiry_date, $c->quantity,
            ]));

            ChemicalBatch::expired()->with('chemical')->get()->each(fn ($b) => fputcsv($handle, [
                'Chemical Batch', $b->id, $b->chemical?->common_name." ({$b->batch_number})", $b->expiry_date, $b->quantity,
            ]));
        });
    }
}

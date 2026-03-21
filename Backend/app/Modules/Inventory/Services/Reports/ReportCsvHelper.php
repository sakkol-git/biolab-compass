<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services\Reports;

use Symfony\Component\HttpFoundation\StreamedResponse;

final class ReportCsvHelper
{
    public static function stream(string $filename, callable $writer): StreamedResponse
    {
        return response()->streamDownload(function () use ($writer): void {
            $handle = fopen('php://output', 'w');
            $writer($handle);
            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}

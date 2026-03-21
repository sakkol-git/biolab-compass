<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Services\Reports;

use App\Enums\BorrowStatus;
use App\Modules\Core\Models\User;
use Illuminate\Support\Collection;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class UserActivityReportQuery
{
    public function get(string $from, string $to): Collection
    {
        return User::withCount([
            'borrowRecords as total_borrows',
            'borrowRecords as active_borrows' => fn ($q) => $q->where('status', BorrowStatus::BORROWED->value),
            'chemicalUsageLogs',
            'transactions as transactions_count' => fn ($q) => $q->whereBetween('created_at', [$from, $to]),
        ])->get()->map(fn (User $u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role->value,
            'total_borrows' => $u->total_borrows,
            'active_borrows' => $u->active_borrows,
            'chemical_usage_logs_count' => $u->chemical_usage_logs_count,
            'transactions' => $u->transactions_count,
        ]);
    }

    public function exportCsv(string $from, string $to): StreamedResponse
    {
        return ReportCsvHelper::stream('user_activity_report.csv', function ($handle) use ($from, $to): void {
            fputcsv($handle, ['Name', 'Email', 'Role', 'Total Borrows', 'Active Borrows', 'Chemical Usages', 'Transactions']);

            User::withCount([
                'borrowRecords as total_borrows',
                'borrowRecords as active_borrows' => fn ($q) => $q->where('status', BorrowStatus::BORROWED->value),
                'chemicalUsageLogs',
                'transactions as transactions_count' => fn ($q) => $q->whereBetween('created_at', [$from, $to]),
            ])->chunk(200, function ($users) use ($handle): void {
                foreach ($users as $u) {
                    fputcsv($handle, [
                        $u->name,
                        $u->email,
                        $u->role->value,
                        $u->total_borrows,
                        $u->active_borrows,
                        $u->chemical_usage_logs_count,
                        $u->transactions_count,
                    ]);
                }
            });
        });
    }
}

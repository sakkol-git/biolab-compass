<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Inventory\Services\Reports\BorrowedItemsReportQuery;
use App\Modules\Inventory\Services\Reports\ChemicalUsageReportQuery;
use App\Modules\Inventory\Services\Reports\ExpiredItemsReportQuery;
use App\Modules\Inventory\Services\Reports\InventoryReportQuery;
use App\Modules\Inventory\Services\Reports\UserActivityReportQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function __construct(
        private readonly InventoryReportQuery $inventoryQuery,
        private readonly ChemicalUsageReportQuery $chemicalUsageQuery,
        private readonly ExpiredItemsReportQuery $expiredItemsQuery,
        private readonly BorrowedItemsReportQuery $borrowedItemsQuery,
        private readonly UserActivityReportQuery $userActivityQuery,
    ) {}

    /**
     * GET /api/reports/inventory?section=chemicals&per_page=50
     */
    public function inventory(Request $request): JsonResponse
    {
        Gate::authorize('view-reports');

        $request->validate([
            'section' => 'sometimes|string|in:chemicals,equipment,plant-species,plant-samples',
            'per_page' => 'sometimes|integer|min:1|max:100',
        ]);

        $section = $request->input('section', 'chemicals');
        $perPage = (int) $request->input('per_page', 50);
        $paginator = $this->inventoryQuery->paginate($section, $perPage);

        return response()->json([
            'data' => $paginator->items(),
            'section' => $section,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ]);
    }

    /**
     * GET /api/reports/chemical-usage
     */
    public function chemicalUsage(Request $request): JsonResponse
    {
        Gate::authorize('view-reports');

        $request->validate([
            'from' => 'sometimes|date_format:Y-m-d',
            'to' => 'sometimes|date_format:Y-m-d|after_or_equal:from',
        ]);

        $from = $request->input('from', now()->subMonth()->toDateString());
        $to = $request->input('to', now()->toDateString());
        $usage = $this->chemicalUsageQuery->get($from, $to);

        return response()->json(['data' => [
            'period' => ['from' => $from, 'to' => $to],
            'usage' => $usage,
        ]]);
    }

    /**
     * GET /api/reports/expired-items
     */
    public function expiredItems(): JsonResponse
    {
        Gate::authorize('view-reports');

        return response()->json(['data' => $this->expiredItemsQuery->get()]);
    }

    /**
     * GET /api/reports/borrowed-items
     */
    public function borrowedItems(): JsonResponse
    {
        Gate::authorize('view-reports');

        return response()->json(['data' => $this->borrowedItemsQuery->get()]);
    }

    /**
     * GET /api/reports/user-activity
     */
    public function userActivity(Request $request): JsonResponse
    {
        Gate::authorize('view-reports');

        $request->validate([
            'from' => 'sometimes|date_format:Y-m-d',
            'to' => 'sometimes|date_format:Y-m-d|after_or_equal:from',
        ]);

        $from = $request->input('from', now()->subMonth()->toDateString());
        $to = $request->input('to', now()->toDateString());
        $users = $this->userActivityQuery->get($from, $to);

        return response()->json(['data' => [
            'period' => ['from' => $from, 'to' => $to],
            'users' => $users,
        ]]);
    }

    /**
     * GET /api/reports/{type}/export?format=csv
     */
    public function export(Request $request, string $type): StreamedResponse|JsonResponse
    {
        Gate::authorize('view-reports');

        $request->validate([
            'format' => 'sometimes|string|in:csv',
            'from' => 'sometimes|date_format:Y-m-d',
            'to' => 'sometimes|date_format:Y-m-d|after_or_equal:from',
        ]);

        $format = $request->input('format', 'csv');

        if ($format !== 'csv') {
            return response()->json(['message' => 'Only CSV export is currently supported.'], 422);
        }

        $from = $request->input('from', now()->subMonth()->toDateString());
        $to = $request->input('to', now()->toDateString());

        return match ($type) {
            'inventory' => $this->inventoryQuery->exportCsv(),
            'chemical-usage' => $this->chemicalUsageQuery->exportCsv($from, $to),
            'expired-items' => $this->expiredItemsQuery->exportCsv(),
            'borrowed-items' => $this->borrowedItemsQuery->exportCsv(),
            'user-activity' => $this->userActivityQuery->exportCsv($from, $to),
            default => response()->json(['message' => "Unknown report type: {$type}"], 404),
        };
    }
}

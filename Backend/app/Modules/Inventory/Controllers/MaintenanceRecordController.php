<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Controllers;

use App\Concerns\EscapesSearchTerm;
use App\Http\Controllers\Controller;

use App\Enums\TransactionAction;
use App\Modules\Inventory\Requests\Maintenance\StoreMaintenanceRecordRequest;
use App\Modules\Inventory\Requests\Maintenance\UpdateMaintenanceRecordRequest;
use App\Modules\Inventory\Resources\MaintenanceRecordResource;
use App\Modules\Inventory\Models\MaintenanceRecord;
use App\Modules\Inventory\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class MaintenanceRecordController extends Controller
{
    use EscapesSearchTerm;
    public function __construct(
        private readonly TransactionService $transactionService,
    ) {}

    /**
     * GET /api/maintenance-records
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', MaintenanceRecord::class);

        $query = MaintenanceRecord::with(['equipment', 'performer'])->latest('started_at');

        if ($request->filled('equipment_id')) {
            $query->forEquipment($request->integer('equipment_id'));
        }
        if ($request->filled('type')) {
            $query->ofType($request->input('type'));
        }
        if ($request->boolean('upcoming_only')) {
            $query->upcoming();
        }
        if ($request->boolean('overdue_only')) {
            $query->overdue();
        }
        if ($request->filled('search')) {
            $term = $this->escapeLike($request->input('search'));
            $query->where('description', 'like', "%{$term}%");
        }

        return MaintenanceRecordResource::collection($query->paginate(15));
    }

    /**
     * POST /api/maintenance-records
     */
    public function store(StoreMaintenanceRecordRequest $request): JsonResponse
    {
        $this->authorize('create', MaintenanceRecord::class);

        $data = $request->validated();
        $data['performed_by'] = auth('api')->id();

        $record = DB::transaction(function () use ($data): MaintenanceRecord {
            $record = MaintenanceRecord::create($data);

            $this->transactionService->log(
                item: $record->equipment,
                user: auth('api')->user(),
                action: TransactionAction::UPDATED,
                note: "Maintenance ({$record->maintenance_type->value}): {$record->description}",
            );

            return $record;
        });

        $record->load(['equipment', 'performer']);

        return (new MaintenanceRecordResource($record))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * GET /api/maintenance-records/{maintenanceRecord}
     */
    public function show(MaintenanceRecord $maintenanceRecord): MaintenanceRecordResource
    {
        $this->authorize('view', $maintenanceRecord);

        $maintenanceRecord->load(['equipment', 'performer']);

        return new MaintenanceRecordResource($maintenanceRecord);
    }

    /**
     * PUT /api/maintenance-records/{maintenanceRecord}
     */
    public function update(UpdateMaintenanceRecordRequest $request, MaintenanceRecord $maintenanceRecord): MaintenanceRecordResource
    {
        $this->authorize('update', $maintenanceRecord);

        DB::transaction(fn () => $maintenanceRecord->update($request->validated()));

        return new MaintenanceRecordResource($maintenanceRecord->refresh()->load(['equipment', 'performer']));
    }

    /**
     * DELETE /api/maintenance-records/{maintenanceRecord}
     */
    public function destroy(MaintenanceRecord $maintenanceRecord): JsonResponse
    {
        $this->authorize('delete', $maintenanceRecord);

        DB::transaction(fn () => $maintenanceRecord->delete());

        return response()->json(['message' => 'Maintenance record deleted successfully.']);
    }
}

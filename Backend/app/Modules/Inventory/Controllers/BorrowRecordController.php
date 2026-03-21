<?php

declare(strict_types=1);

namespace App\Modules\Inventory\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Inventory\Requests\Borrow\ApproveBorrowRecordRequest;
use App\Modules\Inventory\Requests\Borrow\RejectBorrowRecordRequest;
use App\Modules\Inventory\Requests\Borrow\ReturnBorrowRecordRequest;
use App\Modules\Inventory\Requests\Borrow\StoreBorrowRecordRequest;
use App\Modules\Inventory\Resources\BorrowRecordResource;
use App\Modules\Inventory\Models\BorrowRecord;
use App\Modules\Core\Models\User;
use App\Modules\Inventory\Services\BorrowService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BorrowRecordController extends Controller
{
    public function __construct(
        private readonly BorrowService $borrowService,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', BorrowRecord::class);

        $query = BorrowRecord::with(['user', 'borrowable'])->latest();

        if ($request->filled('type')) {
            $query->forType($request->input('type'));
        }
        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }
        if ($request->boolean('active_only')) {
            $query->active();
        }
        if ($request->boolean('overdue_only')) {
            $query->overdue();
        }

        return BorrowRecordResource::collection($query->paginate(15));
    }

    /**
     * Store a newly created resource in storage.
     *
     * Users with 'borrows.approve' permission get direct borrow (BORROWED).
     * Others get a pending request (PENDING) that needs approval.
     */
    public function store(StoreBorrowRecordRequest $request): JsonResponse
    {
        $this->authorize('create', BorrowRecord::class);

        $data = $request->validated();

        // Resolve the polymorphic model from the morph map
        $morphClass = Relation::getMorphedModel($data['borrowable_type']);
        abort_unless($morphClass, 422, "Unknown borrowable type: {$data['borrowable_type']}");

        $item = $morphClass::findOrFail($data['borrowable_id']);
        $user = User::findOrFail($data['user_id']);
        $currentUser = auth('api')->user();

        // Direct borrow for users with approve permission, otherwise pending request
        if ($currentUser->hasPermissionTo('borrows.approve', 'api')) {
            $record = $this->borrowService->borrow(
                item: $item,
                user: $user,
                quantity: (int) $data['quantity'],
                dueAt: isset($data['due_at']) ? Carbon::parse($data['due_at']) : null,
                notes: $data['notes'] ?? null,
            );
        } else {
            $record = $this->borrowService->requestBorrow(
                item: $item,
                user: $user,
                quantity: (int) $data['quantity'],
                dueAt: isset($data['due_at']) ? Carbon::parse($data['due_at']) : null,
                notes: $data['notes'] ?? null,
            );
        }

        $record->load(['user', 'borrowable']);

        return (new BorrowRecordResource($record))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show(BorrowRecord $borrowRecord): BorrowRecordResource
    {
        $this->authorize('view', $borrowRecord);

        $borrowRecord->load(['user', 'borrowable']);

        return new BorrowRecordResource($borrowRecord);
    }

    /**
     * POST /api/borrow-records/{borrowRecord}/return
     */
    public function returnItem(ReturnBorrowRecordRequest $request, BorrowRecord $borrowRecord): BorrowRecordResource
    {
        $this->authorize('return', $borrowRecord);

        $record = $this->borrowService->returnItem(
            record: $borrowRecord,
            notes: $request->validated('notes'),
        );

        $record->load(['user', 'borrowable']);

        return new BorrowRecordResource($record);
    }

    /**
     * GET /api/borrow-records/overdue
     */
    public function overdue(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', BorrowRecord::class);

        $records = BorrowRecord::with(['user', 'borrowable'])
            ->overdue()
            ->latest('due_at')
            ->paginate(15);

        return BorrowRecordResource::collection($records);
    }

    /**
     * GET /api/borrow-records/pending
     */
    public function pending(): AnonymousResourceCollection
    {
        $this->authorize('viewAny', BorrowRecord::class);

        $records = BorrowRecord::with(['user', 'borrowable'])
            ->where('status', \App\Enums\BorrowStatus::PENDING->value)
            ->latest()
            ->paginate(15);

        return BorrowRecordResource::collection($records);
    }

    /**
     * POST /api/borrow-records/{borrowRecord}/approve
     */
    public function approve(ApproveBorrowRecordRequest $request, BorrowRecord $borrowRecord): BorrowRecordResource
    {
        $this->authorize('approve', $borrowRecord);

        $record = $this->borrowService->approveBorrow(
            record: $borrowRecord,
            approver: auth('api')->user(),
            notes: $request->validated('notes'),
        );

        $record->load(['user', 'borrowable', 'reviewer']);

        return new BorrowRecordResource($record);
    }

    /**
     * POST /api/borrow-records/{borrowRecord}/reject
     */
    public function reject(RejectBorrowRecordRequest $request, BorrowRecord $borrowRecord): BorrowRecordResource
    {
        $this->authorize('approve', $borrowRecord);

        $record = $this->borrowService->rejectBorrow(
            record: $borrowRecord,
            rejector: auth('api')->user(),
            reason: $request->validated('rejected_reason'),
        );

        $record->load(['user', 'borrowable']);

        return new BorrowRecordResource($record);
    }
}

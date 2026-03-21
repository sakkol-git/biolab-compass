<?php

declare(strict_types=1);

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Business\Requests\Payment\StorePaymentRequest;
use App\Modules\Business\Requests\Payment\UpdatePaymentRequest;
use App\Modules\Business\Resources\PaymentResource;
use App\Modules\Business\Models\Payment;
use App\Modules\Business\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Payment::class);

        $result = $this->service->list(
            search: $request->input('search'),
            status: $request->input('status'),
            contractId: $request->integer('contract_id') ?: null,
            perPage: $request->integer('per_page', 15),
        );

        return PaymentResource::collection($result);
    }

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $this->authorize('create', Payment::class);

        $payment = $this->service->create($request->validated());

        return (new PaymentResource($payment))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Payment $payment): PaymentResource
    {
        $this->authorize('view', $payment);

        $payment = $this->service->get($payment->id);

        return new PaymentResource($payment);
    }

    public function update(UpdatePaymentRequest $request, Payment $payment): PaymentResource
    {
        $this->authorize('update', $payment);

        $payment = $this->service->update($payment, $request->validated());

        return new PaymentResource($payment);
    }

    public function destroy(Payment $payment): JsonResponse
    {
        $this->authorize('delete', $payment);

        $this->service->delete($payment);

        return response()->json(['message' => 'Payment deleted successfully.']);
    }

    /**
     * Dashboard-level payment statistics.
     */
    public function stats(): JsonResponse
    {
        $this->authorize('viewAny', Payment::class);

        return response()->json($this->service->getStats());
    }
}

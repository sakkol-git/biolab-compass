<?php

declare(strict_types=1);

namespace App\Modules\Research\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Research\Requests\Protocol\StoreProtocolRequest;
use App\Modules\Research\Requests\Protocol\UpdateProtocolRequest;
use App\Modules\Research\Resources\ProtocolResource;
use App\Modules\Research\Models\Protocol;
use App\Modules\Research\Services\ProtocolService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProtocolController extends Controller
{
    public function __construct(
        private readonly ProtocolService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Protocol::class);

        $result = $this->service->list(
            search: $request->input('search'),
            status: $request->input('status'),
            category: $request->input('category'),
            perPage: $request->integer('per_page', 15),
        );

        return ProtocolResource::collection($result);
    }

    public function store(StoreProtocolRequest $request): JsonResponse
    {
        $this->authorize('create', Protocol::class);

        $protocol = $this->service->create(
            data: $request->validated(),
            authorId: auth('api')->id(),
        );

        return (new ProtocolResource($protocol))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Protocol $protocol): ProtocolResource
    {
        $this->authorize('view', $protocol);

        $protocol = $this->service->get($protocol->id);

        return new ProtocolResource($protocol);
    }

    public function update(UpdateProtocolRequest $request, Protocol $protocol): ProtocolResource
    {
        $this->authorize('update', $protocol);

        $protocol = $this->service->update($protocol, $request->validated());

        return new ProtocolResource($protocol);
    }

    public function destroy(Protocol $protocol): JsonResponse
    {
        $this->authorize('delete', $protocol);

        $this->service->delete($protocol);

        return response()->json(['message' => 'Protocol deleted successfully.']);
    }
}

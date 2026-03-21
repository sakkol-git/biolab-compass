<?php

declare(strict_types=1);

namespace App\Modules\Business\Controllers;

use App\Http\Controllers\Controller;

use App\Modules\Business\Requests\Client\StoreClientRequest;
use App\Modules\Business\Requests\Client\UpdateClientRequest;
use App\Modules\Business\Resources\ClientResource;
use App\Modules\Business\Models\Client;
use App\Modules\Business\Services\ClientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ClientController extends Controller
{
    public function __construct(
        private readonly ClientService $service,
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Client::class);

        $result = $this->service->list(
            search: $request->input('search'),
            type: $request->input('client_type'),
            perPage: $request->integer('per_page', 15),
        );

        return ClientResource::collection($result);
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        $this->authorize('create', Client::class);

        $client = $this->service->create($request->validated());

        return (new ClientResource($client))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Client $client): ClientResource
    {
        $this->authorize('view', $client);

        $client = $this->service->get($client->id);

        return new ClientResource($client);
    }

    public function update(UpdateClientRequest $request, Client $client): ClientResource
    {
        $this->authorize('update', $client);

        $client = $this->service->update($client, $request->validated());

        return new ClientResource($client);
    }

    public function destroy(Client $client): JsonResponse
    {
        $this->authorize('delete', $client);

        $this->service->delete($client);

        return response()->json(['message' => 'Client deleted successfully.']);
    }

    /**
     * Dashboard-level client statistics.
     */
    public function stats(): JsonResponse
    {
        $this->authorize('viewAny', Client::class);

        return response()->json($this->service->getStats());
    }
}

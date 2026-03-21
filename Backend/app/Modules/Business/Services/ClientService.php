<?php

declare(strict_types=1);

namespace App\Modules\Business\Services;

use App\Enums\ClientType;
use App\Modules\Business\Models\Client;
use App\Modules\Core\Services\CodeGeneratorService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ClientService
{
    /**
     * Paginated listing with search and type filter.
     */
    public function list(
        ?string $search = null,
        ?string $type = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return Client::query()
            ->search($search)
            ->when($type, fn ($q) => $q->byType(ClientType::from($type)))
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * Single client with contracts eager-loaded.
     */
    public function get(int $id): Client
    {
        return Client::with(['contracts.species'])->findOrFail($id);
    }

    /**
     * Create a new client.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Client
    {
        $code = CodeGeneratorService::next(Client::class, 'CLT', 'client_code');

        return Client::create([
            'client_code' => $code,
            'company_name' => $data['company_name'],
            'contact_name' => $data['contact_name'] ?? null,
            'contact_email' => $data['contact_email'] ?? null,
            'contact_phone' => $data['contact_phone'] ?? null,
            'address' => $data['address'] ?? null,
            'client_type' => ClientType::from($data['client_type']),
        ]);
    }

    /**
     * Update a client.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Client $client, array $data): Client
    {
        $client->update(collect($data)->only([
            'company_name',
            'contact_name',
            'contact_email',
            'contact_phone',
            'address',
            'client_type',
            'notes',
        ])->all());

        return $client->fresh();
    }

    /**
     * Delete a client.
     */
    public function delete(Client $client): void
    {
        $client->delete();
    }

    /**
     * Dashboard-level client statistics.
     *
     * @return array<string, mixed>
     */
    public function getStats(): array
    {
        return [
            'total_clients' => Client::count(),
            'total_value' => (float) Client::sum('total_value'),
            'clients_by_type' => Client::selectRaw('client_type, COUNT(*) as count')
                ->groupBy('client_type')
                ->pluck('count', 'client_type')
                ->all(),
            'top_clients' => Client::orderByDesc('total_value')
                ->limit(5)
                ->get(['id', 'client_code', 'company_name', 'total_contracts', 'total_value']),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Business\Services;

use App\Enums\ContractStatus;
use App\Exceptions\ContractNotDeletableException;
use App\Exceptions\InvalidStatusTransitionException;
use App\Modules\Business\Models\Contract;
use App\Modules\Business\Models\Payment;
use App\Modules\Core\Services\CodeGeneratorService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ContractService
{
    /**
     * Paginated listing with search, status filter, client filter.
     */
    public function list(
        ?string $search = null,
        ?string $status = null,
        ?int $clientId = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return Contract::query()
            ->with(['client', 'species', 'manager'])
            ->search($search)
            ->when($status, fn ($q) => $q->byStatus(ContractStatus::from($status)))
            ->when($clientId, fn ($q) => $q->where('client_id', $clientId))
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * Single contract with all relations.
     */
    public function get(int $id): Contract
    {
        return Contract::with([
            'client',
            'species',
            'manager',
            'milestones',
            'payments',
        ])->findOrFail($id);
    }

    /**
     * Create a new contract.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data, ?int $managedBy = null): Contract
    {
        return DB::transaction(function () use ($data, $managedBy): Contract {
            $code = CodeGeneratorService::next(Contract::class, 'CON', 'contract_code');

            $totalValue = ($data['quantity_ordered'] ?? 0) * ($data['unit_price'] ?? 0);

            $contract = Contract::create([
                'contract_code' => $code,
                'client_id' => $data['client_id'],
                'plant_species_id' => $data['plant_species_id'] ?? null,
                'common_name' => $data['common_name'] ?? null,
                'managed_by' => $managedBy,
                'status' => ContractStatus::DRAFT,
                'contract_date' => $data['contract_date'] ?? now()->toDateString(),
                'delivery_deadline' => $data['delivery_deadline'],
                'quantity_ordered' => $data['quantity_ordered'] ?? 0,
                'unit_price' => $data['unit_price'] ?? 0,
                'notes' => $data['notes'] ?? null,
            ]);

            // Set computed fields explicitly (not mass-assignable)
            $contract->quantity_delivered = 0;
            $contract->total_value = $totalValue;
            $contract->progress_pct = 0;
            $contract->save();

            // Update client counter cache
            $contract->client->recalculateCounters();

            return $contract->load(['client', 'species', 'manager']);
        });
    }

    /**
     * Update a contract.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Contract $contract, array $data): Contract
    {
        return DB::transaction(function () use ($contract, $data): Contract {
            // Recalculate total_value if quantities/prices changed
            $recalcTotal = isset($data['quantity_ordered']) || isset($data['unit_price']);

            $contract->update($data);

            if ($recalcTotal) {
                $contract->total_value = $contract->quantity_ordered * $contract->unit_price;
                $contract->save();
            }

            // Refresh client counter cache if total_value changed
            if ($recalcTotal) {
                $contract->client->recalculateCounters();
            }

            return $contract->load(['client', 'species', 'manager']);
        });
    }

    /**
     * Transition a contract to a new status.
     *
     * @throws InvalidStatusTransitionException
     */
    public function transitionStatus(Contract $contract, ContractStatus $newStatus): Contract
    {
        if (! $contract->status->canTransitionTo($newStatus)) {
            throw new InvalidStatusTransitionException(
                $contract->status->value,
                $newStatus->value,
            );
        }

        $contract->status = $newStatus;

        // Auto-set actual_delivery_date when delivered
        if ($newStatus === ContractStatus::DELIVERED) {
            $contract->actual_delivery_date = now()->toDateString();
            $contract->progress_pct = 100;
        }

        $contract->save();

        return $contract->fresh();
    }

    /**
     * Delete a contract (only drafts may be deleted).
     *
     * @throws ContractNotDeletableException
     */
    public function delete(Contract $contract): void
    {
        if ($contract->status !== ContractStatus::DRAFT) {
            throw new ContractNotDeletableException($contract->status->value);
        }

        DB::transaction(function () use ($contract): void {
            $client = $contract->client;
            $contract->delete();
            $client->recalculateCounters();
        });
    }

    /**
     * Pipeline summary: count of contracts per status.
     *
     * @return Collection<string, int>
     */
    public function getPipelineSummary(): Collection
    {
        return Contract::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');
    }

    /**
     * Dashboard-level contract statistics.
     *
     * @return array<string, mixed>
     */
    public function getStats(): array
    {
        return [
            'total_contracts' => Contract::count(),
            'active_contracts' => Contract::activeContracts()->count(),
            'total_revenue' => (float) Contract::sum('total_value'),
            'total_pending' => (float) Contract::activeContracts()->sum('total_value')
                - (float) Payment::whereIn('contract_id', Contract::activeContracts()->pluck('id'))
                    ->received()
                    ->sum('amount'),
            'pipeline' => $this->getPipelineSummary(),
            'avg_contract_value' => round((float) Contract::avg('total_value'), 2),
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Modules\Business\Services;

use App\Enums\MilestoneStatus;
use App\Modules\Business\Models\Contract;
use App\Modules\Business\Models\ContractMilestone;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ContractMilestoneService
{
    /**
     * List milestones for a contract.
     *
     * @return Collection<int, ContractMilestone>
     */
    public function listForContract(int $contractId): Collection
    {
        return ContractMilestone::where('contract_id', $contractId)
            ->orderBy('target_date')
            ->get();
    }

    /**
     * Create a milestone and recalculate contract progress.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(Contract $contract, array $data): ContractMilestone
    {
        return DB::transaction(function () use ($contract, $data): ContractMilestone {
            $status = MilestoneStatus::infer(
                $data['target_date'],
                isset($data['actual_count']) ? (int) $data['actual_count'] : null,
                (int) $data['projected_count'],
            );

            $milestone = $contract->milestones()->create([
                'title' => $data['title'],
                'target_date' => $data['target_date'],
                'actual_date' => $data['actual_date'] ?? null,
                'projected_count' => $data['projected_count'],
                'actual_count' => $data['actual_count'] ?? null,
                'status' => $status,
            ]);

            $this->recalculateContractProgress($contract);

            return $milestone;
        });
    }

    /**
     * Update a milestone and recalculate contract progress.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(ContractMilestone $milestone, array $data): ContractMilestone
    {
        return DB::transaction(function () use ($milestone, $data): ContractMilestone {
            // Re-infer status if relevant fields changed
            $targetDate = $data['target_date'] ?? $milestone->target_date->toDateString();
            $actualCount = array_key_exists('actual_count', $data)
                ? (isset($data['actual_count']) ? (int) $data['actual_count'] : null)
                : $milestone->actual_count;
            $projectedCount = (int) ($data['projected_count'] ?? $milestone->projected_count);

            $data['status'] = MilestoneStatus::infer($targetDate, $actualCount, $projectedCount);

            $milestone->update($data);

            $this->recalculateContractProgress($milestone->contract);

            return $milestone->fresh();
        });
    }

    /**
     * Delete a milestone and recalculate contract progress.
     */
    public function delete(ContractMilestone $milestone): void
    {
        $contract = $milestone->contract;
        $milestone->delete();
        $this->recalculateContractProgress($contract);
    }

    /**
     * Recalculate contract progress percentage based on completed milestones.
     * BL-006: progress_pct = completed_milestones / total_milestones * 100
     */
    public function recalculateContractProgress(Contract $contract): void
    {
        $total = $contract->milestones()->count();
        $completed = $contract->milestones()->completed()->count();

        $progress = $total > 0 ? (int) round(($completed / $total) * 100) : 0;

        // Also sum actual_count across milestones for quantity_delivered
        $delivered = (int) $contract->milestones()->sum('actual_count');

        $contract->update([
            'progress_pct' => $progress,
            'quantity_delivered' => $delivered,
        ]);
    }

    /**
     * Re-infer statuses for all pending/on_track/at_risk milestones.
     * Useful as a scheduled job to update stale statuses.
     */
    public function refreshAllStatuses(): int
    {
        $updated = 0;

        ContractMilestone::whereIn('status', [
            MilestoneStatus::PENDING,
            MilestoneStatus::ON_TRACK,
            MilestoneStatus::AT_RISK,
        ])->each(function (ContractMilestone $m) use (&$updated): void {
            $newStatus = MilestoneStatus::infer(
                $m->target_date->toDateString(),
                $m->actual_count,
                $m->projected_count,
            );

            if ($newStatus !== $m->status) {
                $m->update(['status' => $newStatus]);
                $updated++;
            }
        });

        return $updated;
    }
}

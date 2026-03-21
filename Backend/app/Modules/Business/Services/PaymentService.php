<?php

declare(strict_types=1);

namespace App\Modules\Business\Services;

use App\Enums\ContractStatus;
use App\Enums\PaymentStatus;
use App\Enums\PaymentType;
use App\Exceptions\PaymentExceedsBalanceException;
use App\Modules\Business\Models\Contract;
use App\Modules\Business\Models\Payment;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * Paginated listing with search, status filter, contract filter.
     */
    public function list(
        ?string $search = null,
        ?string $status = null,
        ?int $contractId = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return Payment::query()
            ->with('contract.client')
            ->search($search)
            ->when($status, fn ($q) => $q->byStatus(PaymentStatus::from($status)))
            ->when($contractId, fn ($q) => $q->where('contract_id', $contractId))
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * Single payment with contract eager-loaded.
     */
    public function get(int $id): Payment
    {
        return Payment::with('contract.client')->findOrFail($id);
    }

    /**
     * Create a payment.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws PaymentExceedsBalanceException
     */
    public function create(array $data): Payment
    {
        return DB::transaction(function () use ($data): Payment {
            $contract = Contract::findOrFail($data['contract_id']);
            $amount = (float) $data['amount'];
            $remaining = $contract->totalPending();

            // Refunds are subtracted, so skip balance check for them
            $type = PaymentType::from($data['payment_type']);
            if ($type !== PaymentType::REFUND && $amount > $remaining + 0.01) {
                throw new PaymentExceedsBalanceException($amount, $remaining);
            }

            $payment = Payment::create([
                'contract_id' => $contract->id,
                'reference_number' => $data['reference_number'] ?? null,
                'amount' => $amount,
                'payment_type' => $type,
                'status' => PaymentStatus::from($data['status'] ?? 'pending'),
                'due_date' => $data['due_date'] ?? null,
                'payment_date' => $data['payment_date'] ?? null,
                'notes' => $data['notes'] ?? null,
            ]);

            // Auto-advance contract from draft → signed on first deposit
            if (
                $type === PaymentType::DEPOSIT
                && $contract->status === ContractStatus::DRAFT
            ) {
                $contract->update(['status' => ContractStatus::SIGNED]);
            }

            return $payment->load('contract.client');
        });
    }

    /**
     * Update a payment.
     *
     * @param  array<string, mixed>  $data
     *
     * @throws PaymentExceedsBalanceException
     */
    public function update(Payment $payment, array $data): Payment
    {
        return DB::transaction(function () use ($payment, $data): Payment {
            // Validate new amount if changed
            if (isset($data['amount']) && (float) $data['amount'] !== (float) $payment->amount) {
                $contract = $payment->contract;
                $remaining = $contract->totalPending() + (float) $payment->amount; // add back current
                $newAmount = (float) $data['amount'];
                $type = isset($data['payment_type'])
                    ? PaymentType::from($data['payment_type'])
                    : $payment->payment_type;

                if ($type !== PaymentType::REFUND && $newAmount > $remaining + 0.01) {
                    throw new PaymentExceedsBalanceException($newAmount, $remaining);
                }
            }

            $payment->update($data);

            return $payment->fresh()->load('contract.client');
        });
    }

    /**
     * Delete a payment.
     */
    public function delete(Payment $payment): void
    {
        $payment->delete();
    }

    /**
     * Dashboard-level payment statistics.
     *
     * @return array<string, mixed>
     */
    public function getStats(): array
    {
        return [
            'total_received' => (float) Payment::received()->sum('amount'),
            'total_pending' => (float) Payment::pending()->sum('amount'),
            'total_overdue' => (float) Payment::overdue()->sum('amount'),
            'overdue_count' => Payment::overdue()->count(),
            'monthly_revenue' => $this->getMonthlyRevenue(),
        ];
    }

    /**
     * Revenue grouped by month (last 12 months).
     *
     * @return array<int, array<string, mixed>>
     */
    private function getMonthlyRevenue(): array
    {
        $since = Carbon::now()->subMonths(12)->startOfMonth();

        $driver = DB::getDriverName();
        $monthExpr = match ($driver) {
            'pgsql' => "TO_CHAR(payment_date, 'YYYY-MM')",
            'mysql' => "DATE_FORMAT(payment_date, '%Y-%m')",
            default => "strftime('%Y-%m', payment_date)", // SQLite
        };

        return Payment::received()
            ->where('payment_date', '>=', $since)
            ->selectRaw("{$monthExpr} as month, SUM(amount) as total")
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(fn ($row) => [
                'month' => $row->month,
                'total' => round((float) $row->total, 2),
            ])
            ->all();
    }

    /**
     * Mark all overdue payments (due_date < today, still pending).
     */
    public function markOverduePayments(): int
    {
        return Payment::pending()
            ->where('due_date', '<', Carbon::today())
            ->update(['status' => PaymentStatus::OVERDUE]);
    }
}

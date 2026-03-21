<?php

declare(strict_types=1);

namespace App\Observers;

use App\Modules\Business\Models\Payment;

class PaymentObserver
{
    /**
     * After a payment is created, recalculate the contract's outstanding balance.
     */
    public function created(Payment $payment): void
    {
        $this->refreshContractProgress($payment);
    }

    /**
     * After a payment is updated (e.g. status change), recalculate the contract.
     */
    public function updated(Payment $payment): void
    {
        if ($payment->isDirty('status') || $payment->isDirty('amount')) {
            $this->refreshContractProgress($payment);
        }
    }

    /**
     * After a payment is deleted, recalculate the contract.
     */
    public function deleted(Payment $payment): void
    {
        $this->refreshContractProgress($payment);
    }

    /**
     * Recalculate contract's progress based on total received payments.
     */
    private function refreshContractProgress(Payment $payment): void
    {
        $contract = $payment->contract;

        if (! $contract || $contract->total_value <= 0) {
            return;
        }

        $totalPaid = $contract->totalPaid();
        $paymentProgress = min(100, (int) round(($totalPaid / (float) $contract->total_value) * 100));

        // Log the payment progress update
        activity('payment-workflow')
            ->performedOn($contract)
            ->withProperties([
                'payment_id' => $payment->id,
                'total_paid' => $totalPaid,
                'total_value' => (float) $contract->total_value,
                'payment_pct' => $paymentProgress,
            ])
            ->log("payment updated — contract is {$paymentProgress}% paid");
    }
}

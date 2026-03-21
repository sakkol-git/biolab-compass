<?php

declare(strict_types=1);

namespace App\Modules\Business\Services;

use App\Enums\LabServiceStatus;
use App\Enums\ServicePaymentStatus;
use App\Modules\Business\Models\LabService;
use App\Modules\Core\Services\CodeGeneratorService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LabServiceService
{
    /**
     * Paginated listing with search, status filter.
     */
    public function list(
        ?string $search = null,
        ?string $status = null,
        ?string $paymentStatus = null,
        int $perPage = 15,
    ): LengthAwarePaginator {
        return LabService::query()
            ->search($search)
            ->when($status, fn ($q) => $q->byStatus(LabServiceStatus::from($status)))
            ->when($paymentStatus, fn ($q) => $q->where('payment_status', ServicePaymentStatus::from($paymentStatus)))
            ->latest('created_at')
            ->paginate($perPage);
    }

    /**
     * Single lab service.
     */
    public function get(int $id): LabService
    {
        return LabService::findOrFail($id);
    }

    /**
     * Create a new lab service.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): LabService
    {
        $code = CodeGeneratorService::next(LabService::class, 'SVC', 'service_code');

        return LabService::create([
            'service_code' => $code,
            'service_title' => $data['service_title'],
            'service_description' => $data['service_description'] ?? null,
            'client_name' => $data['client_name'],
            'client_contact' => $data['client_contact'] ?? null,
            'status' => LabServiceStatus::from($data['status'] ?? 'pending'),
            'payment_status' => ServicePaymentStatus::from($data['payment_status'] ?? 'unpaid'),
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'service_fee' => $data['service_fee'] ?? 0,
            'assigned_staff' => $data['assigned_staff'] ?? [],
        ]);
    }

    /**
     * Update a lab service.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(LabService $service, array $data): LabService
    {
        $service->update($data);

        return $service->fresh();
    }

    /**
     * Delete a lab service.
     */
    public function delete(LabService $service): void
    {
        $service->delete();
    }

    /**
     * Dashboard-level lab service statistics.
     *
     * @return array<string, mixed>
     */
    public function getStats(): array
    {
        return [
            'total_services' => LabService::count(),
            'pending' => LabService::byStatus(LabServiceStatus::PENDING)->count(),
            'in_progress' => LabService::byStatus(LabServiceStatus::IN_PROGRESS)->count(),
            'completed' => LabService::byStatus(LabServiceStatus::COMPLETED)->count(),
            'delivered' => LabService::byStatus(LabServiceStatus::DELIVERED)->count(),
            'total_revenue' => (float) LabService::where('payment_status', ServicePaymentStatus::PAID)->sum('service_fee'),
            'pending_payments' => (float) LabService::where('payment_status', '!=', ServicePaymentStatus::PAID)->sum('service_fee'),
        ];
    }
}

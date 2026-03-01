// ═══════════════════════════════════════════════════════════════════════════
// Dashboard Service — aggregates data from multiple endpoints
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { BorrowRecordApi } from "@/types/borrow-record";
import type { PaginatedResponse } from "@/types/pagination";
import type { TransactionApi } from "@/types/transaction";

// Try dedicated dashboard endpoint first, fallback to individual endpoints
export interface DashboardData {
  plant_species_count: number;
  plant_samples_count: number;
  samples_by_status: Record<string, number>;
  plant_stocks_count: number;
  stocks_by_status: Record<string, number>;
  chemicals_count: number;
  chemicals_expired: number;
  chemicals_expiring_soon: number;
  chemicals_low_stock: number;
  equipment_count: number;
  equipment_by_status: Record<string, number>;
  overdue_borrows_count: number;
  recent_transactions: TransactionApi[];
}

export const dashboardService = {
  /** Try GET /api/dashboard first, fall back to aggregating individual endpoints */
  getData: async (): Promise<DashboardData> => {
    try {
      const res = await api.get<{ data: DashboardData }>("/dashboard");
      return res.data.data ?? (res.data as unknown as DashboardData);
    } catch {
      // Dashboard endpoint not implemented — aggregate manually
      const [species, chemicals, equipment, transactions, overdue] =
        await Promise.all([
          api
            .get<
              PaginatedResponse<unknown>
            >("/plant-species", { params: { per_page: 1 } })
            .then((r) => r.data),
          api
            .get<
              PaginatedResponse<unknown>
            >("/chemicals", { params: { per_page: 1 } })
            .then((r) => r.data),
          api
            .get<
              PaginatedResponse<unknown>
            >("/equipment", { params: { per_page: 1 } })
            .then((r) => r.data),
          api
            .get<
              PaginatedResponse<TransactionApi>
            >("/transactions", { params: { recent: 1, page: 1 } })
            .then((r) => r.data),
          api
            .get<PaginatedResponse<BorrowRecordApi>>(
              "/borrow-records/overdue",
              { params: { per_page: 1 } },
            )
            .then((r) => r.data)
            .catch(() => ({ meta: { total: 0 }, data: [] })),
        ]);

      return {
        plant_species_count: species.meta.total,
        plant_samples_count: 0,
        samples_by_status: {},
        plant_stocks_count: 0,
        stocks_by_status: {},
        chemicals_count: chemicals.meta.total,
        chemicals_expired: 0,
        chemicals_expiring_soon: 0,
        chemicals_low_stock: 0,
        equipment_count: equipment.meta.total,
        equipment_by_status: {},
        overdue_borrows_count: overdue.meta.total,
        recent_transactions: transactions.data,
      };
    }
  },
};

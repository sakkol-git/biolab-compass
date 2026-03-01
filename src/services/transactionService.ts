// ═══════════════════════════════════════════════════════════════════════════
// Transaction Service (Read-Only)
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/pagination";
import type { TransactionApi } from "@/types/transaction";

export const transactionService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<TransactionApi>>("/transactions", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api
      .get<{ data: TransactionApi }>(`/transactions/${id}`)
      .then((r) => r.data),
};

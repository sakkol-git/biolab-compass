// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Transactions (read-only)
// ═══════════════════════════════════════════════════════════════════════════

import { transactionService } from "@/services/transactionService";
import type { PaginatedResponse } from "@/types/pagination";
import type { TransactionApi } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";

export const transactionKeys = {
  all: ["transactions"] as const,
  lists: () => [...transactionKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...transactionKeys.lists(), params] as const,
  detail: (id: number) => [...transactionKeys.all, "detail", id] as const,
};

export function useTransactionList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<TransactionApi>>({
    queryKey: transactionKeys.list(params ?? {}),
    queryFn: () => transactionService.list(params),
  });
}

export function useTransactionById(id: number | undefined) {
  return useQuery({
    queryKey: transactionKeys.detail(id!),
    queryFn: () => transactionService.show(id!),
    enabled: !!id,
  });
}

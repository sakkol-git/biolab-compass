// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Borrow Records
// ═══════════════════════════════════════════════════════════════════════════

import { borrowRecordService } from "@/services/borrowRecordService";
import type {
    BorrowPayload,
    BorrowRecordApi,
    ReturnPayload,
} from "@/types/borrow-record";
import type { PaginatedResponse } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const borrowKeys = {
  all: ["borrow-records"] as const,
  lists: () => [...borrowKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...borrowKeys.lists(), params] as const,
  detail: (id: number) => [...borrowKeys.all, "detail", id] as const,
  overdue: () => [...borrowKeys.all, "overdue"] as const,
};

export function useBorrowRecordList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<BorrowRecordApi>>({
    queryKey: borrowKeys.list(params ?? {}),
    queryFn: () => borrowRecordService.list(params),
  });
}

export function useBorrowRecordById(id: number | undefined) {
  return useQuery({
    queryKey: borrowKeys.detail(id!),
    queryFn: () => borrowRecordService.show(id!),
    enabled: !!id,
  });
}

export function useOverdueBorrowRecords(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<BorrowRecordApi>>({
    queryKey: [...borrowKeys.overdue(), params ?? {}],
    queryFn: () => borrowRecordService.overdue(params),
  });
}

export function useCreateBorrowRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: BorrowPayload) => borrowRecordService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: borrowKeys.all });
      // Also invalidate equipment/chemical queries since borrow affects their status
      qc.invalidateQueries({ queryKey: ["equipment"] });
      qc.invalidateQueries({ queryKey: ["chemicals"] });
    },
  });
}

export function useReturnBorrowRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload?: ReturnPayload }) =>
      borrowRecordService.returnItem(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: borrowKeys.all });
      qc.invalidateQueries({ queryKey: ["equipment"] });
      qc.invalidateQueries({ queryKey: ["chemicals"] });
    },
  });
}

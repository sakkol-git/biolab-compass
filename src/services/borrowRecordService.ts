// ═══════════════════════════════════════════════════════════════════════════
// Borrow Record Service
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type {
    BorrowPayload,
    BorrowRecordApi,
    ReturnPayload,
} from "@/types/borrow-record";
import type { PaginatedResponse } from "@/types/pagination";

export const borrowRecordService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<BorrowRecordApi>>("/borrow-records", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api
      .get<{ data: BorrowRecordApi }>(`/borrow-records/${id}`)
      .then((r) => r.data),

  create: (payload: BorrowPayload) =>
    api
      .post<{ data: BorrowRecordApi }>("/borrow-records", payload)
      .then((r) => r.data),

  returnItem: (id: number, payload?: ReturnPayload) =>
    api
      .post<{
        data: BorrowRecordApi;
      }>(`/borrow-records/${id}/return`, payload ?? {})
      .then((r) => r.data),

  overdue: (params?: Record<string, unknown>) =>
    api
      .get<
        PaginatedResponse<BorrowRecordApi>
      >("/borrow-records/overdue", { params })
      .then((r) => r.data),
};

// ═══════════════════════════════════════════════════════════════════════════
// Chemical Service
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { ChemicalApi, ChemicalPayload } from "@/types/chemical";
import type { PaginatedResponse } from "@/types/pagination";

export const chemicalService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<ChemicalApi>>("/chemicals", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api.get<{ data: ChemicalApi }>(`/chemicals/${id}`).then((r) => r.data.data),

  create: (payload: ChemicalPayload) =>
    api.post<{ data: ChemicalApi }>("/chemicals", payload).then((r) => r.data),

  update: (id: number, payload: Partial<ChemicalPayload>) =>
    api
      .put<{ data: ChemicalApi }>(`/chemicals/${id}`, payload)
      .then((r) => r.data),

  destroy: (id: number) =>
    api.delete<{ message: string }>(`/chemicals/${id}`).then((r) => r.data),
};

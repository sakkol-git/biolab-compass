// ═══════════════════════════════════════════════════════════════════════════
// Plant Stock Service
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/pagination";
import type {
    PlantStockApi,
    PlantStockCreatePayload,
} from "@/types/plant-stock";

export const plantStockService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<PlantStockApi>>("/plant-stocks", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api
      .get<{ data: PlantStockApi }>(`/plant-stocks/${id}`)
      .then((r) => r.data.data),

  create: (payload: PlantStockCreatePayload) =>
    api
      .post<{ data: PlantStockApi }>("/plant-stocks", payload)
      .then((r) => r.data),

  update: (id: number, payload: Partial<PlantStockCreatePayload>) =>
    api
      .put<{ data: PlantStockApi }>(`/plant-stocks/${id}`, payload)
      .then((r) => r.data),

  destroy: (id: number) =>
    api.delete<{ message: string }>(`/plant-stocks/${id}`).then((r) => r.data),
};

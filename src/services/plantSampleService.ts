// ═══════════════════════════════════════════════════════════════════════════
// Plant Sample Service
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/pagination";
import type { PlantSampleApi, PlantSamplePayload } from "@/types/plant-sample";

export const plantSampleService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<PlantSampleApi>>("/plant-samples", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api
      .get<{ data: PlantSampleApi }>(`/plant-samples/${id}`)
      .then((r) => r.data.data),

  create: (payload: PlantSamplePayload) =>
    api
      .post<{ data: PlantSampleApi }>("/plant-samples", payload)
      .then((r) => r.data),

  update: (id: number, payload: Partial<PlantSamplePayload>) =>
    api
      .put<{ data: PlantSampleApi }>(`/plant-samples/${id}`, payload)
      .then((r) => r.data),

  destroy: (id: number) =>
    api.delete<{ message: string }>(`/plant-samples/${id}`).then((r) => r.data),
};

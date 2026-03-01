// ═══════════════════════════════════════════════════════════════════════════
// Plant Variety Service
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/pagination";
import type {
    PlantVarietyApi,
    PlantVarietyPayload,
} from "@/types/plant-variety";

export const plantVarietyService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<PlantVarietyApi>>("/plant-varieties", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api
      .get<{ data: PlantVarietyApi }>(`/plant-varieties/${id}`)
      .then((r) => r.data.data),

  create: (payload: PlantVarietyPayload) =>
    api
      .post<{ data: PlantVarietyApi }>("/plant-varieties", payload)
      .then((r) => r.data),

  update: (id: number, payload: Partial<PlantVarietyPayload>) =>
    api
      .put<{ data: PlantVarietyApi }>(`/plant-varieties/${id}`, payload)
      .then((r) => r.data),

  destroy: (id: number) =>
    api
      .delete<{ message: string }>(`/plant-varieties/${id}`)
      .then((r) => r.data),
};

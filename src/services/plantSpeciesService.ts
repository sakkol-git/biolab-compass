// ═══════════════════════════════════════════════════════════════════════════
// Plant Species Service
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/pagination";
import type {
    PlantSpeciesApi,
    PlantSpeciesPayload,
} from "@/types/plant-species";

export const plantSpeciesService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<PlantSpeciesApi>>("/plant-species", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api
      .get<{ data: PlantSpeciesApi }>(`/plant-species/${id}`)
      .then((r) => r.data.data),

  create: (payload: PlantSpeciesPayload) =>
    api
      .post<{ data: PlantSpeciesApi }>("/plant-species", payload)
      .then((r) => r.data),

  update: (id: number, payload: Partial<PlantSpeciesPayload>) =>
    api
      .put<{ data: PlantSpeciesApi }>(`/plant-species/${id}`, payload)
      .then((r) => r.data),

  destroy: (id: number) =>
    api.delete<{ message: string }>(`/plant-species/${id}`).then((r) => r.data),
};

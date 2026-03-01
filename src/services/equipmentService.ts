// ═══════════════════════════════════════════════════════════════════════════
// Equipment Service
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { EquipmentApi, EquipmentPayload } from "@/types/equipment";
import type { PaginatedResponse } from "@/types/pagination";

export const equipmentService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<EquipmentApi>>("/equipment", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api
      .get<{ data: EquipmentApi }>(`/equipment/${id}`)
      .then((r) => r.data.data),

  create: (payload: EquipmentPayload) =>
    api.post<{ data: EquipmentApi }>("/equipment", payload).then((r) => r.data),

  update: (id: number, payload: Partial<EquipmentPayload>) =>
    api
      .put<{ data: EquipmentApi }>(`/equipment/${id}`, payload)
      .then((r) => r.data),

  destroy: (id: number) =>
    api.delete<{ message: string }>(`/equipment/${id}`).then((r) => r.data),
};

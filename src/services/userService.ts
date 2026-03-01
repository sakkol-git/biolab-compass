// ═══════════════════════════════════════════════════════════════════════════
// User Service
// ═══════════════════════════════════════════════════════════════════════════

import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/pagination";
import type {
    LabUserApi,
    UserCreatePayload,
    UserUpdatePayload,
} from "@/types/user-api";

export const userService = {
  list: (params?: Record<string, unknown>) =>
    api
      .get<PaginatedResponse<LabUserApi>>("/users", { params })
      .then((r) => r.data),

  show: (id: number) =>
    api.get<{ data: LabUserApi }>(`/users/${id}`).then((r) => r.data),

  create: (payload: UserCreatePayload) =>
    api.post<{ data: LabUserApi }>("/users", payload).then((r) => r.data),

  update: (id: number, payload: UserUpdatePayload) =>
    api.put<{ data: LabUserApi }>(`/users/${id}`, payload).then((r) => r.data),

  destroy: (id: number) =>
    api.delete<{ message: string }>(`/users/${id}`).then((r) => r.data),
};

// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Users
// ═══════════════════════════════════════════════════════════════════════════

import { userService } from "@/services/userService";
import type { PaginatedResponse } from "@/types/pagination";
import type {
    LabUserApi,
    UserCreatePayload,
    UserUpdatePayload,
} from "@/types/user-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...userKeys.lists(), params] as const,
  detail: (id: number) => [...userKeys.all, "detail", id] as const,
};

export function useUserList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<LabUserApi>>({
    queryKey: userKeys.list(params ?? {}),
    queryFn: () => userService.list(params),
  });
}

export function useUserById(id: number | undefined) {
  return useQuery({
    queryKey: userKeys.detail(id!),
    queryFn: () => userService.show(id!),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserCreatePayload) => userService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UserUpdatePayload }) =>
      userService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userService.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  });
}

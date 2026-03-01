// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Equipment
// ═══════════════════════════════════════════════════════════════════════════

import { equipmentService } from "@/services/equipmentService";
import type { EquipmentApi, EquipmentPayload } from "@/types/equipment";
import type { PaginatedResponse } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const equipmentKeys = {
  all: ["equipment"] as const,
  lists: () => [...equipmentKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...equipmentKeys.lists(), params] as const,
  detail: (id: number) => [...equipmentKeys.all, "detail", id] as const,
};

export function useEquipmentList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<EquipmentApi>>({
    queryKey: equipmentKeys.list(params ?? {}),
    queryFn: () => equipmentService.list(params),
  });
}

export function useEquipmentById(id: number | undefined) {
  return useQuery({
    queryKey: equipmentKeys.detail(id!),
    queryFn: () => equipmentService.show(id!),
    enabled: !!id,
  });
}

export function useCreateEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: EquipmentPayload) => equipmentService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: equipmentKeys.all }),
  });
}

export function useUpdateEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<EquipmentPayload>;
    }) => equipmentService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: equipmentKeys.all }),
  });
}

export function useDeleteEquipment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => equipmentService.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: equipmentKeys.all }),
  });
}

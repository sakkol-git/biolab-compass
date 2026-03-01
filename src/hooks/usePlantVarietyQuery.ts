// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Plant Varieties
// ═══════════════════════════════════════════════════════════════════════════

import { plantVarietyService } from "@/services/plantVarietyService";
import type { PaginatedResponse } from "@/types/pagination";
import type {
    PlantVarietyApi,
    PlantVarietyPayload,
} from "@/types/plant-variety";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const varietyKeys = {
  all: ["plant-varieties"] as const,
  lists: () => [...varietyKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...varietyKeys.lists(), params] as const,
  detail: (id: number) => [...varietyKeys.all, "detail", id] as const,
};

export function usePlantVarietyList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<PlantVarietyApi>>({
    queryKey: varietyKeys.list(params ?? {}),
    queryFn: () => plantVarietyService.list(params),
  });
}

export function usePlantVarietyById(id: number | undefined) {
  return useQuery({
    queryKey: varietyKeys.detail(id!),
    queryFn: () => plantVarietyService.show(id!),
    enabled: !!id,
  });
}

export function useCreatePlantVariety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlantVarietyPayload) =>
      plantVarietyService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: varietyKeys.all }),
  });
}

export function useUpdatePlantVariety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<PlantVarietyPayload>;
    }) => plantVarietyService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: varietyKeys.all }),
  });
}

export function useDeletePlantVariety() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plantVarietyService.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: varietyKeys.all }),
  });
}

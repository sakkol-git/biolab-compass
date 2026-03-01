// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Plant Samples
// ═══════════════════════════════════════════════════════════════════════════

import { plantSampleService } from "@/services/plantSampleService";
import type { PaginatedResponse } from "@/types/pagination";
import type { PlantSampleApi, PlantSamplePayload } from "@/types/plant-sample";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const sampleKeys = {
  all: ["plant-samples"] as const,
  lists: () => [...sampleKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...sampleKeys.lists(), params] as const,
  detail: (id: number) => [...sampleKeys.all, "detail", id] as const,
};

export function usePlantSampleList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<PlantSampleApi>>({
    queryKey: sampleKeys.list(params ?? {}),
    queryFn: () => plantSampleService.list(params),
  });
}

export function usePlantSampleById(id: number | undefined) {
  return useQuery({
    queryKey: sampleKeys.detail(id!),
    queryFn: () => plantSampleService.show(id!),
    enabled: !!id,
  });
}

export function useCreatePlantSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlantSamplePayload) =>
      plantSampleService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sampleKeys.all }),
  });
}

export function useUpdatePlantSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<PlantSamplePayload>;
    }) => plantSampleService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: sampleKeys.all }),
  });
}

export function useDeletePlantSample() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plantSampleService.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: sampleKeys.all }),
  });
}

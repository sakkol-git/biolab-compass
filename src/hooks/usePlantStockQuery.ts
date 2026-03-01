// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Plant Stocks
// ═══════════════════════════════════════════════════════════════════════════

import { plantStockService } from "@/services/plantStockService";
import type { PaginatedResponse } from "@/types/pagination";
import type {
    PlantStockApi,
    PlantStockCreatePayload,
} from "@/types/plant-stock";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const stockKeys = {
  all: ["plant-stocks"] as const,
  lists: () => [...stockKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...stockKeys.lists(), params] as const,
  detail: (id: number) => [...stockKeys.all, "detail", id] as const,
};

export function usePlantStockList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<PlantStockApi>>({
    queryKey: stockKeys.list(params ?? {}),
    queryFn: () => plantStockService.list(params),
  });
}

export function usePlantStockById(id: number | undefined) {
  return useQuery({
    queryKey: stockKeys.detail(id!),
    queryFn: () => plantStockService.show(id!),
    enabled: !!id,
  });
}

export function useCreatePlantStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlantStockCreatePayload) =>
      plantStockService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: stockKeys.all }),
  });
}

export function useUpdatePlantStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<PlantStockCreatePayload>;
    }) => plantStockService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: stockKeys.all }),
  });
}

export function useDeletePlantStock() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plantStockService.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: stockKeys.all }),
  });
}

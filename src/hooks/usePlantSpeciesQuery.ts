// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Plant Species
// ═══════════════════════════════════════════════════════════════════════════

import { plantSpeciesService } from "@/services/plantSpeciesService";
import type { PaginatedResponse } from "@/types/pagination";
import type {
    PlantSpeciesApi,
    PlantSpeciesPayload,
} from "@/types/plant-species";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Query Keys ──────────────────────────────────────────────────────────

export const speciesKeys = {
  all: ["plant-species"] as const,
  lists: () => [...speciesKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...speciesKeys.lists(), params] as const,
  detail: (id: number) => [...speciesKeys.all, "detail", id] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────

export function usePlantSpeciesList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<PlantSpeciesApi>>({
    queryKey: speciesKeys.list(params ?? {}),
    queryFn: () => plantSpeciesService.list(params),
  });
}

export function usePlantSpeciesById(id: number | undefined) {
  return useQuery({
    queryKey: speciesKeys.detail(id!),
    queryFn: () => plantSpeciesService.show(id!),
    enabled: !!id,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────

export function useCreatePlantSpecies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlantSpeciesPayload) =>
      plantSpeciesService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: speciesKeys.all }),
  });
}

export function useUpdatePlantSpecies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<PlantSpeciesPayload>;
    }) => plantSpeciesService.update(id, payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: speciesKeys.all });
      qc.invalidateQueries({ queryKey: speciesKeys.detail(variables.id) });
    },
  });
}

export function useDeletePlantSpecies() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => plantSpeciesService.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: speciesKeys.all }),
  });
}

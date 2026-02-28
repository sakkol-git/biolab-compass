// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Plant Species
// ═══════════════════════════════════════════════════════════════════════════

import { plantSpeciesApi } from "@/services/plantSpeciesApi";
import type { PlantSpecies } from "@/types/inventory";
import {
    useMutation,
    useQuery,
    useQueryClient,
    type UseQueryResult,
} from "@tanstack/react-query";

// Check if a species record looks valid (backend sometimes returns all-null detail)
function isValidSpecies(s: PlantSpecies): boolean {
  return !!(s.commonName || s.scientificName);
}

// ─── Query Keys ──────────────────────────────────────────────────────────

export const speciesKeys = {
  all: ["plant-species"] as const,
  lists: () => [...speciesKeys.all, "list"] as const,
  detail: (id: string) => [...speciesKeys.all, "detail", id] as const,
};

// ─── Queries ─────────────────────────────────────────────────────────────

export function usePlantSpeciesList(): UseQueryResult<PlantSpecies[]> {
  return useQuery({
    queryKey: speciesKeys.lists(),
    queryFn: () => plantSpeciesApi.getAll(),
  });
}

export function usePlantSpeciesById(
  id: string | undefined,
): UseQueryResult<PlantSpecies> {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: speciesKeys.detail(id!),
    queryFn: async () => {
      // Try detail endpoint first
      const detail = await plantSpeciesApi.getById(id!);
      if (isValidSpecies(detail)) return detail;

      // Backend returned all-null — read from the list cache
      const cached = queryClient.getQueryData<PlantSpecies[]>(
        speciesKeys.lists(),
      );
      const found = cached?.find((s) => String(s.id) === String(id));
      if (found) return found;

      // List cache empty — fetch the list and pluck the item
      const list = await plantSpeciesApi.getAll();
      const item = list.find((s) => String(s.id) === String(id));
      if (item) return item;

      throw new Error(`Species ${id} not found`);
    },
    enabled: !!id,
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────

export function useCreatePlantSpecies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (form: Record<string, string>) => plantSpeciesApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: speciesKeys.all });
    },
  });
}

export function useUpdatePlantSpecies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: string; form: Record<string, string> }) =>
      plantSpeciesApi.update(id, form),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: speciesKeys.all });
      queryClient.invalidateQueries({
        queryKey: speciesKeys.detail(variables.id),
      });
    },
  });
}

export function useDeletePlantSpecies() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => plantSpeciesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: speciesKeys.all });
    },
  });
}

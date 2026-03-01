// ═══════════════════════════════════════════════════════════════════════════
// React Query hooks for Chemicals
// ═══════════════════════════════════════════════════════════════════════════

import { chemicalService } from "@/services/chemicalService";
import type { ChemicalApi, ChemicalPayload } from "@/types/chemical";
import type { PaginatedResponse } from "@/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const chemicalKeys = {
  all: ["chemicals"] as const,
  lists: () => [...chemicalKeys.all, "list"] as const,
  list: (params: Record<string, unknown>) =>
    [...chemicalKeys.lists(), params] as const,
  detail: (id: number) => [...chemicalKeys.all, "detail", id] as const,
};

export function useChemicalList(params?: Record<string, unknown>) {
  return useQuery<PaginatedResponse<ChemicalApi>>({
    queryKey: chemicalKeys.list(params ?? {}),
    queryFn: () => chemicalService.list(params),
  });
}

export function useChemicalById(id: number | undefined) {
  return useQuery({
    queryKey: chemicalKeys.detail(id!),
    queryFn: () => chemicalService.show(id!),
    enabled: !!id,
  });
}

export function useCreateChemical() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ChemicalPayload) => chemicalService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: chemicalKeys.all }),
  });
}

export function useUpdateChemical() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<ChemicalPayload>;
    }) => chemicalService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: chemicalKeys.all }),
  });
}

export function useDeleteChemical() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => chemicalService.destroy(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: chemicalKeys.all }),
  });
}

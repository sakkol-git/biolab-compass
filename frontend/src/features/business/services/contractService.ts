// ─── Contract Service ─────────────────────────────────────────────────────
// CRUD via createEntityService + stats, pipeline, and status transition.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import { createEntityService } from "@/core/api/createEntityService";
import type {
    ContractApi,
    ContractPayload,
    ContractStats,
    ContractStatus,
} from "@/shared/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const entity = createEntityService<ContractApi, ContractPayload>(
  "contracts",
  "/contracts",
);

export const contractKeys = {
  ...entity.keys,
  stats: () => [...entity.keys.all, "stats"] as const,
  pipeline: () => [...entity.keys.all, "pipeline"] as const,
};

export const contractService = {
  ...entity.service,

  /** GET /contracts/stats */
  stats: (): Promise<ContractStats> =>
    api.get<ContractStats>("/contracts/stats").then((r) => r.data),

  /** GET /contracts/pipeline — returns { data: Record<status, count> } */
  pipeline: (): Promise<Record<string, number>> =>
    api
      .get<{ data: Record<string, number> }>("/contracts/pipeline")
      .then((r) => r.data.data),

  /** POST /contracts/:id/transition — moves contract to a new status. */
  transition: (
    id: number,
    status: ContractStatus,
  ): Promise<{ data: ContractApi }> =>
    api
      .post<{ data: ContractApi }>(`/contracts/${id}/transition`, { status })
      .then((r) => r.data),
};

export const useContractList = entity.useList;
export const useContractById = entity.useById;
export const useCreateContract = entity.useCreate;
export const useUpdateContract = entity.useUpdate;
export const useDeleteContract = entity.useDelete;

/** Fetch dashboard-level contract statistics. */
export function useContractStats() {
  return useQuery<ContractStats>({
    queryKey: contractKeys.stats(),
    queryFn: () => contractService.stats(),
  });
}

/** Fetch pipeline summary (count per status). */
export function useContractPipeline() {
  return useQuery<Record<string, number>>({
    queryKey: contractKeys.pipeline(),
    queryFn: () => contractService.pipeline(),
  });
}

/** Transition a contract to a new status. */
export function useTransitionContract() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ContractStatus }) =>
      contractService.transition(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: contractKeys.all }),
  });
}

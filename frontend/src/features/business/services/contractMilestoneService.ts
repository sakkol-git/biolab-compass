// ─── Contract Milestone Service ───────────────────────────────────────────
// Milestones are a nested resource under contracts:
//   /contracts/:contractId/milestones
//
// We manually build the service (not using createEntityService) because
// the endpoint path is dynamic per contract.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import type {
    ContractMilestoneApi,
    ContractMilestonePayload,
} from "@/shared/types";
import type { PaginatedResponse } from "@/shared/types/pagination";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ── Query Keys ────────────────────────────────────────────────────────────

export const milestoneKeys = {
  all: ["milestones"] as const,
  byContract: (contractId: number) =>
    [...milestoneKeys.all, "contract", contractId] as const,
  detail: (contractId: number, id: number) =>
    [...milestoneKeys.byContract(contractId), "detail", id] as const,
};

// ── HTTP Service ──────────────────────────────────────────────────────────

const basePath = (contractId: number) => `/contracts/${contractId}/milestones`;

export const milestoneService = {
  /** GET /contracts/:contractId/milestones */
  list: (
    contractId: number,
    params?: Record<string, unknown>,
  ): Promise<PaginatedResponse<ContractMilestoneApi>> =>
    api
      .get<PaginatedResponse<ContractMilestoneApi>>(basePath(contractId), {
        params,
      })
      .then((r) => r.data),

  /** GET /contracts/:contractId/milestones/:id */
  show: (contractId: number, id: number): Promise<ContractMilestoneApi> =>
    api
      .get<{ data: ContractMilestoneApi }>(`${basePath(contractId)}/${id}`)
      .then((r) => r.data.data),

  /** POST /contracts/:contractId/milestones */
  create: (
    contractId: number,
    payload: ContractMilestonePayload,
  ): Promise<{ data: ContractMilestoneApi }> =>
    api
      .post<{ data: ContractMilestoneApi }>(basePath(contractId), payload)
      .then((r) => r.data),

  /** PUT /contracts/:contractId/milestones/:id */
  update: (
    contractId: number,
    id: number,
    payload: Partial<ContractMilestonePayload>,
  ): Promise<{ data: ContractMilestoneApi }> =>
    api
      .put<{
        data: ContractMilestoneApi;
      }>(`${basePath(contractId)}/${id}`, payload)
      .then((r) => r.data),

  /** DELETE /contracts/:contractId/milestones/:id */
  destroy: (contractId: number, id: number): Promise<{ message: string }> =>
    api
      .delete<{ message: string }>(`${basePath(contractId)}/${id}`)
      .then((r) => r.data),
};

// ── React Query Hooks ─────────────────────────────────────────────────────

/** List milestones for a specific contract. */
export function useMilestonesByContract(contractId: number | undefined) {
  return useQuery({
    queryKey: milestoneKeys.byContract(contractId!),
    queryFn: () => milestoneService.list(contractId!),
    enabled: !!contractId,
  });
}

/** Fetch a single milestone. */
export function useMilestoneById(
  contractId: number | undefined,
  id: number | undefined,
) {
  return useQuery({
    queryKey: milestoneKeys.detail(contractId!, id!),
    queryFn: () => milestoneService.show(contractId!, id!),
    enabled: !!contractId && !!id,
  });
}

/** Create a milestone under a contract. */
export function useCreateMilestone(contractId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ContractMilestonePayload) =>
      milestoneService.create(contractId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: milestoneKeys.byContract(contractId),
      }),
  });
}

/** Update a milestone. */
export function useUpdateMilestone(contractId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<ContractMilestonePayload>;
    }) => milestoneService.update(contractId, id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: milestoneKeys.byContract(contractId),
      }),
  });
}

/** Delete a milestone. */
export function useDeleteMilestone(contractId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => milestoneService.destroy(contractId, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: milestoneKeys.byContract(contractId),
      }),
  });
}

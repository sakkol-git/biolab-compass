// ─── Experiment Service ───────────────────────────────────────────────────
// CRUD via createEntityService + custom stats endpoint.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import { createEntityService } from "@/core/api/createEntityService";
import type {
    ExperimentApi,
    ExperimentPayload,
    ExperimentStats,
} from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

const entity = createEntityService<ExperimentApi, ExperimentPayload>(
  "experiments",
  "/experiments",
);

export const experimentKeys = entity.keys;
export const experimentService = {
  ...entity.service,

  /** GET /experiments/stats */
  stats: (): Promise<ExperimentStats> =>
    api.get<ExperimentStats>("/experiments/stats").then((r) => r.data),
};

export const useExperimentList = entity.useList;
export const useExperimentById = entity.useById;
export const useCreateExperiment = entity.useCreate;
export const useUpdateExperiment = entity.useUpdate;
export const useDeleteExperiment = entity.useDelete;

/** Fetch dashboard-level experiment statistics. */
export function useExperimentStats() {
  return useQuery<ExperimentStats>({
    queryKey: [...experimentKeys.all, "stats"],
    queryFn: () => experimentService.stats(),
  });
}

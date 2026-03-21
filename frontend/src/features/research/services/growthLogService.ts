// ─── Growth Log Service ──────────────────────────────────────────────────
// CRUD via createEntityService + custom nextWeek endpoint.
//
// NOTE: Growth logs are always scoped to an experiment. The list endpoint
// requires `experiment_id` as a query parameter.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import { createEntityService } from "@/core/api/createEntityService";
import type { GrowthLogApi, GrowthLogPayload } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

const entity = createEntityService<GrowthLogApi, GrowthLogPayload>(
  "growth-logs",
  "/growth-logs",
);

export const growthLogKeys = {
  ...entity.keys,
  /** Key for logs scoped to a specific experiment. */
  byExperiment: (experimentId: number) =>
    [...entity.keys.all, "experiment", experimentId] as const,
  nextWeek: (experimentId: number) =>
    [...entity.keys.all, "next-week", experimentId] as const,
};

export const growthLogService = {
  ...entity.service,

  /** GET /growth-logs?experiment_id=:id — returns all logs for an experiment. */
  listByExperiment: (experimentId: number) =>
    entity.service.list({ experiment_id: experimentId }),

  /** GET /growth-logs/next-week/:experimentId */
  nextWeek: (experimentId: number): Promise<{ next_week_number: number }> =>
    api
      .get<{
        next_week_number: number;
      }>(`/growth-logs/next-week/${experimentId}`)
      .then((r) => r.data),
};

export const useGrowthLogById = entity.useById;
export const useCreateGrowthLog = entity.useCreate;
export const useUpdateGrowthLog = entity.useUpdate;
export const useDeleteGrowthLog = entity.useDelete;

/** Fetch all growth logs for a given experiment. */
export function useGrowthLogsByExperiment(experimentId: number | undefined) {
  return useQuery({
    queryKey: growthLogKeys.byExperiment(experimentId!),
    queryFn: () => growthLogService.listByExperiment(experimentId!),
    enabled: !!experimentId,
  });
}

/** Fetch the next available week number for an experiment. */
export function useNextWeekNumber(experimentId: number | undefined) {
  return useQuery({
    queryKey: growthLogKeys.nextWeek(experimentId!),
    queryFn: () => growthLogService.nextWeek(experimentId!),
    enabled: !!experimentId,
  });
}

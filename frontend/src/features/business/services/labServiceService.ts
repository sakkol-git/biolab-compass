// ─── Lab Service Service ──────────────────────────────────────────────────
// CRUD via createEntityService + custom stats endpoint.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import { createEntityService } from "@/core/api/createEntityService";
import type {
    LabServiceApi,
    LabServicePayload,
    LabServiceStats,
} from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

const entity = createEntityService<LabServiceApi, LabServicePayload>(
  "lab-services",
  "/lab-services",
);

export const labServiceKeys = entity.keys;
export const labServiceService = {
  ...entity.service,

  /** GET /lab-services/stats */
  stats: (): Promise<LabServiceStats> =>
    api.get<LabServiceStats>("/lab-services/stats").then((r) => r.data),
};

export const useLabServiceList = entity.useList;
export const useLabServiceById = entity.useById;
export const useCreateLabService = entity.useCreate;
export const useUpdateLabService = entity.useUpdate;
export const useDeleteLabService = entity.useDelete;

/** Fetch dashboard-level lab service statistics. */
export function useLabServiceStats() {
  return useQuery<LabServiceStats>({
    queryKey: [...labServiceKeys.all, "stats"],
    queryFn: () => labServiceService.stats(),
  });
}

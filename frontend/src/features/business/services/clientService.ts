// ─── Client Service ───────────────────────────────────────────────────────
// CRUD via createEntityService + custom stats endpoint.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import { createEntityService } from "@/core/api/createEntityService";
import type { ClientApi, ClientPayload, ClientStats } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

const entity = createEntityService<ClientApi, ClientPayload>(
  "clients",
  "/clients",
);

export const clientKeys = entity.keys;
export const clientService = {
  ...entity.service,

  /** GET /clients/stats */
  stats: (): Promise<ClientStats> =>
    api.get<ClientStats>("/clients/stats").then((r) => r.data),
};

export const useClientList = entity.useList;
export const useClientById = entity.useById;
export const useCreateClient = entity.useCreate;
export const useUpdateClient = entity.useUpdate;
export const useDeleteClient = entity.useDelete;

/** Fetch dashboard-level client statistics. */
export function useClientStats() {
  return useQuery<ClientStats>({
    queryKey: [...clientKeys.all, "stats"],
    queryFn: () => clientService.stats(),
  });
}

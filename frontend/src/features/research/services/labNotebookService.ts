// ─── Lab Notebook Service ─────────────────────────────────────────────────
// CRUD via createEntityService + custom toggleLock endpoint.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import { createEntityService } from "@/core/api/createEntityService";
import type { LabNotebookApi, LabNotebookPayload } from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const entity = createEntityService<LabNotebookApi, LabNotebookPayload>(
  "lab-notebooks",
  "/lab-notebooks",
);

export const labNotebookKeys = entity.keys;
export const labNotebookService = {
  ...entity.service,

  /** POST /lab-notebooks/:id/toggle-lock */
  toggleLock: (id: number): Promise<{ data: LabNotebookApi }> =>
    api
      .post<{ data: LabNotebookApi }>(`/lab-notebooks/${id}/toggle-lock`)
      .then((r) => r.data),
};

export const useLabNotebookList = entity.useList;
export const useLabNotebookById = entity.useById;
export const useCreateLabNotebook = entity.useCreate;
export const useUpdateLabNotebook = entity.useUpdate;
export const useDeleteLabNotebook = entity.useDelete;

/** Toggle the lock state of a notebook entry. */
export function useToggleLabNotebookLock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => labNotebookService.toggleLock(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: labNotebookKeys.all }),
  });
}

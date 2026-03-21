// ─── Protocol Service ─────────────────────────────────────────────────────
// Standard CRUD — no custom endpoints.
// ──────────────────────────────────────────────────────────────────────────

import { createEntityService } from "@/core/api/createEntityService";
import type { ProtocolApi, ProtocolPayload } from "@/shared/types";

const entity = createEntityService<ProtocolApi, ProtocolPayload>(
  "protocols",
  "/protocols",
);

export const protocolKeys = entity.keys;
export const protocolService = entity.service;

export const useProtocolList = entity.useList;
export const useProtocolById = entity.useById;
export const useCreateProtocol = entity.useCreate;
export const useUpdateProtocol = entity.useUpdate;
export const useDeleteProtocol = entity.useDelete;

// ─── Payment Service ──────────────────────────────────────────────────────
// CRUD via createEntityService + custom stats endpoint.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import { createEntityService } from "@/core/api/createEntityService";
import type { PaymentApi, PaymentPayload, PaymentStats } from "@/shared/types";
import { useQuery } from "@tanstack/react-query";

const entity = createEntityService<PaymentApi, PaymentPayload>(
  "payments",
  "/payments",
);

export const paymentKeys = entity.keys;
export const paymentService = {
  ...entity.service,

  /** GET /payments/stats */
  stats: (): Promise<PaymentStats> =>
    api.get<PaymentStats>("/payments/stats").then((r) => r.data),
};

export const usePaymentList = entity.useList;
export const usePaymentById = entity.useById;
export const useCreatePayment = entity.useCreate;
export const useUpdatePayment = entity.useUpdate;
export const useDeletePayment = entity.useDelete;

/** Fetch dashboard-level payment statistics. */
export function usePaymentStats() {
  return useQuery<PaymentStats>({
    queryKey: [...paymentKeys.all, "stats"],
    queryFn: () => paymentService.stats(),
  });
}

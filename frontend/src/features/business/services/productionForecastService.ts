// ─── Production Forecast Service ──────────────────────────────────────────
// Non-standard CRUD: list, show, delete + calculate (no update).
//
// The factory's useUpdate is intentionally not exported — forecasts are
// immutable once calculated.
// ──────────────────────────────────────────────────────────────────────────

import { api } from "@/core/api/api";
import { createEntityService } from "@/core/api/createEntityService";
import type {
    CalculateForecastPayload,
    ProductionForecastApi,
} from "@/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const entity = createEntityService<
  ProductionForecastApi,
  CalculateForecastPayload
>("production-forecasts", "/production-forecasts");

export const forecastKeys = entity.keys;
export const forecastService = {
  list: entity.service.list,
  show: entity.service.show,
  destroy: entity.service.destroy,

  /** POST /production-forecasts/calculate — creates & persists a forecast. */
  calculate: (
    payload: CalculateForecastPayload,
  ): Promise<{ data: ProductionForecastApi }> =>
    api
      .post<{
        data: ProductionForecastApi;
      }>("/production-forecasts/calculate", payload)
      .then((r) => r.data),
};

export const useForecastList = entity.useList;
export const useForecastById = entity.useById;
export const useDeleteForecast = entity.useDelete;

/** Calculate and persist a new production forecast. */
export function useCalculateForecast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CalculateForecastPayload) =>
      forecastService.calculate(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: forecastKeys.all }),
  });
}

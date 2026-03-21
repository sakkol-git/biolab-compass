/**
 * ═══════════════════════════════════════════════════════════════════════════
 * QUERY KEYS — Centralized re-export of all TanStack Query key factories.
 *
 * Each entity hook defines its own key factory. This module re-exports
 * them all from a single location for cross-entity invalidation and
 * prefetching scenarios (e.g., borrow returns invalidate both borrow +
 * equipment queries).
 *
 * Usage:
 *   import { queryKeys } from '@/core/api/query-keys';
 *
 *   queryClient.invalidateQueries({ queryKey: queryKeys.chemicals.all });
 *   queryClient.prefetchQuery({ queryKey: queryKeys.equipment.list({}) });
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ── Inventory ─────────────────────────────────────────────────────────────
export { borrowKeys } from "@/features/inventory/services/borrowRecordService";
export { chemicalKeys } from "@/features/inventory/services/chemicalService";
export { dashboardKeys } from "@/features/inventory/services/dashboardService";
export { equipmentKeys } from "@/features/inventory/services/equipmentService";
export { sampleKeys } from "@/features/inventory/services/plantSampleService";
export { speciesKeys } from "@/features/inventory/services/plantSpeciesService";
export { stockKeys } from "@/features/inventory/services/plantStockService";
export { varietyKeys } from "@/features/inventory/services/plantVarietyService";
export { transactionKeys } from "@/features/inventory/services/transactionService";
export { userKeys } from "@/features/inventory/services/userService";

// ── Research ──────────────────────────────────────────────────────────────
export { experimentKeys } from "@/features/research/services/experimentService";
export { growthLogKeys } from "@/features/research/services/growthLogService";
export { labNotebookKeys } from "@/features/research/services/labNotebookService";
export { protocolKeys } from "@/features/research/services/protocolService";
export { speciesAnalyticsKeys } from "@/features/research/services/speciesAnalyticsService";

// ── Business ──────────────────────────────────────────────────────────────
export { clientKeys } from "@/features/business/services/clientService";
export { milestoneKeys } from "@/features/business/services/contractMilestoneService";
export { contractKeys } from "@/features/business/services/contractService";
export { labServiceKeys } from "@/features/business/services/labServiceService";
export { paymentKeys } from "@/features/business/services/paymentService";
export { forecastKeys } from "@/features/business/services/productionForecastService";

/**
 * Convenience namespace — an alternative grouped import.
 *
 * Usage:
 *   import { queryKeys } from '@/core/api/query-keys';
 *   queryKeys.chemicals.all  // ['chemicals']
 */
import { borrowKeys } from "@/features/inventory/services/borrowRecordService";
import { chemicalKeys } from "@/features/inventory/services/chemicalService";
import { dashboardKeys } from "@/features/inventory/services/dashboardService";
import { equipmentKeys } from "@/features/inventory/services/equipmentService";
import { sampleKeys } from "@/features/inventory/services/plantSampleService";
import { speciesKeys } from "@/features/inventory/services/plantSpeciesService";
import { stockKeys } from "@/features/inventory/services/plantStockService";
import { varietyKeys } from "@/features/inventory/services/plantVarietyService";
import { transactionKeys } from "@/features/inventory/services/transactionService";
import { userKeys } from "@/features/inventory/services/userService";

import { experimentKeys } from "@/features/research/services/experimentService";
import { growthLogKeys } from "@/features/research/services/growthLogService";
import { labNotebookKeys } from "@/features/research/services/labNotebookService";
import { protocolKeys } from "@/features/research/services/protocolService";
import { speciesAnalyticsKeys } from "@/features/research/services/speciesAnalyticsService";

import { clientKeys } from "@/features/business/services/clientService";
import { milestoneKeys } from "@/features/business/services/contractMilestoneService";
import { contractKeys } from "@/features/business/services/contractService";
import { labServiceKeys } from "@/features/business/services/labServiceService";
import { paymentKeys } from "@/features/business/services/paymentService";
import { forecastKeys } from "@/features/business/services/productionForecastService";

export const queryKeys = {
  // Inventory
  borrows: borrowKeys,
  chemicals: chemicalKeys,
  dashboard: dashboardKeys,
  equipment: equipmentKeys,
  samples: sampleKeys,
  species: speciesKeys,
  stocks: stockKeys,
  transactions: transactionKeys,
  users: userKeys,
  varieties: varietyKeys,

  // Research
  experiments: experimentKeys,
  growthLogs: growthLogKeys,
  protocols: protocolKeys,
  labNotebooks: labNotebookKeys,
  speciesAnalytics: speciesAnalyticsKeys,

  // Business
  clients: clientKeys,
  contracts: contractKeys,
  milestones: milestoneKeys,
  payments: paymentKeys,
  forecasts: forecastKeys,
  labServices: labServiceKeys,
} as const;

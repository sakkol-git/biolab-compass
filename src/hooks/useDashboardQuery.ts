// ═══════════════════════════════════════════════════════════════════════════
// React Query hook for Dashboard data
// ═══════════════════════════════════════════════════════════════════════════

import {
    dashboardService,
    type DashboardData,
} from "@/services/dashboardService";
import { useQuery } from "@tanstack/react-query";

export const dashboardKeys = {
  all: ["dashboard"] as const,
  data: () => [...dashboardKeys.all, "data"] as const,
};

export function useDashboardData() {
  return useQuery<DashboardData>({
    queryKey: dashboardKeys.data(),
    queryFn: () => dashboardService.getData(),
    staleTime: 30_000, // 30s to avoid hammering dashboard
    refetchInterval: 60_000, // Auto-refresh every 60s
  });
}

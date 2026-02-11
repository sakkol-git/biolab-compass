// ═══════════════════════════════════════════════════════════════════════════
// INVENTORY DASHBOARD — Custom Hook (Phase 3)
// ═══════════════════════════════════════════════════════════════════════════
//
// Owns ALL business logic: greeting computation, date formatting,
// KPI stat assembly, and full page configuration.
//
// The hook returns a memoized `InventoryDashboardConfig` — the single
// data structure consumed by the rendering engine.
// ═══════════════════════════════════════════════════════════════════════════

import { useMemo } from "react";
import {
  Leaf,
  FlaskConical,
  Wrench,
  ArrowLeftRight,
  LayoutGrid,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import type { InventoryDashboardConfig, KpiStat } from "./types";

// ─── Pure Helpers ──────────────────────────────────────────────────────────

function buildDateLabel(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function buildKpiStats(): KpiStat[] {
  return [
    {
      title: "Plant Batches",
      value: "1,247",
      subtitle: "Across 7 species",
      icon: <Leaf className="h-5 w-5 text-primary" />,
      trend: { value: 12, label: "this month", positive: true },
    },
    {
      title: "Chemical Stocks",
      value: "156",
      subtitle: "3 near expiry",
      icon: <FlaskConical className="h-5 w-5 text-primary" />,
      trend: { value: 2, label: "expiring soon", positive: false },
    },
    {
      title: "Equipment Units",
      value: "89",
      subtitle: "67 available",
      icon: <Wrench className="h-5 w-5 text-primary" />,
      trend: { value: 5, label: "utilization up", positive: true },
    },
    {
      title: "Today's Transactions",
      value: "24",
      subtitle: "8 pending approvals",
      icon: <ArrowLeftRight className="h-5 w-5 text-primary" />,
      trend: { value: 18, label: "vs yesterday", positive: true },
    },
  ];
}

// ─── Return Type ───────────────────────────────────────────────────────────

export interface UseInventoryDashboardResult {
  config: InventoryDashboardConfig;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useInventoryDashboard(): UseInventoryDashboardResult {
  const config = useMemo<InventoryDashboardConfig>(() => {
    const dateLabel = buildDateLabel();
    const kpiStats = buildKpiStats();

    return {
      header: {
        icon: LayoutGrid,
        title: "Inventory Dashboard",
        subtitle: "Monitor plant batches, chemicals, equipment, and lab transactions.",
        dateLabel,
      },

      globalWidgets: [
        { type: "kpi-row", stats: kpiStats },
      ],

      tabs: [
        // ─── Overview Tab ────────────────────────────────
        {
          id: "overview",
          label: "Overview",
          icon: LayoutGrid,
          widgets: [
            { type: "plant-health" },
            { type: "chemical-expiry" },
            { type: "equipment-availability" },
            { type: "transaction-feed" },
            { type: "activity-heatmap" },
            { type: "recent-activity" },
          ],
        },
        // ─── Analytics Tab ───────────────────────────────
        {
          id: "analytics",
          label: "Analytics",
          icon: BarChart3,
          widgets: [
            { type: "growth-trends" },
            { type: "chemical-usage" },
            { type: "species-heatmap" },
            { type: "equipment-analytics" },
            { type: "lab-performance" },
            { type: "kpi-tracker" },
            { type: "predictive-overlay" },
          ],
        },
        // ─── AI Insights Tab ─────────────────────────────
        {
          id: "insights",
          label: "AI Insights",
          icon: Lightbulb,
          widgets: [
            { type: "ai-insights" },
            { type: "kpi-tracker" },
            { type: "predictive-overlay" },
          ],
        },
      ],
    };
  }, []);

  return { config };
}

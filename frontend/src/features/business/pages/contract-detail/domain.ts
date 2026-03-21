// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT DETAIL — Pure Domain Functions (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════

import { Pencil } from "lucide-react";
import type { ActionButton } from "./types";

export const progressBarClass = (pct: number): string => {
  if (pct >= 100) return "bg-emerald-500";
  if (pct >= 50) return "bg-primary";
  return "bg-amber-500";
};

export const CONTRACT_ICON_COLOR = "hsl(210, 60%, 50%)";

export const buildActions = (): ActionButton[] => [
  {
    label: "Edit",
    icon: Pencil,
    variant: "outline",
    className: "gap-2 font-medium",
    ariaLabel: "Edit contract",
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAIL — Pure Domain Functions (Phase 2)
// ═══════════════════════════════════════════════════════════════════════════
//
// Zero React. Zero side-effects. Pure data → data transformations.
// ═══════════════════════════════════════════════════════════════════════════

import { Pencil } from "lucide-react";
import type { ActionButton } from "./types";

// ─── Constants ───────────────────────────────────────────────────────────

export const EXPERIMENT_ICON_COLOR = "hsl(145, 63%, 32%)";

// ─── Action Builders ─────────────────────────────────────────────────────

export function buildActions(): ActionButton[] {
  return [
    {
      label: "Edit",
      icon: Pencil,
      variant: "outline",
      className: "gap-2 border font-medium",
      ariaLabel: "Edit experiment",
    },
  ];
}

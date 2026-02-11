// ═══════════════════════════════════════════════════════════════════════════
// PLANT SPECIES DETAIL — Pure Domain Logic (Phase 3.1 — Functional Core)
// ═══════════════════════════════════════════════════════════════════════════
//
// Zero React. Zero hooks. Zero side effects.
// Pure functions that transform raw SpeciesDetail into domain-ready shapes.
// ═══════════════════════════════════════════════════════════════════════════

import type { ActionButton } from "./types";
import { Pencil, Sprout } from "lucide-react";

// ─── Constants ───────────────────────────────────────────────────────────

export const SPECIES_ICON_COLOR = "hsl(145, 63%, 32%)";

// ─── Action Buttons ──────────────────────────────────────────────────────

export function buildActions(scientificName: string): ActionButton[] {
  return [
    {
      label: "Edit",
      icon: Pencil,
      variant: "outline",
      className: "gap-2 border font-medium",
      ariaLabel: "Edit species",
    },
    {
      label: "View Batches",
      icon: Sprout,
      variant: "default",
      className: "gap-2 font-medium border",
      ariaLabel: "View batches for this species",
      href: `/plant-batches?species=${encodeURIComponent(scientificName)}`,
    },
  ];
}

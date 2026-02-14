// ═══════════════════════════════════════════════════════════════════════════
// PLANT STOCK DETAIL — Pure Domain Logic (Phase 3.1 — Functional Core)
// ═══════════════════════════════════════════════════════════════════════════
//
// Zero React. Zero hooks. Zero side effects.
// Pure functions for stage/status styling and action building.
// ═══════════════════════════════════════════════════════════════════════════

import { Leaf, Pencil } from "lucide-react";
import type { ActionButton } from "./types";

// ─── Stage Colors ────────────────────────────────────────────────────────

const STAGE_COLORS: Record<string, string> = {
  Seed: "hsl(210, 20%, 50%)",
  Seedling: "hsl(80, 50%, 40%)",
  Growing: "hsl(145, 63%, 32%)",
  Harvested: "hsl(38, 92%, 50%)",
  Failed: "hsl(0, 72%, 51%)",
};

const FALLBACK_STAGE_COLOR = "hsl(210, 20%, 50%)";

export function stageColor(stage: string): string {
  return STAGE_COLORS[stage] ?? FALLBACK_STAGE_COLOR;
}

// ─── Status Badge Classes ────────────────────────────────────────────────

const STATUS_BADGE_CLASSES: Record<string, string> = {
  Healthy: "bg-primary text-primary-foreground",
  Dormant: "bg-muted text-muted-foreground",
  Processed: "bg-warning/20 text-warning",
  Failed: "bg-destructive text-destructive-foreground",
};

const FALLBACK_BADGE_CLASS = "bg-muted text-muted-foreground";

export function statusBadgeClass(status: string): string {
  return STATUS_BADGE_CLASSES[status] ?? FALLBACK_BADGE_CLASS;
}

// ─── Health Score Description ────────────────────────────────────────────

export function healthDescription(score: number): string {
  if (score >= 90) return "Excellent condition — no issues detected.";
  if (score >= 70) return "Good condition — minor observations noted.";
  if (score >= 40) return "Fair condition — monitor closely.";
  return "Critical — immediate attention required.";
}

// ─── Health Score Color ──────────────────────────────────────────────────

export function healthScoreColor(score: number): string {
  if (score >= 80) return "hsl(145, 63%, 32%)";
  if (score >= 50) return "hsl(38, 92%, 50%)";
  return "hsl(0, 72%, 51%)";
}

// ─── Action Buttons ──────────────────────────────────────────────────────

export function buildActions(speciesId: string): ActionButton[] {
  return [
    {
      label: "Edit",
      icon: Pencil,
      variant: "outline",
      className: "gap-2 border font-medium",
      ariaLabel: "Edit stock entry",
    },
    {
      label: "View Species",
      icon: Leaf,
      variant: "default",
      className: "gap-2 font-medium border",
      ariaLabel: "View parent species",
      href: `/inventory/products/species/${speciesId}`,
    },
  ];
}

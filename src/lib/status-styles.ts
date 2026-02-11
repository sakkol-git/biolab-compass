/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIFIED STATUS STYLE SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Single source of truth for all status badge styles across the application.
 * Eliminates duplication (previously defined in 9+ separate files).
 *
 * Uses the minimalist design system: subtle colors, soft edges, lowercase.
 */

/* ─── Experiment Status ─────────────────────────────────────────────────── */

export const experimentStatusStyles: Record<string, string> = {
  Planning: "bg-muted text-muted-foreground",
  Active: "bg-primary/10 text-primary",
  Paused: "bg-amber-50 text-amber-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Failed: "bg-red-50 text-red-600",
};

export const experimentStatusColors: Record<string, string> = {
  Planning: "hsl(var(--muted-foreground))",
  Active: "hsl(var(--primary))",
  Paused: "#d97706",
  Completed: "#059669",
  Failed: "#dc2626",
};

/* ─── Growth Stage ──────────────────────────────────────────────────────── */

export const growthStageStyles: Record<string, string> = {
  Germination: "bg-blue-50 text-blue-600",
  Seedling: "bg-green-50 text-green-600",
  Vegetative: "bg-emerald-50 text-emerald-600",
  Hardening: "bg-amber-50 text-amber-600",
  Ready: "bg-muted text-primary",
};

/* ─── Protocol Status ───────────────────────────────────────────────────── */

export const protocolStatusStyles: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Active: "bg-primary/10 text-primary",
  Archived: "bg-amber-50 text-amber-600",
};

/* ─── Contract Status ───────────────────────────────────────────────────── */

export const contractStatusStyles: Record<string, string> = {
  Draft: "bg-muted text-muted-foreground",
  Sent: "bg-blue-50 text-blue-600",
  Signed: "bg-violet-50 text-violet-600",
  "In Production": "bg-primary/10 text-primary",
  Ready: "bg-amber-50 text-amber-600",
  Delivered: "bg-emerald-50 text-emerald-600",
  Cancelled: "bg-red-50 text-red-600",
};

/* ─── Payment Status ────────────────────────────────────────────────────── */

export const paymentStatusStyles: Record<string, string> = {
  Received: "bg-emerald-50 text-emerald-600",
  Pending: "bg-amber-50 text-amber-600",
  Overdue: "bg-red-50 text-red-600",
  Cancelled: "bg-muted text-muted-foreground",
};

/* ─── Client Type ───────────────────────────────────────────────────────── */

export const clientTypeStyles: Record<string, string> = {
  "Farm Owner": "bg-emerald-50 text-emerald-600",
  Investor: "bg-violet-50 text-violet-600",
  Government: "bg-blue-50 text-blue-600",
  NGO: "bg-amber-50 text-amber-600",
  "Research Partner": "bg-muted text-primary",
};

/* ─── Milestone Status ──────────────────────────────────────────────────── */

export const milestoneStatusStyles: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-600",
  "On Track": "bg-muted text-primary",
  "At Risk": "bg-amber-50 text-amber-600",
  Pending: "bg-muted text-muted-foreground",
  Missed: "bg-red-50 text-red-600",
};

/* ─── Reusable Status Badge Component Helper ────────────────────────────── */

/**
 * Returns the full className for a status badge.
 * Usage: `<span className={cn(statusBadge(experimentStatusStyles, status))}>{status}</span>`
 */
export function statusBadge(
  styles: Record<string, string>,
  status: string,
  _withBorder = false
): string {
  const base = "text-xs font-medium px-2.5 py-1 rounded-full";
  const variant = styles[status] ?? "bg-muted text-muted-foreground";
  return `${base} ${variant}`;
}

/* ─── Health Score Color ────────────────────────────────────────────────── */

export function healthScoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600";
  if (score >= 6) return "text-amber-600";
  return "text-red-600";
}

/* ─── Confidence Level ──────────────────────────────────────────────────── */

export function confidenceLevel(completedExperiments: number): {
  label: string;
  color: string;
  barColor: string;
  pct: number;
} {
  if (completedExperiments >= 3) {
    return { label: "HIGH", color: "text-emerald-600", barColor: "bg-emerald-500", pct: 100 };
  }
  if (completedExperiments >= 2) {
    return { label: "MEDIUM", color: "text-amber-600", barColor: "bg-amber-500", pct: 66 };
  }
  return { label: "LOW", color: "text-red-500", barColor: "bg-red-400", pct: 33 };
}

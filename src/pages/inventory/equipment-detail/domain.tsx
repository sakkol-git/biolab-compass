// ═══════════════════════════════════════════════════════════════════════════
// EQUIPMENT DETAIL — Pure Domain Logic (Phase 3.1 — Functional Core)
// ═══════════════════════════════════════════════════════════════════════════
//
// Zero React. Zero hooks. Zero side effects.
// Every function is pure: same input → same output, always.
//
// These transform raw EquipmentDetail data into domain-ready view models
// consumed by the hook layer.
// ═══════════════════════════════════════════════════════════════════════════

import type { EquipmentDetail } from "@/data/mockDetailData";
import type {
  ActionButton,
  StatusAlert,
  InfoField,
} from "./types";
import {
  Pencil,
  Zap,
  Check,
  AlertCircle,
  Clock,
} from "lucide-react";

// ─── Status Color ────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  Available: "hsl(145, 63%, 32%)",
  Borrowed: "hsl(38, 92%, 50%)",
  Maintenance: "hsl(0, 72%, 51%)",
};

const FALLBACK_STATUS_COLOR = "hsl(210, 20%, 50%)";

export function statusColor(status: string): string {
  return STATUS_COLORS[status] ?? FALLBACK_STATUS_COLOR;
}

// ─── Status Badge Class ──────────────────────────────────────────────────

const STATUS_BADGE_CLASSES: Record<string, string> = {
  Available: "bg-primary text-primary-foreground",
  Borrowed: "bg-warning text-warning-foreground",
  Maintenance: "bg-destructive text-destructive-foreground",
};

const FALLBACK_BADGE_CLASS = "bg-muted text-muted-foreground";

export function statusBadgeClass(status: string): string {
  return STATUS_BADGE_CLASSES[status] ?? FALLBACK_BADGE_CLASS;
}

// ─── Date Formatting ─────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Action Buttons ──────────────────────────────────────────────────────

export function buildActions(status: string): ActionButton[] {
  const actions: ActionButton[] = [
    {
      label: "Edit",
      icon: Pencil,
      variant: "outline",
      className: "gap-2 border font-medium",
      ariaLabel: "Edit equipment",
    },
  ];

  if (status === "Available") {
    actions.push({
      label: "Check Out",
      icon: Zap,
      variant: "default",
      className: "gap-2 font-medium border",
      ariaLabel: "Check out equipment",
    });
  }

  if (status === "Borrowed") {
    actions.push({
      label: "Return",
      icon: Check,
      variant: "outline",
      className: "gap-2 font-medium border",
      ariaLabel: "Return equipment",
    });
  }

  if (status === "Maintenance") {
    actions.push({
      label: "View Issue",
      icon: AlertCircle,
      variant: "outline",
      className:
        "gap-2 font-medium border text-destructive border-destructive",
      ariaLabel: "View maintenance issue",
    });
  }

  return actions;
}

// ─── Status Alerts ───────────────────────────────────────────────────────

export function buildAlerts(data: EquipmentDetail): StatusAlert[] {
  const alerts: StatusAlert[] = [];

  if (data.status === "Borrowed" && data.borrowedBy) {
    alerts.push({
      icon: Clock,
      borderClass: "border-warning/40",
      bgClass: "bg-warning/5",
      title: (
        <>
          Currently checked out by{" "}
          <span className="text-foreground">{data.borrowedBy}</span>
        </>
      ),
      subtitle: `Expected return: ${data.returnDate || "—"}`,
    });
  }

  if (data.status === "Maintenance" && data.issue) {
    alerts.push({
      icon: AlertCircle,
      borderClass: "border-destructive/40",
      bgClass: "bg-destructive/5",
      title: (
        <span className="text-destructive">Under Maintenance</span>
      ),
      subtitle: `Issue: ${data.issue}`,
    });
  }

  return alerts;
}

// ─── Location & Status Sidebar Fields ────────────────────────────────────

export function buildLocationStatusFields(data: EquipmentDetail): InfoField[] {
  const fields: InfoField[] = [
    { label: "Current Location", value: data.location },
    { label: "Last Maintenance", value: data.lastMaintenance || "—" },
  ];

  if (data.borrowedBy) {
    fields.push({ label: "Borrowed By", value: data.borrowedBy });
  }
  if (data.returnDate) {
    fields.push({ label: "Return Date", value: data.returnDate });
  }
  if (data.issue) {
    fields.push({ label: "Current Issue", value: data.issue });
  }

  return fields;
}

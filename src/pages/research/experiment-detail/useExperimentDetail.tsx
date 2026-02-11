// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAIL — Data Loading Hook (Phase 3)
// ═══════════════════════════════════════════════════════════════════════════
//
// Owns ALL state: loading/found, mutable logs, showLogForm toggle.
// Assembles the ExperimentPageConfig from raw mock data.
//
// The composition root never touches data — it only forwards the config.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  TestTubes,
  Calendar,
  Users,
  Sprout,
  TrendingUp,
  Activity,
  Plus,
  Clock,
  Beaker,
  Tag,
  FlaskConical,
  Target,
  Dna,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  experimentStatusStyles,
  growthStageStyles,
  statusBadge,
  healthScoreColor,
} from "@/lib/status-styles";
import { experimentsData, growthLogsData } from "@/data/mockResearchData";
import type { GrowthLog } from "@/types/research";
import type { ExperimentPageConfig, DetailSection, GrowthLogRow } from "./types";
import { EXPERIMENT_ICON_COLOR, buildActions } from "./domain";

// ─── Result Type ─────────────────────────────────────────────────────────

export type UseExperimentDetailResult =
  | { state: "loading"; id: string | undefined; config: null }
  | { state: "not-found"; id: string | undefined; config: null }
  | { state: "ready"; id: string; config: ExperimentPageConfig };

// ─── Config Assembly ─────────────────────────────────────────────────────

function buildGrowthLogRows(logs: GrowthLog[]): GrowthLogRow[] {
  return [...logs].reverse().map((log) => ({
    id: log.id,
    week: `W${log.weekNumber}`,
    logDate: log.logDate,
    seedlingCount: log.seedlingCount.toLocaleString(),
    aliveCount: log.aliveCount.toLocaleString(),
    deadCount: log.deadCount,
    newPropagations: log.newPropagations,
    survivalRatePct: log.survivalRatePct,
    healthScore: log.healthScore,
    healthScoreColor: healthScoreColor(log.healthScore),
    growthStageBadge: React.createElement(
      "span",
      { className: cn(statusBadge(growthStageStyles, log.growthStage, false)) },
      log.growthStage
    ),
    observations: log.observations,
  }));
}

function assembleConfig(
  experimentId: string,
  logs: GrowthLog[],
  showLogForm: boolean,
  setShowLogForm: (v: boolean) => void,
  handleAddLog: (logData: Omit<GrowthLog, "id" | "createdAt">) => void,
  editingLog: GrowthLog | undefined,
  onEditLog: (id: string) => void,
  onDeleteLog: (id: string) => void,
): ExperimentPageConfig | null {
  const experiment = experimentsData.find((e) => e.id === experimentId);
  if (!experiment) return null;

  // ── Computed stats ──────────────────────────────────────────────
  const stats =
    logs.length > 0
      ? (() => {
          const lastLog = logs[logs.length - 1];
          const avgSurvival =
            logs.reduce((s, l) => s + l.survivalRatePct, 0) / logs.length;
          const maxMultRate = Math.max(...logs.map((l) => l.multiplicationRate));
          return {
            avgSurvival,
            maxMultRate,
            totalWeeks: lastLog.weekNumber,
            lastStage: lastLog.growthStage,
          };
        })()
      : null;

  const nextWeek = logs.length > 0 ? logs[logs.length - 1].weekNumber + 1 : 1;

  // ── Status badge (ReactNode) ────────────────────────────────────
  const statusBadgeNode = React.createElement(
    "span",
    { className: cn(statusBadge(experimentStatusStyles, experiment.status)) },
    experiment.status
  );

  // ── Actions ─────────────────────────────────────────────────────
  const actions = buildActions();

  // ── Main sections (left column) ─────────────────────────────────
  const mainSections: DetailSection[] = [
    {
      kind: "growth-curve" as const,
      title: "Growth Curve",
      icon: TrendingUp,
      logs,
    },
    // Always include the form section; dialog visibility controlled by showForm
    {
      kind: "growth-log-form" as const,
      title: editingLog
        ? `Edit Growth Log — Week ${editingLog.weekNumber}`
        : `Record Growth Log — Week ${nextWeek}`,
      icon: Plus,
      experimentId: experiment.id,
      nextWeekNumber: nextWeek,
      showForm: showLogForm,
      onSubmit: handleAddLog,
      onCancel: () => setShowLogForm(false),
      editingLog,
      className: editingLog ? "border-amber-400/60" : "border-primary/50",
    },
  ];

  if (logs.length > 0) {
    mainSections.push({
      kind: "growth-log-table" as const,
      title: "Growth Log History",
      icon: Calendar,
      rows: buildGrowthLogRows(logs),
      onEdit: onEditLog,
      onDelete: onDeleteLog,
      action: experiment.status === "Active" ? {
        label: "Add Growth Log",
        icon: Plus,
        variant: "default" as const,
        className: "gap-2 font-medium border",
        ariaLabel: "Add growth log",
        onClick: () => setShowLogForm(true),
      } : undefined,
    });
  }

  // ── Sidebar sections (right column) ─────────────────────────────
  const sidebarSections: DetailSection[] = [
    {
      kind: "experiment-details" as const,
      title: "Experiment Details",
      icon: FlaskConical,
      fields: [
        { label: "Propagation Method", value: experiment.propagationMethod },
        { label: "Growth Medium", value: experiment.growthMedium },
        { label: "Environment", value: experiment.environment },
        { label: "Start Date", value: experiment.startDate },
        { label: "Expected End", value: experiment.expectedEndDate },
        ...(experiment.actualEndDate
          ? [{ label: "Actual End", value: experiment.actualEndDate }]
          : []),
      ],
    },
    {
      kind: "objective" as const,
      title: "Objective",
      icon: Target,
      text: experiment.objective,
    },
    {
      kind: "team" as const,
      title: "Team",
      icon: Users,
      members: experiment.assignedTo.map((name) => ({
        name,
        initial: name.charAt(0),
      })),
    },
    {
      kind: "tags" as const,
      title: "Tags",
      icon: Tag,
      tags: experiment.tags,
    },
  ];

  if (experiment.conclusion) {
    sidebarSections.push({
      kind: "conclusion" as const,
      title: "Conclusion",
      icon: Dna,
      text: experiment.conclusion,
      className: "border-emerald-300 bg-emerald-50/50",
    });
  }

  return {
    header: {
      backTo: "/research/experiments",
      backLabel: "Experiments",
      icon: TestTubes,
      iconColor: EXPERIMENT_ICON_COLOR,
      title: experiment.title,
      subtitle: `${experiment.commonName} (${experiment.speciesName})`,
      id: experiment.experimentCode,
    },
    heroImage: experiment.imageUrl ?? null,
    statusBadge: statusBadgeNode,
    kpiStrip: [
      {
        label: "Initial Seeds",
        value: experiment.initialSeedCount.toLocaleString(),
        icon: Sprout,
        color: "hsl(145, 63%, 32%)",
      },
      {
        label: "Current Count",
        value: experiment.currentCount.toLocaleString(),
        icon: Sprout,
        color: "hsl(175, 65%, 35%)",
      },
      {
        label: "Survival Rate",
        value: stats ? `${stats.avgSurvival.toFixed(1)}%` : "—",
        icon: Activity,
        color: "hsl(38, 92%, 50%)",
      },
      {
        label: "Max Mult. Rate",
        value: stats ? `${stats.maxMultRate}×` : "—",
        icon: TrendingUp,
        color: "hsl(0, 72%, 51%)",
      },
      {
        label: "Duration",
        value: stats ? `${stats.totalWeeks} wks` : "—",
        icon: Clock,
        color: "hsl(210, 60%, 50%)",
      },
      {
        label: "Growth Stage",
        value: stats?.lastStage ?? "—",
        icon: Beaker,
        color: "hsl(145, 63%, 32%)",
      },
    ],
    actions,
    mainSections,
    sidebarSections,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────

export function useExperimentDetail(): UseExperimentDetailResult {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [logs, setLogs] = useState<GrowthLog[]>(
    id && growthLogsData[id] ? [...growthLogsData[id]] : []
  );

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, [id]);

  // ── Resolve the log being edited (if any) ──────────────────────
  const editingLog = editingLogId
    ? logs.find((l) => l.id === editingLogId)
    : undefined;

  // ── CRUD handlers ──────────────────────────────────────────────
  const handleSubmitLog = (logData: Omit<GrowthLog, "id" | "createdAt">) => {
    if (editingLogId) {
      // UPDATE existing log (keep original id + createdAt)
      setLogs((prev) =>
        prev.map((log) =>
          log.id === editingLogId
            ? { ...log, ...logData }
            : log
        )
      );
      setEditingLogId(null);
    } else {
      // CREATE new log
      const newLog: GrowthLog = {
        ...logData,
        id: `GL-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setLogs((prev) => [...prev, newLog]);
    }
    setShowLogForm(false);
  };

  const handleEditLog = (logId: string) => {
    setEditingLogId(logId);
    setShowLogForm(true);
  };

  const handleDeleteLog = (logId: string) => {
    if (!window.confirm("Delete this growth log? This action cannot be undone.")) return;
    setLogs((prev) => prev.filter((log) => log.id !== logId));
    // If we were editing the deleted log, close the form
    if (editingLogId === logId) {
      setEditingLogId(null);
      setShowLogForm(false);
    }
  };

  const config = useMemo(() => {
    if (loading || !id) return null;
    return assembleConfig(
      id, logs, showLogForm, setShowLogForm, handleSubmitLog,
      editingLog, handleEditLog, handleDeleteLog,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loading, logs, showLogForm, editingLogId]);

  if (loading) return { state: "loading", id, config: null };

  if (!id || !config) return { state: "not-found", id, config: null };

  return { state: "ready", id, config };
}

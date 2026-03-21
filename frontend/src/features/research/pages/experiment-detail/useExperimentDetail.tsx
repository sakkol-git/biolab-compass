// ═══════════════════════════════════════════════════════════════════════════
// EXPERIMENT DETAIL — Data Loading Hook (Phase 4: Live API)
// ═══════════════════════════════════════════════════════════════════════════
//
// Fetches a single experiment + its growth logs via the service layer.
// All CRUD operations go through React Query mutations.
// Zero mock data.
// ═══════════════════════════════════════════════════════════════════════════

import {
  useCreateGrowthLog,
  useDeleteGrowthLog,
  useExperimentById,
  useGrowthLogsByExperiment,
  useNextWeekNumber,
  useUpdateGrowthLog,
} from "@/features/research/services";
import type { Experiment, GrowthLog } from "@/features/research/types";
import { mapExperiment, mapGrowthLog } from "@/shared/lib/api-mappers";
import {
  experimentStatusStyles,
  growthStageStyles,
  healthScoreColor,
  statusBadge,
} from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { ExperimentApi, GrowthLogPayload } from "@/shared/types";
import {
  Activity,
  Beaker,
  Calendar,
  Clock,
  Dna,
  FlaskConical,
  Plus,
  Sprout,
  Tag,
  Target,
  TestTubes,
  TrendingUp,
  Users,
} from "lucide-react";
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { EXPERIMENT_ICON_COLOR, buildActions } from "./domain";
import type {
  DetailSection,
  ExperimentPageConfig,
  GrowthLogRow,
} from "./types";

// ─── Result Type ─────────────────────────────────────────────────────────

export type UseExperimentDetailResult =
  | { state: "loading"; id: string | undefined; config: null }
  | { state: "not-found"; id: string | undefined; config: null }
  | {
      state: "ready";
      id: string;
      config: ExperimentPageConfig;
      rawData: ExperimentApi;
    };

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
      log.growthStage,
    ),
    observations: log.observations,
  }));
}

function assembleConfig(
  experiment: Experiment,
  logs: GrowthLog[],
  nextWeek: number,
  showLogForm: boolean,
  setShowLogForm: (v: boolean) => void,
  handleAddLog: (logData: Omit<GrowthLog, "id" | "createdAt">) => void,
  editingLog: GrowthLog | undefined,
  onEditLog: (id: string) => void,
  onDeleteLog: (id: string) => void,
): ExperimentPageConfig {
  // ── Computed stats ──────────────────────────────────────────────
  const stats =
    logs.length > 0
      ? (() => {
          const lastLog = logs[logs.length - 1];
          const avgSurvival =
            logs.reduce((s, l) => s + l.survivalRatePct, 0) / logs.length;
          const maxMultRate = Math.max(
            ...logs.map((l) => l.multiplicationRate),
          );
          return {
            avgSurvival,
            maxMultRate,
            totalWeeks: lastLog.weekNumber,
            lastStage: lastLog.growthStage,
          };
        })()
      : null;

  // ── Status badge (ReactNode) ────────────────────────────────────
  const statusBadgeNode = React.createElement(
    "span",
    { className: cn(statusBadge(experimentStatusStyles, experiment.status)) },
    experiment.status,
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
      action:
        experiment.status === "Active"
          ? {
              label: "Add Growth Log",
              icon: Plus,
              variant: "default" as const,
              className: "gap-2 font-medium border",
              ariaLabel: "Add growth log",
              onClick: () => setShowLogForm(true),
            }
          : undefined,
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
      members: experiment.assignedTo.map((name: string) => ({
        name,
        initial: name.charAt(0),
      })),
    },
    {
      kind: "tags" as const,
      title: "Tags",
      icon: Tag,
      tags: experiment.tags.map((t) => t.name),
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
  const numericId = id ? Number(id) : undefined;

  const [showLogForm, setShowLogForm] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);

  // ── API Queries ──────────────────────────────────────────────
  const {
    data: experimentApi,
    isLoading: expLoading,
    error: expError,
  } = useExperimentById(numericId);

  const { data: growthLogsPage, isLoading: logsLoading } =
    useGrowthLogsByExperiment(numericId);

  const { data: nextWeekData } = useNextWeekNumber(numericId);

  // ── Mutations ────────────────────────────────────────────────
  const createLog = useCreateGrowthLog();
  const updateLog = useUpdateGrowthLog();
  const deleteLog = useDeleteGrowthLog();

  const loading = expLoading || logsLoading;

  // ── Map API → display types ──────────────────────────────────
  const experiment = experimentApi ? mapExperiment(experimentApi) : null;
  const logs: GrowthLog[] = useMemo(
    () => (growthLogsPage?.data ?? []).map(mapGrowthLog),
    [growthLogsPage],
  );

  const nextWeek =
    nextWeekData?.next_week_number ??
    (logs.length > 0 ? logs[logs.length - 1].weekNumber + 1 : 1);

  // ── Resolve the log being edited (if any) ──────────────────────
  const editingLog = editingLogId
    ? logs.find((l) => l.id === editingLogId)
    : undefined;

  // ── CRUD handlers ──────────────────────────────────────────────
  const handleSubmitLog = (logData: Omit<GrowthLog, "id" | "createdAt">) => {
    if (!numericId) return;

    if (editingLogId) {
      const payload: Partial<GrowthLogPayload> = {
        week_number: logData.weekNumber,
        log_date: logData.logDate,
        growth_stage: logData.growthStage
          .toLowerCase()
          .replace(/ /g, "_") as GrowthLogPayload["growth_stage"],
        seedling_count: logData.seedlingCount,
        alive_count: logData.aliveCount,
        dead_count: logData.deadCount,
        new_propagations: logData.newPropagations,
        avg_height_cm: logData.avgHeightCm,
        observations: logData.observations,
        notes: logData.observations,
        photo_urls: logData.photoUrls,
        environmental_data: logData.environmentalData,
      };
      updateLog.mutate(
        { id: Number(editingLogId), payload },
        {
          onSuccess: () => {
            toast.success("Growth log updated");
            setEditingLogId(null);
            setShowLogForm(false);
          },
          onError: (err) => {
            console.error(
              "API Error:",
              (err as any).response?.data || (err as Error).message,
            );
            toast.error("Failed to update growth log");
          },
        },
      );
    } else {
      const payload: GrowthLogPayload = {
        experiment_id: numericId,
        week_number: logData.weekNumber,
        log_date: logData.logDate,
        growth_stage: logData.growthStage
          .toLowerCase()
          .replace(/ /g, "_") as GrowthLogPayload["growth_stage"],
        seedling_count: logData.seedlingCount,
        alive_count: logData.aliveCount,
        dead_count: logData.deadCount,
        new_propagations: logData.newPropagations,
        avg_height_cm: logData.avgHeightCm,
        observations: logData.observations,
        notes: logData.observations,
        photo_urls: logData.photoUrls,
        environmental_data: logData.environmentalData,
      };
      createLog.mutate(payload, {
        onSuccess: () => {
          toast.success("Growth log recorded");
          setShowLogForm(false);
        },
        onError: (err) => {
          console.error(
            "API Error:",
            (err as any).response?.data || (err as Error).message,
          );
          toast.error("Failed to record growth log");
        },
      });
    }
  };

  const handleEditLog = (logId: string) => {
    setEditingLogId(logId);
    setShowLogForm(true);
  };

  const handleDeleteLog = (logId: string) => {
    if (
      !window.confirm("Delete this growth log? This action cannot be undone.")
    )
      return;
    deleteLog.mutate(Number(logId), {
      onSuccess: () => {
        toast.success("Growth log deleted");
        if (editingLogId === logId) {
          setEditingLogId(null);
          setShowLogForm(false);
        }
      },
      onError: (err) => {
        console.error(
          "API Error:",
          (err as any).response?.data || (err as Error).message,
        );
        toast.error("Failed to delete growth log");
      },
    });
  };

  const config = useMemo(() => {
    if (loading || !experiment) return null;
    return assembleConfig(
      experiment,
      logs,
      nextWeek,
      showLogForm,
      setShowLogForm,
      handleSubmitLog,
      editingLog,
      handleEditLog,
      handleDeleteLog,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experiment, loading, logs, showLogForm, editingLogId, nextWeek]);

  if (loading) return { state: "loading", id, config: null };

  if (expError || !experiment || !config || !experimentApi)
    return { state: "not-found", id, config: null };

  return { state: "ready", id: id!, config, rawData: experimentApi };
}

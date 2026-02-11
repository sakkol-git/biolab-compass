// ═══════════════════════════════════════════════════════════════════════════
// PLANT BATCH DETAIL — Typed Custom Hook (Phase 3.2 — Imperative Shell)
// ═══════════════════════════════════════════════════════════════════════════
//
// Owns data fetching, loading state, and config assembly.
// Returns a domain-ready view model — never raw API responses.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Sprout,
  Leaf,
  HeartPulse,
  MapPin,
  Activity,
  Milestone,
  Thermometer,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { batchDetailData, type BatchDetail } from "@/data/mockDetailData";
import type { BatchPageConfig } from "./types";
import {
  stageColor,
  statusBadgeClass,
  healthDescription,
  healthScoreColor,
  buildActions,
} from "./domain";

// ─── Return Type ─────────────────────────────────────────────────────────

interface UseBatchDetailResult {
  state: "loading" | "not-found" | "ready";
  id: string | undefined;
  config: BatchPageConfig | null;
}

// ─── Config Assembly (pure transform) ────────────────────────────────────

function assembleConfig(data: BatchDetail): BatchPageConfig {
  const color = stageColor(data.stage);
  const badgeClass = statusBadgeClass(data.status);

  return {
    header: {
      backTo: "/inventory/plant-batches",
      backLabel: "All Batches",
      icon: Sprout,
      iconColor: color,
      title: `${data.commonName} Batch`,
      subtitle: `${data.species} — ${data.stage}`,
      id: data.id,
    },

    heroImage: data.imageUrl
      ? { url: data.imageUrl, alt: data.commonName, fallbackIcon: Sprout }
      : null,

    kpiStrip: [
      {
        label: "Quantity",
        value: data.quantity.toLocaleString(),
        icon: Sprout,
        color,
      },
      {
        label: "Health Score",
        value: `${data.healthScore}%`,
        icon: HeartPulse,
        color: healthScoreColor(data.healthScore),
      },
      {
        label: "Stage",
        value: data.stage,
        icon: Activity,
        color,
      },
      {
        label: "Location",
        value: data.location,
        icon: MapPin,
        color: "hsl(210, 60%, 50%)",
      },
    ],

    actions: buildActions(data.speciesId),

    mainSections: [
      {
        kind: "batch-info",
        title: "Batch Information",
        icon: Sprout,
        fields: [
          {
            label: "Species",
            value: data.species,
          },
          { label: "Common Name", value: data.commonName },
          { label: "Source Material", value: data.sourceMaterial },
          { label: "Sowing Date", value: data.startDate, mono: true },
          { label: "Expected Harvest", value: data.expectedHarvestDate, mono: true },
          { label: "Assigned To", value: data.assignedTo },
        ],
        statusBadge: (
          <Badge className={cn("text-xs", badgeClass)}>{data.status}</Badge>
        ),
        notes: data.notes || null,
      },
      {
        kind: "health-score",
        title: "Health Score",
        icon: HeartPulse,
        score: data.healthScore,
        description: healthDescription(data.healthScore),
      },
      {
        kind: "growth-milestones",
        title: "Growth Milestones",
        icon: Milestone,
        milestones: data.growthMilestones,
      },
    ],

    sidebarSections: [
      {
        kind: "environmental-log",
        title: "Environmental Log",
        icon: Thermometer,
        readings: data.environmentalLog,
      },
      {
        kind: "parent-species",
        title: "Parent Species",
        icon: Leaf,
        commonName: data.commonName,
        scientificName: data.species,
        href: `/inventory/products/species/${data.speciesId}`,
      },
      {
        kind: "quick-info",
        title: "Quick Info",
        icon: Clock,
        fields: [
          { label: "Batch ID", value: data.id, mono: true },
          { label: "Created", value: data.startDate, mono: true },
          { label: "Assigned To", value: data.assignedTo },
          { label: "Location", value: data.location },
        ],
      },
    ],
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────

export function useBatchDetail(): UseBatchDetailResult {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<BatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    const timer = setTimeout(() => {
      if (id && batchDetailData[id]) {
        setData(batchDetailData[id]);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [id]);

  const config = useMemo(
    () => (data ? assembleConfig(data) : null),
    [data]
  );

  if (loading) return { state: "loading", id, config: null };
  if (notFound || !data) return { state: "not-found", id, config: null };
  return { state: "ready", id, config };
}

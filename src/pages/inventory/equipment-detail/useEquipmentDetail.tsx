// ═══════════════════════════════════════════════════════════════════════════
// EQUIPMENT DETAIL — Typed Custom Hook (Phase 3.2 — Imperative Shell)
// ═══════════════════════════════════════════════════════════════════════════
//
// This is the ONLY file that touches React hooks and side effects.
// It owns:
//   1. Data fetching (simulated async)
//   2. Loading / not-found state machine
//   3. Assembly of the EquipmentPageConfig via pure domain functions
//
// The hook returns a domain-ready view model — never raw API responses.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  Wrench,
  Settings,
  History,
  Users,
  DollarSign,
  MapPin,
  FileText,
  Activity,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { equipmentDetailData, type EquipmentDetail } from "@/data/mockDetailData";
import type { EquipmentPageConfig } from "./types";
import {
  statusColor,
  statusBadgeClass,
  formatDate,
  buildActions,
  buildAlerts,
  buildLocationStatusFields,
} from "./domain";

// ─── Return Type ─────────────────────────────────────────────────────────

interface UseEquipmentDetailResult {
  state: "loading" | "not-found" | "ready";
  id: string | undefined;
  config: EquipmentPageConfig | null;
}

// ─── Config Assembly (pure transform) ────────────────────────────────────

function assembleConfig(data: EquipmentDetail): EquipmentPageConfig {
  const color = statusColor(data.status);
  const badgeClass = statusBadgeClass(data.status);

  return {
    header: {
      backTo: "/inventory/equipment",
      backLabel: "All Equipment",
      icon: Wrench,
      iconColor: color,
      title: data.name,
      subtitle: `${data.manufacturer} ${data.model} — ${data.category}`,
      id: data.id,
    },

    heroImage: data.imageUrl
      ? { url: data.imageUrl, alt: data.name, fallbackIcon: Wrench }
      : null,

    kpiStrip: [
      {
        label: "Status",
        value: (
          <Badge className={cn("text-xs", badgeClass)}>{data.status}</Badge>
        ),
        icon: Activity,
        color,
      },
      {
        label: "Location",
        value: data.location,
        icon: MapPin,
        color: "hsl(210, 60%, 50%)",
      },
      {
        label: "Purchase Price",
        value: data.purchasePrice,
        icon: DollarSign,
        color: "hsl(145, 63%, 32%)",
      },
      {
        label: "Current Value",
        value: data.currentValue,
        icon: TrendingDown,
        color: "hsl(38, 92%, 50%)",
      },
    ],

    alerts: buildAlerts(data),
    actions: buildActions(data.status),

    mainSections: [
      {
        kind: "specifications",
        title: "Specifications",
        icon: Settings,
        coreFields: [
          { label: "Manufacturer", value: data.manufacturer },
          { label: "Model", value: data.model },
          { label: "Serial Number", value: data.serialNumber, mono: true },
          { label: "Category", value: data.category },
        ],
        specifications: data.specifications,
      },
      {
        kind: "maintenance-history",
        title: "Maintenance History",
        icon: History,
        records: data.maintenanceHistory,
      },
      {
        kind: "usage-log",
        title: "Recent Usage",
        icon: Users,
        records: data.usageLog,
      },
    ],

    sidebarSections: [
      {
        kind: "financial",
        title: "Financial",
        icon: DollarSign,
        fields: [
          { label: "Purchase Date", value: formatDate(data.purchaseDate), mono: true },
          { label: "Purchase Price", value: data.purchasePrice },
          { label: "Current Value", value: data.currentValue },
          { label: "Depreciation", value: data.depreciationRate },
          { label: "Warranty Expiry", value: formatDate(data.warrantyExpiry), mono: true },
        ],
      },
      {
        kind: "location-status",
        title: "Location & Status",
        icon: MapPin,
        fields: [
          ...buildLocationStatusFields(data),
          {
            label: "Status",
            value: (
              <Badge className={cn("text-xs", badgeClass)}>
                {data.status}
              </Badge>
            ),
          },
        ],
      },
      ...(data.notes
        ? [
            {
              kind: "notes" as const,
              title: "Notes",
              icon: FileText,
              content: data.notes,
            },
          ]
        : []),
    ],
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────

export function useEquipmentDetail(): UseEquipmentDetailResult {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<EquipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    const timer = setTimeout(() => {
      if (id && equipmentDetailData[id]) {
        setData(equipmentDetailData[id]);
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

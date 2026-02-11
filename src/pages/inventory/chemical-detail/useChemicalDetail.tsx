// ═══════════════════════════════════════════════════════════════════════════
// CHEMICAL DETAIL — Data Loading Hook (Phase 3)
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  FlaskConical,
  AlertTriangle,
  MapPin,
  Calendar,
  Package,
  Beaker,
  Shield,
  Users,
  Thermometer,
  Truck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  chemicalDetailData,
  type ChemicalDetail,
} from "@/data/mockDetailData";
import type { ChemicalPageConfig, DetailSection } from "./types";
import {
  hazardColor,
  hazardBadgeClass,
  expiryBadge,
  expiryColor,
  formatDate,
  CHEMICAL_FALLBACK_ICON,
  buildActions,
} from "./domain";

// ─── Config Assembly ─────────────────────────────────────────────────────

function assembleConfig(data: ChemicalDetail): ChemicalPageConfig {
  const hazColor = hazardColor(data.hazard);
  const expiry = expiryBadge(data.daysLeft);

  const mainSections: DetailSection[] = [
    {
      kind: "chemical-properties" as const,
      title: "Chemical Properties",
      icon: Beaker,
      fields: [
        { label: "Product Name", value: data.name },
        { label: "CAS Number", value: data.cas, mono: true },
        { label: "Concentration", value: data.concentration },
        { label: "Molecular Weight", value: data.molecularWeight },
        { label: "Purity", value: data.purity },
        { label: "Lot Number", value: data.lotNumber, mono: true },
      ],
    },
    {
      kind: "safety-hazard" as const,
      title: "Safety & Hazard Information",
      icon: Shield,
      fields: [
        { label: "Safety Classification", value: data.safetyClass },
        {
          label: "Hazard Level",
          value: React.createElement(
            Badge,
            { className: cn("text-xs", hazardBadgeClass(data.hazard)) },
            data.hazard.toUpperCase()
          ),
        },
      ],
      ghsTags: data.ghs,
      notes: data.notes || null,
    },
    {
      kind: "usage-records" as const,
      title: "Usage Records",
      icon: Users,
      records: data.usageRecords,
    },
  ];

  const sidebarSections: DetailSection[] = [
    {
      kind: "storage-requirements" as const,
      title: "Storage Requirements",
      icon: Thermometer,
      fields: [
        { label: "Storage Temp", value: data.storageTemp },
        { label: "Conditions", value: data.storageConditions },
        { label: "Location", value: data.location },
      ],
    },
    {
      kind: "supplier-details" as const,
      title: "Supplier Details",
      icon: Truck,
      fields: [
        { label: "Supplier", value: data.supplier },
        { label: "Catalog #", value: data.supplierCatalog, mono: true },
        { label: "Lot #", value: data.lotNumber, mono: true },
        { label: "Date Received", value: formatDate(data.dateReceived) },
      ],
    },
    {
      kind: "dates" as const,
      title: "Dates",
      icon: Calendar,
      fields: [
        { label: "Received", value: formatDate(data.dateReceived), mono: true },
        {
          label: "Expiry",
          value: React.createElement(
            "span",
            { className: "flex items-center gap-2" },
            React.createElement(
              "span",
              { className: "font-mono text-sm" },
              formatDate(data.expiry)
            ),
            React.createElement(
              Badge,
              { className: cn("text-xs", expiry.className) },
              expiry.label
            )
          ),
        },
      ],
    },
  ];

  return {
    header: {
      backTo: "/inventory/chemicals",
      backLabel: "All Chemicals",
      icon: FlaskConical,
      iconColor: hazColor,
      title: data.name,
      subtitle: `CAS ${data.cas}`,
      id: data.id,
    },
    heroImage: data.imageUrl
      ? { url: data.imageUrl, alt: data.name, fallbackIcon: CHEMICAL_FALLBACK_ICON }
      : null,
    kpiStrip: [
      { label: "Quantity", value: data.quantity, icon: Package, color: "hsl(210, 60%, 50%)" },
      {
        label: "Hazard Level",
        value: React.createElement(
          Badge,
          { className: cn("text-xs", hazardBadgeClass(data.hazard)) },
          data.hazard.toUpperCase()
        ),
        icon: AlertTriangle,
        color: hazColor,
      },
      {
        label: "Expiry",
        value: React.createElement(
          Badge,
          { className: cn("text-xs", expiry.className) },
          expiry.label
        ),
        icon: Calendar,
        color: expiryColor(data.daysLeft),
      },
      { label: "Location", value: data.location, icon: MapPin, color: "hsl(175, 65%, 35%)" },
    ],
    actions: buildActions(),
    mainSections,
    sidebarSections,
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────

export type UseChemicalDetailResult =
  | { state: "loading"; id: string | undefined; config: null }
  | { state: "not-found"; id: string | undefined; config: null }
  | { state: "ready"; id: string; config: ChemicalPageConfig };

export function useChemicalDetail(): UseChemicalDetailResult {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ChemicalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    const timer = setTimeout(() => {
      if (id && chemicalDetailData[id]) {
        setData(chemicalDetailData[id]);
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
  if (notFound || !config) return { state: "not-found", id, config: null };
  return { state: "ready", id: id!, config };
}

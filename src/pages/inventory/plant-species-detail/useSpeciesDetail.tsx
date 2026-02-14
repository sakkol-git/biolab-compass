// ═══════════════════════════════════════════════════════════════════════════
// PLANT SPECIES DETAIL — Typed Custom Hook (Phase 3.2 — Imperative Shell)
// ═══════════════════════════════════════════════════════════════════════════
//
// Owns data fetching, loading state, and config assembly.
// Returns a domain-ready view model — never raw API responses.
// ═══════════════════════════════════════════════════════════════════════════

import { speciesDetailData, type SpeciesDetail } from "@/data/mockDetailData";
import {
    Clock,
    Droplets,
    Flower2,
    Layers,
    Leaf,
    Ruler,
    Sprout,
    Tag,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { SPECIES_ICON_COLOR, buildActions } from "./domain";
import type { SpeciesPageConfig } from "./types";

// ─── Return Type ─────────────────────────────────────────────────────────

interface UseSpeciesDetailResult {
  state: "loading" | "not-found" | "ready";
  id: string | undefined;
  config: SpeciesPageConfig | null;
}

// ─── Config Assembly (pure transform) ────────────────────────────────────

function assembleConfig(data: SpeciesDetail): SpeciesPageConfig {
  return {
    header: {
      backTo: "/inventory/plant-species",
      backLabel: "All Species",
      icon: Leaf,
      iconColor: SPECIES_ICON_COLOR,
      title: data.commonName,
      subtitle: data.scientificName,
      id: data.id,
    },

    heroImage: data.imageUrl
      ? { url: data.imageUrl, alt: data.commonName, fallbackIcon: Sprout }
      : null,

    kpiStrip: [
      {
        label: "Active Batches",
        value: data.activeBatches,
        icon: Layers,
        color: "hsl(210, 60%, 50%)",
      },
      {
        label: "Total Plants",
        value: data.totalPlants.toLocaleString(),
        icon: Sprout,
        color: SPECIES_ICON_COLOR,
      },
      {
        label: "Maturity",
        value: `${data.maturityDays} days`,
        icon: Clock,
        color: "hsl(38, 92%, 50%)",
      },
      {
        label: "Max Height",
        value: data.maxHeight,
        icon: Ruler,
        color: "hsl(175, 65%, 35%)",
      },
    ],

    actions: buildActions(data.scientificName),

    mainSections: [
      {
        kind: "botanical-description",
        title: "Botanical Description",
        icon: Flower2,
        description: data.description,
        fields: [
          { label: "Family", value: data.family },
          { label: "Growth Type", value: data.growthType },
          { label: "Native Region", value: data.nativeRegion },
          { label: "Propagation", value: data.propagation },
          { label: "Optimal Temp", value: data.optimalTemp },
          { label: "Max Height", value: data.maxHeight },
        ],
      },
      {
        kind: "associated-batches",
        title: "Current Stock",
        icon: Sprout,
        batches: data.associatedBatches,
        viewAllHref: `/plant-stock?species=${encodeURIComponent(data.scientificName)}`,
      },
    ],

    sidebarSections: [
      {
        kind: "care-requirements",
        title: "Care Requirements",
        icon: Droplets,
        fields: [
          { label: "Light", value: data.lightRequirement },
          { label: "Water", value: data.waterRequirement },
          { label: "Soil", value: data.soilType },
          { label: "Humidity", value: data.humidity },
          { label: "Optimal Temperature", value: data.optimalTemp },
        ],
      },
      {
        kind: "tags",
        title: "Tags",
        icon: Tag,
        tags: data.tags,
      },
    ],
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────

export function useSpeciesDetail(): UseSpeciesDetailResult {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<SpeciesDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);

    const timer = setTimeout(() => {
      if (id && speciesDetailData[id]) {
        setData(speciesDetailData[id]);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [id]);

  const config = useMemo(() => (data ? assembleConfig(data) : null), [data]);

  if (loading) return { state: "loading", id, config: null };
  if (notFound || !data) return { state: "not-found", id, config: null };
  return { state: "ready", id, config };
}

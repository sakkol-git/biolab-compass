// ═══════════════════════════════════════════════════════════════════════════
// PLANT SPECIES DETAIL — Typed Custom Hook (Backend-Connected)
// ═══════════════════════════════════════════════════════════════════════════
//
// Fetches single species from Laravel backend via React Query.
// Returns a domain-ready view model — never raw API responses.
// ═══════════════════════════════════════════════════════════════════════════

import { usePlantSpeciesById } from "@/hooks/usePlantSpeciesQuery";
import type { PlantSpecies } from "@/types/inventory";
import { Flower2, Layers, Leaf, Sprout } from "lucide-react";
import { useMemo } from "react";
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

function assembleConfig(data: PlantSpecies): SpeciesPageConfig {
  const title = data.commonName
    ? data.commonName + (data.khmerName ? ` (${data.khmerName})` : "")
    : data.scientificName || `Species #${data.id}`;

  return {
    header: {
      backTo: "/inventory/plant-species",
      backLabel: "All Species",
      icon: Leaf,
      iconColor: SPECIES_ICON_COLOR,
      title,
      subtitle: data.scientificName || "",
      id: data.id && data.id !== "null" ? data.id : "",
    },

    heroImage: data.imageUrl
      ? { url: data.imageUrl, alt: data.commonName, fallbackIcon: Sprout }
      : null,

    kpiStrip: [
      {
        label: "Varieties",
        value: data.varietyCount,
        icon: Layers,
        color: "hsl(210, 60%, 50%)",
      },
      {
        label: "Samples",
        value: data.sampleCount,
        icon: Sprout,
        color: SPECIES_ICON_COLOR,
      },
    ],

    actions: buildActions(data.scientificName),

    mainSections: [
      {
        kind: "botanical-description",
        title: "Botanical Description",
        icon: Flower2,
        description: data.description || "No description available.",
        fields: [
          { label: "Family", value: data.family || "—" },
          { label: "Growth Type", value: data.growthType || "—" },
          { label: "Native Region", value: data.nativeRegion || "—" },
          {
            label: "Propagation Method",
            value: data.propagationMethod || "—",
          },
        ],
      },
    ],

    sidebarSections: [],
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────

export function useSpeciesDetail(): UseSpeciesDetailResult {
  const { id } = useParams<{ id: string }>();

  // Guard: treat the literal string "null" or "undefined" in the URL as not-found
  const safeId = id && id !== "null" && id !== "undefined" ? id : undefined;

  const { data, isLoading, isError } = usePlantSpeciesById(safeId);

  const config = useMemo(() => (data ? assembleConfig(data) : null), [data]);

  if (isLoading) return { state: "loading", id, config: null };
  if (isError || !data) return { state: "not-found", id, config: null };
  return { state: "ready", id, config };
}

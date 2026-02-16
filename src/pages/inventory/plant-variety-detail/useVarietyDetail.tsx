// ═══════════════════════════════════════════════════════════════════════════
// PLANT VARIETY DETAIL — Typed Custom Hook
// ═══════════════════════════════════════════════════════════════════════════

import { Badge } from "@/components/ui/badge";
import { plantVarietiesData } from "@/data/mockInventoryData";
import { cn } from "@/lib/utils";
import type { PlantVariety } from "@/types/inventory";
import {
    Calendar,
    Dna,
    FileText,
    Image as ImageIcon,
    Info,
    MapPin,
    Sprout,
    User
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { buildActions, statusBadgeClass, statusColor } from "./domain";
import type { VarietyPageConfig } from "./types";

// ─── Return Type ─────────────────────────────────────────────────────────

interface UseVarietyDetailResult {
  state: "loading" | "not-found" | "ready";
  id: string | undefined;
  config: VarietyPageConfig | null;
}

// ─── Config Assembly (pure transform) ──────────────────────────────────────

function assembleConfig(data: PlantVariety): VarietyPageConfig {
  const color = statusColor(data.status);
  const badgeClass = statusBadgeClass(data.status);

  return {
    header: {
      backTo: "/inventory/plant-varieties",
      backLabel: "All Varieties",
      icon: Sprout,
      iconColor: color,
      title: data.name,
      subtitle: `${data.speciesName} — ${data.varietyCode}`,
      id: data.id,
    },

    heroImage:
      data.images && data.images.length > 0
        ? { url: data.images[0], alt: data.name, fallbackIcon: Sprout }
        : null,

    kpiStrip: [
      {
        label: "Status",
        value: data.status,
        icon: Info,
        color,
      },
      {
        label: "Origin",
        value: data.originLocation,
        icon: MapPin,
        color: "hsl(210, 60%, 50%)",
      },
      {
        label: "Unique Code",
        value: data.uniqueCode,
        icon: Sprout,
        color: "hsl(145, 63%, 32%)",
      },
      ...(data.germinationRate
        ? [
            {
              label: "Germination",
              value: `${data.germinationRate}%`,
              icon: Dna,
              color: "hsl(38, 92%, 50%)",
            },
          ]
        : []),
    ],

    actions: buildActions(data.speciesId),

    mainSections: [
      {
        kind: "variety-info" as const,
        title: "Variety Information",
        icon: Sprout,
        fields: [
          {
            label: "Species",
            value: data.speciesName,
          },
          {
            label: "Variety Code",
            value: data.varietyCode,
          },
          {
            label: "Unique Code",
            value: data.uniqueCode,
          },
          {
            label: "Origin Location",
            value: data.originLocation,
          },
          ...(data.dateBrought
            ? [
                {
                  label: "Date Brought",
                  value: new Date(data.dateBrought).toLocaleDateString(),
                },
              ]
            : []),
          ...(data.description
            ? [
                {
                  label: "Description",
                  value: data.description,
                },
              ]
            : []),
        ],
        statusBadge: (
          <Badge className={cn(badgeClass, "font-medium")}>{data.status}</Badge>
        ),
      },

      ...(data.ownershipUserName
        ? [
            {
              kind: "ownership" as const,
              title: "Ownership & Department",
              icon: User,
              fields: [
                {
                  label: "Owner",
                  value: data.ownershipUserName,
                },
                ...(data.ownershipDepartment
                  ? [
                      {
                        label: "Department",
                        value: data.ownershipDepartment,
                      },
                    ]
                  : []),
                ...(data.ownershipUserId
                  ? [
                      {
                        label: "User ID",
                        value: data.ownershipUserId,
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),

      ...(data.traits && data.traits.length > 0
        ? [
            {
              kind: "traits" as const,
              title: "Traits & Characteristics",
              icon: Dna,
              traits: data.traits,
            },
          ]
        : []),

      ...(data.germinationRate || data.diseaseResistance || data.maturityDays
        ? [
            {
              kind: "genetic-info" as const,
              title: "Genetic & Performance Data",
              icon: Dna,
              fields: [
                ...(data.germinationRate
                  ? [
                      {
                        label: "Germination Rate",
                        value: `${data.germinationRate}%`,
                      },
                    ]
                  : []),
                ...(data.diseaseResistance
                  ? [
                      {
                        label: "Disease Resistance",
                        value: data.diseaseResistance,
                      },
                    ]
                  : []),
                ...(data.maturityDays
                  ? [
                      {
                        label: "Days to Maturity",
                        value: `${data.maturityDays} days`,
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
    ],

    sidebarSections: [
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
      ...(data.images && data.images.length > 0
        ? [
            {
              kind: "images" as const,
              title: "Images",
              icon: ImageIcon,
              images: data.images,
            },
          ]
        : []),
      {
        kind: "variety-info" as const,
        title: "Metadata",
        icon: Calendar,
        fields: [
          {
            label: "Created",
            value: new Date(data.createdAt).toLocaleDateString(),
          },
          ...(data.updatedAt
            ? [
                {
                  label: "Last Updated",
                  value: new Date(data.updatedAt).toLocaleDateString(),
                },
              ]
            : []),
          ...(data.updatedBy
            ? [
                {
                  label: "Updated By",
                  value: data.updatedBy,
                },
              ]
            : []),
        ],
        statusBadge: null,
      },
    ],
  };
}

// ─── Hook ────────────────────────────────────────────────────────────────

export function useVarietyDetail(): UseVarietyDetailResult {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<"loading" | "not-found" | "ready">(
    "loading",
  );

  const variety = useMemo(() => {
    return plantVarietiesData.find((v) => v.id === id);
  }, [id]);

  const config = useMemo(() => {
    return variety ? assembleConfig(variety) : null;
  }, [variety]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(variety ? "ready" : "not-found");
    }, 150);
    return () => clearTimeout(timer);
  }, [variety]);

  return { state, id, config };
}

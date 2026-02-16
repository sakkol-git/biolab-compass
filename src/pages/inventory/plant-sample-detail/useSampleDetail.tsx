// ═══════════════════════════════════════════════════════════════════════════
// PLANT SAMPLE DETAIL — Typed Custom Hook
// ═══════════════════════════════════════════════════════════════════════════

import { Badge } from "@/components/ui/badge";
import { plantSamplesData } from "@/data/mockInventoryData";
import { cn } from "@/lib/utils";
import type { PlantSample } from "@/types/inventory";
import {
    Calendar,
    FileText,
    Image as ImageIcon,
    Info,
    MapPin,
    Package,
    TestTube,
    Thermometer,
    User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { buildActions, statusBadgeClass, statusColor } from "./domain";
import type { SamplePageConfig } from "./types";

// ─── Return Type ─────────────────────────────────────────────────────────

interface UseSampleDetailResult {
  state: "loading" | "not-found" | "ready";
  id: string | undefined;
  config: SamplePageConfig | null;
}

// ─── Config Assembly (pure transform) ──────────────────────────────────────

function assembleConfig(data: PlantSample): SamplePageConfig {
  const color = statusColor(data.status);
  const badgeClass = statusBadgeClass(data.status);

  return {
    header: {
      backTo: "/inventory/plant-samples",
      backLabel: "All Samples",
      icon: TestTube,
      iconColor: color,
      title: data.name,
      subtitle: `${data.speciesName} — ${data.sampleCode}`,
      id: data.id,
    },

    heroImage:
      data.images && data.images.length > 0
        ? { url: data.images[0], alt: data.name, fallbackIcon: TestTube }
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
        icon: TestTube,
        color: "hsl(145, 63%, 32%)",
      },
      ...(data.quantity
        ? [
            {
              label: "Quantity",
              value: `${data.quantity} ${data.quantityUnit || "units"}`,
              icon: Package,
              color: "hsl(38, 92%, 50%)",
            },
          ]
        : []),
    ],

    actions: buildActions(data.speciesId, data.varietyId),

    mainSections: [
      {
        kind: "sample-info" as const,
        title: "Sample Information",
        icon: TestTube,
        fields: [
          {
            label: "Species",
            value: data.speciesName,
          },
          ...(data.varietyName
            ? [
                {
                  label: "Variety",
                  value: data.varietyName,
                },
              ]
            : []),
          {
            label: "Sample Code",
            value: data.sampleCode,
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

      ...(data.quantity || data.storageLocation || data.storageConditions
        ? [
            {
              kind: "storage" as const,
              title: "Storage & Inventory",
              icon: Thermometer,
              fields: [
                ...(data.quantity
                  ? [
                      {
                        label: "Quantity",
                        value: `${data.quantity} ${data.quantityUnit || "units"}`,
                      },
                    ]
                  : []),
                ...(data.storageLocation
                  ? [
                      {
                        label: "Storage Location",
                        value: data.storageLocation,
                      },
                    ]
                  : []),
                ...(data.storageConditions
                  ? [
                      {
                        label: "Storage Conditions",
                        value: data.storageConditions,
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
        kind: "sample-info" as const,
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

export function useSampleDetail(): UseSampleDetailResult {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<"loading" | "not-found" | "ready">(
    "loading",
  );

  const sample = useMemo(() => {
    return plantSamplesData.find((s) => s.id === id);
  }, [id]);

  const config = useMemo(() => {
    return sample ? assembleConfig(sample) : null;
  }, [sample]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(sample ? "ready" : "not-found");
    }, 150);
    return () => clearTimeout(timer);
  }, [sample]);

  return { state, id, config };
}

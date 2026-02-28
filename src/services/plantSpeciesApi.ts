// ═══════════════════════════════════════════════════════════════════════════
// Plant Species API Service
// ═══════════════════════════════════════════════════════════════════════════
//
// Maps frontend PlantSpecies type ↔ Laravel API JSON (snake_case).
// All backend communication goes through this single module.
// ═══════════════════════════════════════════════════════════════════════════

import { apiClient } from "@/lib/api-client";
import type { PlantSpecies } from "@/types/inventory";

// ─── Backend JSON Shape (snake_case) ─────────────────────────────────────

export interface PlantSpeciesApiResponse {
  id: number;
  common_name: string;
  khmer_name: string | null;
  scientific_name: string;
  family: string | null;
  growth_type: string | null;
  native_region: string | null;
  propagation_method: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type GrowthType = "annual" | "perennial" | "biennial";

export interface PlantSpeciesCreatePayload {
  common_name: string;
  khmer_name?: string | null;
  scientific_name: string;
  family?: string | null;
  growth_type: GrowthType;
  native_region?: string | null;
  propagation_method?: string | null;
  description?: string | null;
  image_url?: string | null;
}

export type PlantSpeciesUpdatePayload = Partial<PlantSpeciesCreatePayload>;

// ─── Response Wrappers ───────────────────────────────────────────────────

interface ListResponse {
  data: PlantSpeciesApiResponse[];
}

interface SingleResponse {
  data: PlantSpeciesApiResponse;
}

/** Unwrap a Laravel API response that may or may not use a { data: ... } wrapper */
function unwrapSingle(
  res: SingleResponse | PlantSpeciesApiResponse,
): PlantSpeciesApiResponse {
  // If the response has a `data` key that is an object (not an array), unwrap it
  if (
    res &&
    "data" in res &&
    res.data !== null &&
    typeof res.data === "object" &&
    !Array.isArray(res.data)
  ) {
    return (res as SingleResponse).data;
  }
  // Otherwise the response IS the resource directly
  return res as PlantSpeciesApiResponse;
}

function unwrapList(
  res: ListResponse | PlantSpeciesApiResponse[],
): PlantSpeciesApiResponse[] {
  if (Array.isArray(res)) return res;
  if (res && "data" in res && Array.isArray((res as ListResponse).data)) {
    return (res as ListResponse).data;
  }
  return [];
}

// ─── Mappers (snake_case ↔ camelCase) ────────────────────────────────────

function mapApiToFrontend(api: PlantSpeciesApiResponse): PlantSpecies {
  if (!api || typeof api !== "object") {
    throw new Error("Invalid species data received from API");
  }
  return {
    id: String(api.id),
    commonName: api.common_name ?? "",
    khmerName: api.khmer_name ?? undefined,
    scientificName: api.scientific_name ?? "",
    family: api.family ?? undefined,
    growthType: api.growth_type ?? undefined,
    nativeRegion: api.native_region ?? undefined,
    propagationMethod: api.propagation_method ?? undefined,
    description: api.description ?? undefined,
    imageUrl: api.image_url ?? undefined,
    isActive: api.deleted_at === null,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    // Computed/aggregated — backend may include them via appended counts; default to 0
    varietyCount: (api as unknown as Record<string, number>).variety_count ?? 0,
    sampleCount: (api as unknown as Record<string, number>).sample_count ?? 0,
    totalQuantity:
      (api as unknown as Record<string, number>).total_quantity ?? 0,
  };
}

function mapFormToPayload(
  form: Record<string, string>,
): PlantSpeciesCreatePayload {
  return {
    common_name: form.commonName,
    khmer_name: form.khmerName || null,
    scientific_name: form.scientificName,
    family: form.family || null,
    growth_type: (form.growthType as GrowthType) || "annual",
    native_region: form.nativeRegion || null,
    propagation_method: form.propagationMethod || null,
    description: form.description || null,
    image_url: form.imageUrl || null,
  };
}

// ─── API Methods ─────────────────────────────────────────────────────────

export const plantSpeciesApi = {
  /** GET /api/plant-species */
  async getAll(): Promise<PlantSpecies[]> {
    const res = await apiClient.get<ListResponse | PlantSpeciesApiResponse[]>(
      "/plant-species",
    );
    return unwrapList(res).map(mapApiToFrontend);
  },

  /** GET /api/plant-species/:id */
  async getById(id: string): Promise<PlantSpecies> {
    const res = await apiClient.get<SingleResponse | PlantSpeciesApiResponse>(
      `/plant-species/${id}`,
    );
    return mapApiToFrontend(unwrapSingle(res));
  },

  /** POST /api/plant-species */
  async create(form: Record<string, string>): Promise<PlantSpecies> {
    const payload = mapFormToPayload(form);
    const res = await apiClient.post<SingleResponse | PlantSpeciesApiResponse>(
      "/plant-species",
      payload,
    );
    return mapApiToFrontend(unwrapSingle(res));
  },

  /** PUT /api/plant-species/:id */
  async update(
    id: string,
    form: Record<string, string>,
  ): Promise<PlantSpecies> {
    const payload = mapFormToPayload(form);
    const res = await apiClient.put<SingleResponse | PlantSpeciesApiResponse>(
      `/plant-species/${id}`,
      payload,
    );
    return mapApiToFrontend(unwrapSingle(res));
  },

  /** DELETE /api/plant-species/:id */
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/plant-species/${id}`);
  },
};

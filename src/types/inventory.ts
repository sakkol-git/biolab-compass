// ═══════════════════════════════════════════════════════════════════════════
// INVENTORY MODULE — TypeScript Interfaces (Extended)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Shared Auditable Base ──────────────────────────────────────────────────
export interface Auditable {
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
}

// ─── Hazard Level ───────────────────────────────────────────────────────────
export type HazardLevel = "low" | "medium" | "high";

// ─── Equipment Status ───────────────────────────────────────────────────────
export type EquipmentStatus =
  | "Available"
  | "Borrowed"
  | "Maintenance"
  | "Retired";

// ─── Plant Variety Status ───────────────────────────────────────────────────
export type PlantVarietyStatus = "Active" | "Archived" | "Destroyed";

// ─── Plant Sample Status (distinct from variety) ────────────────────────────
export type PlantSampleStatus =
  | "Active"
  | "In Testing"
  | "Consumed"
  | "Contaminated"
  | "Archived"
  | "Destroyed";

// ─── Plant Variety ──────────────────────────────────────────────────────────
export interface PlantVariety extends Auditable {
  id: string;
  varietyCode: string;
  speciesId: string;
  speciesName: string;
  name: string;
  uniqueCode: string;
  ownershipUserId?: string;
  ownershipUserName?: string;
  ownershipDepartment?: string;
  originLocation: string;
  description?: string;
  dateBrought?: string;
  status: PlantVarietyStatus;
  images?: string[];
  notes?: string;
  // Genetic / trait metadata
  traits?: string[];
  germinationRate?: number;
  diseaseResistance?: string;
  maturityDays?: number;
}

// ─── Plant Sample ───────────────────────────────────────────────────────────
export interface PlantSample extends Auditable {
  id: string;
  sampleCode: string;
  speciesId: string;
  speciesName: string;
  varietyId?: string;
  varietyName?: string;
  name: string;
  uniqueCode: string;
  ownershipUserId?: string;
  ownershipUserName?: string;
  ownershipDepartment?: string;
  originLocation: string;
  description?: string;
  dateBrought?: string;
  status: PlantSampleStatus;
  images?: string[];
  notes?: string;
  // Physical inventory metadata
  quantity?: number;
  quantityUnit?: string;
  storageLocation?: string;
  storageConditions?: string;
}

// ─── Chemical Log ───────────────────────────────────────────────────────────
export type ChemicalActionType = "add" | "reduce";

export interface ChemicalLog extends Auditable {
  id: string;
  chemicalId: string;
  actionType: ChemicalActionType;
  amount: number;
  unit: string;
  previousQuantity: string;
  newQuantity: string;
  reason?: string;
  userId?: string;
  userName?: string;
}

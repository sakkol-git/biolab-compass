// ═══════════════════════════════════════════════════════════════════════════
// INVENTORY MODULE — TypeScript Interfaces (Extended)
// ═══════════════════════════════════════════════════════════════════════════

// ─── Plant Variety / Sample Status ──────────────────────────────────────────
export type PlantVarietyStatus = "Active" | "Archived" | "Destroyed";

// ─── Plant Variety ──────────────────────────────────────────────────────────
export interface PlantVariety {
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
  createdAt: string;
}

// ─── Plant Sample ───────────────────────────────────────────────────────────
export interface PlantSample {
  id: string;
  sampleCode: string;
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
  createdAt: string;
}

// ─── Chemical Log ───────────────────────────────────────────────────────────
export type ChemicalActionType = "add" | "reduce";

export interface ChemicalLog {
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
  createdAt: string;
}

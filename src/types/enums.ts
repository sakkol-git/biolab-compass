// ═══════════════════════════════════════════════════════════════════════════
// Enums — Exact string values matching the Laravel backend
// ═══════════════════════════════════════════════════════════════════════════

export type PlantGrowthType =
  | "herb"
  | "shrub"
  | "tree"
  | "vine"
  | "grass"
  | "aquatic"
  | "other";
export type SampleStatus = "active" | "inactive" | "archived";
export type LabLocation =
  | "lab_a"
  | "lab_b"
  | "greenhouse"
  | "storage"
  | "external";
export type StockStatus = "available" | "reserved" | "out_of_stock";
export type ChemicalCategory =
  | "acid"
  | "base"
  | "solvent"
  | "oxidizer"
  | "reducer"
  | "other";
export type DangerLevel = "low" | "medium" | "high";
export type EquipmentStatus =
  | "available"
  | "borrowed"
  | "in_use"
  | "under_maintenance";
export type EquipmentCondition = "good" | "normal" | "broken";
export type EquipmentCategory =
  | "microscope"
  | "centrifuge"
  | "incubator"
  | "spectrophotometer"
  | "other";
export type BorrowStatus = "borrowed" | "returned" | "overdue";
export type TransactionAction =
  | "added"
  | "updated"
  | "consumed"
  | "borrowed"
  | "returned"
  | "harvested"
  | "disposed";
export type UserRole = "admin" | "lab_manager" | "student";
export type BorrowableType = "equipment" | "chemical" | "plant_sample";

// ─── Option arrays for select dropdowns ─────────────────────────────────

export const PLANT_GROWTH_TYPES: PlantGrowthType[] = [
  "herb",
  "shrub",
  "tree",
  "vine",
  "grass",
  "aquatic",
  "other",
];
export const SAMPLE_STATUSES: SampleStatus[] = [
  "active",
  "inactive",
  "archived",
];
export const LAB_LOCATIONS: LabLocation[] = [
  "lab_a",
  "lab_b",
  "greenhouse",
  "storage",
  "external",
];
export const STOCK_STATUSES: StockStatus[] = [
  "available",
  "reserved",
  "out_of_stock",
];
export const CHEMICAL_CATEGORIES: ChemicalCategory[] = [
  "acid",
  "base",
  "solvent",
  "oxidizer",
  "reducer",
  "other",
];
export const DANGER_LEVELS: DangerLevel[] = ["low", "medium", "high"];
export const EQUIPMENT_STATUSES: EquipmentStatus[] = [
  "available",
  "borrowed",
  "in_use",
  "under_maintenance",
];
export const EQUIPMENT_CONDITIONS: EquipmentCondition[] = [
  "good",
  "normal",
  "broken",
];
export const EQUIPMENT_CATEGORIES: EquipmentCategory[] = [
  "microscope",
  "centrifuge",
  "incubator",
  "spectrophotometer",
  "other",
];
export const BORROW_STATUSES: BorrowStatus[] = [
  "borrowed",
  "returned",
  "overdue",
];
export const TRANSACTION_ACTIONS: TransactionAction[] = [
  "added",
  "updated",
  "consumed",
  "borrowed",
  "returned",
  "harvested",
  "disposed",
];
export const USER_ROLES: UserRole[] = ["admin", "lab_manager", "student"];
export const BORROWABLE_TYPES: BorrowableType[] = [
  "equipment",
  "chemical",
  "plant_sample",
];

// ─── Label helpers ──────────────────────────────────────────────────────

export function formatEnumLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

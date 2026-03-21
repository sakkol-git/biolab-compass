// ═══════════════════════════════════════════════════════════════════════════
// Enums — Exact string values matching the Laravel backend
// ═══════════════════════════════════════════════════════════════════════════

// ── Const objects (for runtime use) ──────────────────────────────────────

export const BorrowStatus = {
  PENDING: "pending",
  BORROWED: "borrowed",
  RETURNED: "returned",
  OVERDUE: "overdue",
  REJECTED: "rejected",
} as const;
export type BorrowStatus = (typeof BorrowStatus)[keyof typeof BorrowStatus];

export const ChemicalCategory = {
  ACID: "acid",
  BASE: "base",
  SOLVENT: "solvent",
  OXIDIZER: "oxidizer",
  REDUCER: "reducer",
  OTHER: "other",
} as const;
export type ChemicalCategory =
  (typeof ChemicalCategory)[keyof typeof ChemicalCategory];

export const DangerLevel = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;
export type DangerLevel = (typeof DangerLevel)[keyof typeof DangerLevel];

export const EquipmentCategory = {
  MICROSCOPE: "microscope",
  CENTRIFUGE: "centrifuge",
  INCUBATOR: "incubator",
  SPECTROPHOTOMETER: "spectrophotometer",
  OTHER: "other",
} as const;
export type EquipmentCategory =
  (typeof EquipmentCategory)[keyof typeof EquipmentCategory];

export const EquipmentCondition = {
  GOOD: "good",
  NORMAL: "normal",
  BROKEN: "broken",
} as const;
export type EquipmentCondition =
  (typeof EquipmentCondition)[keyof typeof EquipmentCondition];

export const EquipmentStatus = {
  AVAILABLE: "available",
  BORROWED: "borrowed",
  IN_USE: "in_use",
  UNDER_MAINTENANCE: "under_maintenance",
} as const;
export type EquipmentStatus =
  (typeof EquipmentStatus)[keyof typeof EquipmentStatus];

export const LabLocation = {
  LAB_A: "lab_a",
  LAB_B: "lab_b",
  LAB_C: "lab_c",
} as const;
export type LabLocation = (typeof LabLocation)[keyof typeof LabLocation];

export const MaintenanceType = {
  PREVENTIVE: "preventive",
  CORRECTIVE: "corrective",
  CALIBRATION: "calibration",
  INSPECTION: "inspection",
} as const;
export type MaintenanceType =
  (typeof MaintenanceType)[keyof typeof MaintenanceType];

export const PlantGrowthType = {
  ANNUAL: "annual",
  PERENNIAL: "perennial",
  BIENNIAL: "biennial",
} as const;
export type PlantGrowthType =
  (typeof PlantGrowthType)[keyof typeof PlantGrowthType];

export const SampleStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
} as const;
export type SampleStatus = (typeof SampleStatus)[keyof typeof SampleStatus];

export const StockStatus = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  OUT_OF_STOCK: "out_of_stock",
} as const;
export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus];

export const TransactionAction = {
  ADDED: "added",
  UPDATED: "updated",
  CONSUMED: "consumed",
  BORROWED: "borrowed",
  RETURNED: "returned",
  HARVESTED: "harvested",
  DISPOSED: "disposed",
} as const;
export type TransactionAction =
  (typeof TransactionAction)[keyof typeof TransactionAction];

export const UserRole = {
  ADMIN: "admin",
  LAB_MANAGER: "lab_manager",
  STUDENT: "student",
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Borrowable item types
export type BorrowableType = "equipment" | "chemical" | "plant_sample";

// ── Research Module Enums ─────────────────────────────────────────────────

export const ExperimentStatus = {
  PLANNING: "planning",
  ACTIVE: "active",
  PAUSED: "paused",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;
export type ExperimentStatus =
  (typeof ExperimentStatus)[keyof typeof ExperimentStatus];

export const GrowthStage = {
  GERMINATION: "germination",
  SEEDLING: "seedling",
  VEGETATIVE: "vegetative",
  HARDENING: "hardening",
  READY: "ready",
} as const;
export type GrowthStage = (typeof GrowthStage)[keyof typeof GrowthStage];

export const PropagationMethod = {
  SEED: "seed",
  CUTTING: "cutting",
  GRAFTING: "grafting",
  TISSUE_CULTURE: "tissue_culture",
} as const;
export type PropagationMethod =
  (typeof PropagationMethod)[keyof typeof PropagationMethod];

export const ProtocolStatus = {
  DRAFT: "draft",
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const;
export type ProtocolStatus =
  (typeof ProtocolStatus)[keyof typeof ProtocolStatus];

// ── Business Module Enums ─────────────────────────────────────────────────

export const ClientType = {
  FARM_OWNER: "farm_owner",
  INVESTOR: "investor",
  GOVERNMENT: "government",
  NGO: "ngo",
  RESEARCH_PARTNER: "research_partner",
} as const;
export type ClientType = (typeof ClientType)[keyof typeof ClientType];

export const ContractStatus = {
  DRAFT: "draft",
  SENT: "sent",
  SIGNED: "signed",
  IN_PRODUCTION: "in_production",
  READY: "ready",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
} as const;
export type ContractStatus =
  (typeof ContractStatus)[keyof typeof ContractStatus];

export const MilestoneStatus = {
  PENDING: "pending",
  ON_TRACK: "on_track",
  AT_RISK: "at_risk",
  COMPLETED: "completed",
  MISSED: "missed",
} as const;
export type MilestoneStatus =
  (typeof MilestoneStatus)[keyof typeof MilestoneStatus];

export const PaymentStatus = {
  PENDING: "pending",
  RECEIVED: "received",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentType = {
  DEPOSIT: "deposit",
  MILESTONE: "milestone",
  FINAL: "final",
  REFUND: "refund",
} as const;
export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const LabServiceStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  DELIVERED: "delivered",
} as const;
export type LabServiceStatus =
  (typeof LabServiceStatus)[keyof typeof LabServiceStatus];

export const ServicePaymentStatus = {
  UNPAID: "unpaid",
  PARTIAL: "partial",
  PAID: "paid",
} as const;
export type ServicePaymentStatus =
  (typeof ServicePaymentStatus)[keyof typeof ServicePaymentStatus];

// ── Option arrays for select dropdowns ───────────────────────────────────

export const PLANT_GROWTH_TYPES: PlantGrowthType[] = [
  "annual",
  "perennial",
  "biennial",
];
export const SAMPLE_STATUSES: SampleStatus[] = [
  "active",
  "inactive",
  "archived",
];
export const LAB_LOCATIONS: LabLocation[] = ["lab_a", "lab_b", "lab_c"];
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
  "pending",
  "borrowed",
  "returned",
  "overdue",
  "rejected",
];
export const MAINTENANCE_TYPES: MaintenanceType[] = [
  "preventive",
  "corrective",
  "calibration",
  "inspection",
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

// ── Research & Business option arrays ─────────────────────────────────────
export const EXPERIMENT_STATUSES: ExperimentStatus[] = [
  "planning",
  "active",
  "paused",
  "completed",
  "failed",
];
export const GROWTH_STAGES: GrowthStage[] = [
  "germination",
  "seedling",
  "vegetative",
  "hardening",
  "ready",
];
export const PROPAGATION_METHODS: PropagationMethod[] = [
  "seed",
  "cutting",
  "grafting",
  "tissue_culture",
];
export const PROTOCOL_STATUSES: ProtocolStatus[] = [
  "draft",
  "active",
  "archived",
];
export const CLIENT_TYPES: ClientType[] = [
  "farm_owner",
  "investor",
  "government",
  "ngo",
  "research_partner",
];
export const CONTRACT_STATUSES: ContractStatus[] = [
  "draft",
  "sent",
  "signed",
  "in_production",
  "ready",
  "delivered",
  "cancelled",
];
export const MILESTONE_STATUSES: MilestoneStatus[] = [
  "pending",
  "on_track",
  "at_risk",
  "completed",
  "missed",
];
export const PAYMENT_STATUSES: PaymentStatus[] = [
  "pending",
  "received",
  "overdue",
  "cancelled",
];
export const PAYMENT_TYPES: PaymentType[] = [
  "deposit",
  "milestone",
  "final",
  "refund",
];
export const LAB_SERVICE_STATUSES: LabServiceStatus[] = [
  "pending",
  "in_progress",
  "completed",
  "delivered",
];
export const SERVICE_PAYMENT_STATUSES: ServicePaymentStatus[] = [
  "unpaid",
  "partial",
  "paid",
];

// ── Label helpers ─────────────────────────────────────────────────────────

export function formatEnumLabel(value: string): string {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

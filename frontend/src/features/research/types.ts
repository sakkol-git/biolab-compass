// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH MODULE — TypeScript Interfaces
// ═══════════════════════════════════════════════════════════════════════════

export type ExperimentStatus = "Planning" | "Active" | "Paused" | "Completed" | "Failed";
export type GrowthStage = "Germination" | "Seedling" | "Vegetative" | "Hardening" | "Ready";
export type PropagationMethod = "Seed" | "Cutting" | "Grafting" | "Tissue Culture";
export type ProtocolStatus = "Draft" | "Active" | "Archived";

export interface Experiment {
  id: string;
  experimentCode: string;
  speciesId: string;
  speciesName: string;
  commonName: string;
  title: string;
  objective: string;
  propagationMethod: PropagationMethod;
  growthMedium: string;
  environment: string;
  initialSeedCount: number;
  currentCount: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  status: ExperimentStatus;
  finalYield?: number;
  avgSurvivalRate?: number;
  multiplicationRate?: number;
  conclusion?: string;
  assignedTo: string[];
  tags: string[];
  imageUrl?: string;
  createdAt: string;
}

export interface GrowthLog {
  id: string;
  experimentId: string;
  weekNumber: number;
  logDate: string;
  seedlingCount: number;
  aliveCount: number;
  deadCount: number;
  newPropagations: number;
  survivalRatePct: number;
  multiplicationRate: number;
  healthScore: number;
  avgHeightCm?: number;
  growthStage: GrowthStage;
  observations: string;
  photoUrls?: string[];
  environmentalData?: {
    temp: number;
    humidity: number;
    light: string;
    ph?: number;
  };
  recordedBy: string;
  createdAt: string;
}

export interface Protocol {
  id: string;
  title: string;
  category: string;
  version: string;
  status: ProtocolStatus;
  author: string;
  lastUpdated: string;
  description: string;
  steps: number;
  linkedExperiments: number;
  tags: string[];
}

export interface SpeciesGrowthProfile {
  speciesId: string;
  speciesName: string;
  commonName: string;
  totalExperiments: number;
  completedExperiments: number;
  avgMultiplicationRate: number;
  avgSurvivalRate: number;
  stdDevSurvival: number;
  avgCycleDurationWeeks: number;
  bestMultiplicationRate: number;
  worstMultiplicationRate: number;
  avgYieldPerInitial: number;
  propagationMethods: PropagationMethod[];
  lastCalculated: string;
}

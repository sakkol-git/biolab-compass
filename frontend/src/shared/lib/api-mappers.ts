// ═══════════════════════════════════════════════════════════════════════════
// API → Display Type Mappers
// ═══════════════════════════════════════════════════════════════════════════
//
// Converts snake_case API response shapes (matching Laravel JsonResources)
// into camelCase display shapes consumed by the rendering layer.
//
// This allows the service layer to remain API-faithful while the UI layer
// continues to use the original display types unchanged.
// ═══════════════════════════════════════════════════════════════════════════

import type {
  Client,
  ClientType,
  Contract,
  ContractMilestone,
  ContractStatus,
  MilestoneStatus,
  Payment,
  PaymentStatus,
  PaymentType,
  ProductionForecast,
} from "@/features/business/types";
import type {
  Experiment,
  ExperimentStatus,
  GrowthLog,
  GrowthStage,
  PropagationMethod,
  SpeciesGrowthProfile,
} from "@/features/research/types";
import type {
  ClientApi,
  ContractApi,
  ContractMilestoneApi,
  ExperimentApi,
  GrowthLogApi,
  PaymentApi,
  ProductionForecastApi,
  SpeciesGrowthProfileApi,
} from "@/shared/types";

// ─── Utility ───────────────────────────────────────────────────────────────

/** Converts "snake_case" → "Title Case" (e.g., "tissue_culture" → "Tissue Culture"). */
export function toTitleCase(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Research Mappers ──────────────────────────────────────────────────────

export function mapExperiment(e: ExperimentApi): Experiment {
  return {
    id: String(e.id),
    experimentCode: e.experiment_code,
    speciesId: String(e.species.id),
    speciesName: e.species.scientific_name,
    commonName: e.species.common_name,
    title: e.title,
    objective: e.objective ?? "",
    propagationMethod: toTitleCase(e.propagation_method) as PropagationMethod,
    growthMedium: e.growth_medium ?? "",
    environment: e.environment ?? "",
    initialSeedCount: e.metrics.initial_seed_count,
    currentCount: e.metrics.current_count,
    startDate: e.dates.start_date,
    expectedEndDate: e.dates.expected_end_date ?? "",
    actualEndDate: e.dates.actual_end_date ?? undefined,
    status: toTitleCase(e.status) as ExperimentStatus,
    finalYield: e.metrics.final_yield ?? undefined,
    avgSurvivalRate: e.metrics.avg_survival_rate ?? undefined,
    multiplicationRate: e.metrics.multiplication_rate ?? undefined,
    conclusion: e.notes ?? undefined,
    assignedTo: e.assigned_users.map((u) => u.name),
    tags: e.tags.map((t) => t.name),
    imageUrl: e.image_url ?? undefined,
    createdAt: e.created_at,
  };
}

export function mapGrowthLog(gl: GrowthLogApi): GrowthLog {
  return {
    id: String(gl.id),
    experimentId: String(gl.experiment_id),
    weekNumber: gl.week_number,
    logDate: gl.log_date,
    seedlingCount: gl.counts.seedling_count,
    aliveCount: gl.counts.alive_count,
    deadCount: gl.counts.dead_count,
    newPropagations: gl.counts.new_propagations,
    survivalRatePct: gl.metrics.survival_rate_pct,
    multiplicationRate: gl.metrics.multiplication_rate,
    healthScore: gl.metrics.health_score,
    avgHeightCm: gl.metrics.avg_height_cm ?? undefined,
    growthStage: toTitleCase(gl.growth_stage) as GrowthStage,
    observations: gl.observations ?? gl.notes ?? "",
    photoUrls:
      gl.photo_urls && gl.photo_urls.length > 0 ? gl.photo_urls : undefined,
    environmentalData: gl.environmental_data ?? undefined,
    recordedBy: gl.recorder?.name ?? "",
    createdAt: gl.created_at,
  };
}

export function mapSpeciesProfile(
  sp: SpeciesGrowthProfileApi,
): SpeciesGrowthProfile {
  return {
    speciesId: String(sp.species_id),
    speciesName: sp.scientific_name,
    commonName: sp.common_name,
    totalExperiments: sp.total_experiments,
    completedExperiments: sp.total_experiments, // API does not distinguish
    avgMultiplicationRate: sp.avg_multiplication_rate,
    avgSurvivalRate: sp.avg_survival_rate,
    stdDevSurvival: 0, // not exposed by API
    avgCycleDurationWeeks: sp.avg_cycle_days
      ? Math.round(sp.avg_cycle_days / 7)
      : 0,
    bestMultiplicationRate: sp.max_multiplication_rate,
    worstMultiplicationRate: sp.min_multiplication_rate,
    avgYieldPerInitial:
      sp.avg_multiplication_rate * (sp.avg_survival_rate / 100),
    propagationMethods: [],
    lastCalculated: new Date().toISOString().split("T")[0],
  };
}

// ─── Business Mappers ──────────────────────────────────────────────────────

export function mapContract(c: ContractApi): Contract {
  return {
    id: String(c.id),
    contractCode: c.contract_code,
    clientId: String(c.client.id),
    clientName: c.client.company_name,
    speciesId: c.species ? String(c.species.id) : "",
    speciesName: c.species?.common_name ?? "",
    commonName: c.common_name,
    quantityOrdered: c.quantities.quantity_ordered,
    quantityDelivered: c.quantities.quantity_delivered,
    unitPrice: c.quantities.unit_price,
    totalValue: c.quantities.total_value,
    currency: "USD",
    contractDate: c.dates.contract_date ?? "",
    deliveryDeadline: c.dates.delivery_deadline ?? "",
    actualDeliveryDate: c.dates.actual_delivery_date ?? undefined,
    status: toTitleCase(c.status) as ContractStatus,
    terms: c.notes ?? "",
    managedBy: c.manager?.name ?? "",
    progressPct: c.progress_pct,
    createdAt: c.created_at,
  };
}

export function mapClient(cl: ClientApi): Client {
  return {
    id: String(cl.id),
    companyName: cl.company_name,
    contactName: cl.contact_name,
    email: cl.email ?? "",
    phone: cl.phone ?? "",
    address: cl.address ?? "",
    clientType: toTitleCase(cl.client_type) as ClientType,
    notes: "",
    totalContracts: cl.total_contracts,
    totalValue: cl.total_value,
    createdAt: cl.created_at,
  };
}

export function mapPayment(p: PaymentApi): Payment {
  return {
    id: String(p.id),
    contractId: String(p.contract_id),
    contractCode: p.contract.contract_code,
    clientName: p.contract.client?.company_name ?? "",
    amount: p.amount,
    currency: "USD",
    paymentType: toTitleCase(p.payment_type) as PaymentType,
    paymentMethod: "",
    paymentDate: p.payment_date ?? "",
    dueDate: p.due_date ?? "",
    status: toTitleCase(p.status) as PaymentStatus,
    referenceNumber: p.reference_number ?? "",
    notes: p.notes ?? "",
    createdAt: p.created_at,
    updatedAt: p.updated_at ?? undefined,
  };
}

export function mapMilestone(ms: ContractMilestoneApi): ContractMilestone {
  return {
    id: String(ms.id),
    contractId: String(ms.contract_id),
    milestoneName: ms.title,
    targetDate: ms.target_date ?? "",
    actualDate: ms.actual_date ?? undefined,
    projectedCount: ms.projected_count,
    actualCount: ms.actual_count ?? undefined,
    status: toTitleCase(ms.status) as MilestoneStatus,
    notes: "",
  };
}

export function mapProductionForecast(
  f: ProductionForecastApi,
): ProductionForecast {
  return {
    id: String(f.id),
    speciesName: f.species?.common_name ?? "",
    commonName: f.species?.common_name ?? "",
    desiredQuantity: f.forecast.desired_quantity,
    recommendedInitialStock: f.forecast.recommended_initial_stock,
    estimatedWeeks: f.forecast.estimated_weeks,
    confidenceLowerWeeks: f.forecast.confidence_lower_weeks,
    confidenceUpperWeeks: f.forecast.confidence_upper_weeks,
    estimatedCycles: f.forecast.estimated_cycles,
    estimatedSurvivalRate: f.forecast.estimated_survival_rate,
    estimatedMultiplicationRate: f.forecast.estimated_multiplication_rate,
    weeklyMilestones: f.weekly_milestones ?? [],
    resourceRequirements: f.resource_requirements ?? {
      greenhouses: 0,
      laborHours: 0,
      estimatedCost: 0,
    },
    propagationMethod: f.propagation_method ?? "",
    createdAt: f.created_at,
    calculatedBy: f.calculator?.name ?? "System",
  };
}

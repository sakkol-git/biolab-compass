// ═══════════════════════════════════════════════════════════════════════════
// API Response Interfaces — Matching Laravel JSON Resources exactly
// ═══════════════════════════════════════════════════════════════════════════

import type {
    BorrowStatus,
    BorrowableType,
    ChemicalCategory,
    ClientType,
    ContractStatus,
    DangerLevel,
    EquipmentCategory,
    EquipmentCondition,
    EquipmentStatus,
    ExperimentStatus,
    GrowthStage,
    LabLocation,
    LabServiceStatus,
    MaintenanceType,
    MilestoneStatus,
    PaymentStatus,
    PaymentType,
    PlantGrowthType,
    PropagationMethod,
    ProtocolStatus,
    SampleStatus,
    ServicePaymentStatus,
    StockStatus,
    TransactionAction,
    UserRole,
} from "./enums";

// Re-export enums for convenience
export * from "./enums";

// ── Response Wrappers ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

// ── User ──────────────────────────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// ── Auth Responses ────────────────────────────────────────────────────────
export interface AuthTokenResponse {
  access_token: string;
  token_type: "bearer";
  expires_in: number; // seconds
}

export interface RegisterResponse extends AuthTokenResponse {
  message: string;
  user: User;
}

export interface AuthProfileResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  permissions: string[];
}

// ── Plant Species ─────────────────────────────────────────────────────────
export interface PlantSpecies {
  id: number;
  common_name: string;
  khmer_name: string | null;
  scientific_name: string;
  family: string | null;
  growth_type: PlantGrowthType;
  native_region: string | null;
  propagation_method: string | null;
  description: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// ── Plant Variety ─────────────────────────────────────────────────────────
export interface PlantVariety {
  id: number;
  plant_species_id: number;
  name: string;
  variety_code: string;
  description: string | null;
  image_url: string | null;
  plant_species?: PlantSpecies;
  created_at: string;
  updated_at: string;
}

// ── Plant Sample ──────────────────────────────────────────────────────────
export interface PlantSample {
  id: number;
  identity: {
    name: string;
    code: string;
    status: SampleStatus;
  };
  relationships: {
    species?: PlantSpecies;
    variety?: PlantVariety;
  };
  details: {
    owner: string | null;
    department: string | null;
    origin: string | null;
    quantity: number;
  };
  lab_info: {
    brought_at: string | null;
    location: LabLocation | null;
  };
  meta: {
    description: string | null;
    image: string | null;
    created_at: string;
    updated_at: string;
  };
}

// ── Plant Stock ───────────────────────────────────────────────────────────
export interface PlantStock {
  id: number;
  inventory: {
    total: number;
    reserved: number;
    net_available: number;
    status: StockStatus;
  };
  relations: {
    species?: PlantSpecies;
    variety?: PlantVariety;
    sample?: PlantSample;
  };
  created_at: string;
  updated_at: string;
}

// ── Chemical ──────────────────────────────────────────────────────────────
export interface Chemical {
  id: number;
  common_name: string;
  chemical_code: string | null;
  category: ChemicalCategory;
  quantity: number;
  storage_location: string | null;
  expiry_date: string | null;
  danger_level: DangerLevel;
  safety_measures: string | null;
  description: string | null;
  image_url: string | null;
  is_expired: boolean;
  created_at: string;
  updated_at: string;
}

// ── Chemical Batch ────────────────────────────────────────────────────────
export interface ChemicalBatch {
  id: number;
  chemical_id: number;
  batch_number: string;
  quantity: number;
  remaining_quantity: number;
  unit: string;
  expiry_date: string | null;
  is_expired: boolean;
  supplier_name: string | null;
  supplier_contact: string | null;
  received_at: string | null;
  cost_per_unit: number | null;
  notes: string | null;
  chemical?: Chemical;
  created_at: string;
  updated_at: string;
}

// ── Chemical Usage Log ────────────────────────────────────────────────────
export interface ChemicalUsageLog {
  id: number;
  chemical_id: number;
  quantity_used: number;
  unit: string;
  purpose: string;
  experiment_name: string | null;
  used_at: string;
  notes: string | null;
  user: { id: number; name: string } | Record<string, never>;
  chemical?: Chemical;
  batch?: ChemicalBatch;
  created_at: string;
}

// ── Equipment ─────────────────────────────────────────────────────────────
export interface Equipment {
  id: number;
  equipment_name: string;
  equipment_code: string | null;
  category: EquipmentCategory;
  status: EquipmentStatus;
  condition: EquipmentCondition;
  location: string | null;
  manufacturer: string | null;
  model_name: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
  description: string | null;
  image_url: string | null;
  is_borrowable: boolean;
  created_at: string;
  updated_at: string;
}

// ── Maintenance Record ────────────────────────────────────────────────────
export interface MaintenanceRecord {
  id: number;
  equipment_id: number;
  maintenance_type: MaintenanceType;
  description: string;
  technician_name: string | null;
  technician_contact: string | null;
  cost: number | null;
  started_at: string;
  completed_at: string | null;
  next_service_date: string | null;
  is_completed: boolean;
  is_overdue: boolean;
  notes: string | null;
  equipment?: Equipment;
  performer: { id: number | null; name: string | null };
  created_at: string;
  updated_at: string;
}

// ── Borrow Record ─────────────────────────────────────────────────────────
export interface BorrowRecord {
  id: number;
  status: BorrowStatus;
  quantity: number;
  borrowed_at: string | null;
  due_at: string | null;
  returned_at: string | null;
  is_overdue: boolean;
  notes: string | null;
  user: { id: number; name: string } | Record<string, never>;
  item: {
    type: BorrowableType;
    id: number;
    data?: Equipment | Chemical | PlantSample;
  };
  created_at: string;
}

// ── Transaction ───────────────────────────────────────────────────────────
export interface Transaction {
  id: number;
  action: TransactionAction;
  quantity: number;
  note: string | null;
  user: { id: number; name: string } | Record<string, never>;
  item: {
    type: string;
    id: number;
    data?: unknown;
  };
  created_at: string;
}

// ── Achievement ───────────────────────────────────────────────────────────
export interface Achievement {
  id: number;
  name: string;
  description: string | null;
  criteria_type: string;
  criteria_value: number;
  icon: string | null;
  earned_at?: string;
  created_at: string;
  updated_at: string;
}

// ── User Document ─────────────────────────────────────────────────────────
export interface UserDocument {
  id: number;
  user_id: number;
  title: string;
  file_path: string;
  file_type: "pdf" | "doc" | "image" | "certificate" | "other";
  file_size: number;
  description: string | null;
  user: { id: number; name: string } | Record<string, never>;
  created_at: string;
  updated_at: string;
}

// ── Role & Permission ─────────────────────────────────────────────────────
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

// ── Dashboard Response ────────────────────────────────────────────────────
export interface DashboardResponse {
  data: {
    counts: {
      plant_species: number;
      plant_varieties: number;
      plant_samples: number;
      plant_stocks: number;
      chemicals: number;
      chemical_batches: number;
      equipment: number;
      users: number;
      active_borrows: number;
      total_borrows: number;
    };
    alerts: {
      expiring_chemicals: number;
      expired_chemicals: number;
      overdue_borrows: number;
      pending_borrows: number;
      overdue_maintenance: number;
      low_stock_chemicals: number;
    };
    recent_activity: Array<{
      id: number;
      user: string | null;
      action: TransactionAction;
      item_type: string;
      item_id: number;
      quantity: number;
      note: string | null;
      created_at: string;
    }>;
    status_breakdown: {
      borrows_by_status: Record<string, number>;
      equipment_by_status: Record<string, number>;
      chemicals_by_category: Record<string, number>;
    };
  };
}

// ── Profile Response ──────────────────────────────────────────────────────
export interface ProfileShowResponse {
  data: {
    user: User;
    permissions: string[];
    summary: {
      total_borrows: number;
      active_borrows: number;
      overdue_borrows: number;
      total_transactions: number;
      chemical_usages: number;
      contributed_samples: number;
      achievements_earned: number;
      documents_uploaded: number;
    };
  };
}

// ── Error Responses ───────────────────────────────────────────────────────
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}

export interface UnauthorizedResponse {
  error: string;
}

export interface ForbiddenResponse {
  message: string;
}

export interface NotFoundResponse {
  message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// SHARED — Tag
// ═══════════════════════════════════════════════════════════════════════════

export interface TagApi {
  id: number;
  name: string;
  slug: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RESEARCH MODULE — API Interfaces (matching Laravel JsonResources)
// ═══════════════════════════════════════════════════════════════════════════

// ── Experiment ────────────────────────────────────────────────────────────
export interface ExperimentApi {
  id: number;
  experiment_code: string;
  title: string;
  description: string | null;
  objective: string | null;
  status: ExperimentStatus;
  propagation_method: PropagationMethod;
  growth_medium: string | null;
  environment: string | null;

  species: {
    id: number;
    common_name: string;
    scientific_name: string;
  };

  dates: {
    start_date: string;
    expected_end_date: string | null;
    actual_end_date: string | null;
  };

  metrics: {
    initial_seed_count: number;
    current_count: number;
    final_yield: number | null;
    avg_survival_rate: number | null;
    multiplication_rate: number | null;
  };

  creator: { id: number; name: string };
  assigned_users: Array<{ id: number; name: string; role: string }>;

  tags: TagApi[];
  growth_logs_count: number;
  notes: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperimentPayload {
  title: string;
  plant_species_id: number;
  objective?: string | null;
  description?: string | null;
  propagation_method: PropagationMethod;
  growth_medium?: string | null;
  environment?: string | null;
  initial_seed_count: number;
  current_count?: number;
  start_date: string;
  expected_end_date?: string | null;
  status?: ExperimentStatus;
  notes?: string | null;
  image_url?: string | null;
  tags?: string[];
  assigned_user_ids?: number[];
}

export interface ExperimentStats {
  total: number;
  active: number;
  completed: number;
  planning: number;
  total_seedlings: number;
  avg_survival_rate: number;
  avg_multiplication_rate: number;
  species_count: number;
}

// ── Growth Log ────────────────────────────────────────────────────────────
export interface GrowthLogApi {
  id: number;
  experiment_id: number;
  week_number: number;
  log_date: string;
  growth_stage: GrowthStage;

  counts: {
    seedling_count: number;
    alive_count: number;
    dead_count: number;
    new_propagations: number;
  };

  metrics: {
    survival_rate_pct: number;
    multiplication_rate: number;
    health_score: number;
    avg_height_cm: number | null;
  };

  photo_urls: string[] | null;
  environmental_data: {
    temp?: number;
    humidity?: number;
    light?: string;
    ph?: number;
  } | null;
  notes: string | null;
  observations: string | null;

  recorder: { id: number | null; name: string | null } | null;
  created_at: string;
  updated_at: string;
}

export interface GrowthLogPayload {
  experiment_id: number;
  week_number: number;
  log_date: string;
  growth_stage: GrowthStage;
  seedling_count: number;
  alive_count: number;
  dead_count?: number;
  new_propagations?: number;
  avg_height_cm?: number | null;
  observations?: string | null;
  notes?: string | null;
  photo_urls?: string[];
  environmental_data?: {
    temp?: number;
    humidity?: number;
    light?: string;
    ph?: number;
  } | null;
}

// ── Protocol ──────────────────────────────────────────────────────────────
export interface ProtocolApi {
  id: number;
  protocol_code: string;
  title: string;
  description: string | null;
  category: string;
  version: string;
  status: ProtocolStatus;
  last_updated: string | null;

  author: { id: number; name: string };

  steps_count: number;
  linked_experiments_count: number;
  steps: ProtocolStepApi[];
  tags: TagApi[];
  created_at: string;
  updated_at: string;
}

export interface ProtocolStepApi {
  id: number;
  protocol_id: number;
  step_number: number;
  title: string;
  description: string | null;
  duration_minutes: number | null;
  created_at: string;
  updated_at: string;
}

export interface ProtocolPayload {
  title: string;
  description?: string | null;
  category: string;
  version?: string;
  status?: ProtocolStatus;
  tags?: string[];
  steps?: Array<{
    step_number: number;
    title: string;
    description?: string | null;
    duration_minutes?: number | null;
  }>;
}

// ── Lab Notebook ──────────────────────────────────────────────────────────
export interface LabNotebookApi {
  id: number;
  notebook_code: string;
  title: string;
  content: string | null;
  is_locked: boolean;

  experiment: {
    id: number;
    title: string;
    code: string;
  } | null;

  user: { id: number; name: string } | null;
  tags: TagApi[];
  created_at: string;
  updated_at: string;
}

export interface LabNotebookPayload {
  title: string;
  content?: string | null;
  experiment_id?: number | null;
  tags?: string[];
}

// ── Species Analytics (read-only analytics data) ──────────────────────────
export interface SpeciesGrowthProfileApi {
  species_id: number;
  common_name: string;
  scientific_name: string;
  total_experiments: number;
  avg_multiplication_rate: number;
  avg_survival_rate: number;
  max_multiplication_rate: number;
  min_multiplication_rate: number;
  avg_cycle_days: number | null;
}

export interface GrowthComparisonItem {
  species: string;
  experiments: number;
  multiplication_rate: number;
  survival_rate: number;
}

export interface GrowthCurveDataPoint {
  week: number;
  stage: GrowthStage;
  alive_count: number;
  seedling_count: number;
  survival_rate: number;
  multiplication_rate: number;
  health_score: number;
  avg_height_cm: number;
  log_date: string | null;
}

export interface GrowthStageDistribution {
  [stage: string]: number;
}

export interface ExperimentHealthScore {
  experiment_id: number;
  experiment_code: string;
  species: string;
  health_score: number | null;
  growth_stage: string;
  week_number: number | null;
  survival_rate: number | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS MODULE — API Interfaces (matching Laravel JsonResources)
// ═══════════════════════════════════════════════════════════════════════════

// ── Client ────────────────────────────────────────────────────────────────
export interface ClientApi {
  id: number;
  client_code: string;
  company_name: string;
  contact_name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  client_type: ClientType;
  total_contracts: number;
  total_value: number;
  contracts?: ContractApi[];
  created_at: string;
  updated_at: string;
}

export interface ClientPayload {
  company_name: string;
  contact_name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  client_type: ClientType;
}

export interface ClientStats {
  total_clients: number;
  total_value: number;
  clients_by_type: Record<string, number>;
  top_clients: Array<{
    id: number;
    client_code: string;
    company_name: string;
    total_contracts: number;
    total_value: number;
  }>;
}

// ── Contract ──────────────────────────────────────────────────────────────
export interface ContractApi {
  id: number;
  contract_code: string;
  common_name: string;
  status: ContractStatus;

  client: {
    id: number;
    company_name: string;
    client_code: string;
  };

  species: {
    id: number;
    common_name: string;
  } | null;

  manager: {
    id: number;
    name: string;
  } | null;

  dates: {
    contract_date: string | null;
    delivery_deadline: string | null;
    actual_delivery_date: string | null;
  };

  quantities: {
    quantity_ordered: number;
    quantity_delivered: number;
    unit_price: number;
    total_value: number;
  };

  progress_pct: number;
  notes: string | null;

  milestones?: ContractMilestoneApi[];
  payments?: PaymentApi[];

  financial: {
    total_paid: number | null;
    total_pending: number | null;
  };

  created_at: string;
  updated_at: string;
}

export interface ContractPayload {
  client_id: number;
  plant_species_id?: number | null;
  common_name: string;
  quantity_ordered: number;
  unit_price: number;
  contract_date: string;
  delivery_deadline: string;
  notes?: string | null;
}

export interface ContractStats {
  total_contracts: number;
  active_contracts: number;
  total_revenue: number;
  total_pending: number;
  pipeline: Record<string, number>;
  avg_contract_value: number;
}

// ── Contract Milestone ────────────────────────────────────────────────────
export interface ContractMilestoneApi {
  id: number;
  contract_id: number;
  title: string;
  status: MilestoneStatus;
  target_date: string | null;
  actual_date: string | null;
  projected_count: number;
  actual_count: number | null;
  created_at: string;
  updated_at: string;
}

export interface ContractMilestonePayload {
  title: string;
  target_date: string;
  projected_count: number;
  actual_count?: number | null;
}

// ── Payment ───────────────────────────────────────────────────────────────
export interface PaymentApi {
  id: number;
  contract_id: number;
  reference_number: string | null;
  amount: number;
  payment_type: PaymentType;
  status: PaymentStatus;
  due_date: string | null;
  payment_date: string | null;
  notes: string | null;

  contract: {
    id: number;
    contract_code: string;
    client: {
      id: number;
      company_name: string;
    } | null;
  };

  created_at: string;
  updated_at: string;
}

export interface PaymentPayload {
  contract_id: number;
  amount: number;
  payment_type: PaymentType;
  status?: PaymentStatus;
  due_date: string;
  payment_date?: string | null;
  reference_number?: string | null;
  notes?: string | null;
}

export interface PaymentStats {
  total_received: number;
  total_pending: number;
  total_overdue: number;
  overdue_count: number;
  monthly_revenue: Array<{ month: string; total: number }>;
}

// ── Production Forecast ───────────────────────────────────────────────────
export interface ProductionForecastApi {
  id: number;

  species: {
    id: number;
    common_name: string;
  } | null;

  forecast: {
    desired_quantity: number;
    recommended_initial_stock: number;
    estimated_weeks: number;
    confidence_lower_weeks: number;
    confidence_upper_weeks: number;
    estimated_cycles: number;
    estimated_survival_rate: number;
    estimated_multiplication_rate: number;
  };

  propagation_method: string | null;
  weekly_milestones: Array<{ week: number; projected: number }> | null;
  resource_requirements: {
    greenhouses: number;
    laborHours: number;
    estimatedCost: number;
  } | null;

  calculator: {
    id: number;
    name: string;
  } | null;

  created_at: string;
  updated_at: string;
}

export interface CalculateForecastPayload {
  plant_species_id: number;
  desired_quantity: number;
  propagation_method?: string | null;
}

// ── Lab Service ───────────────────────────────────────────────────────────
export interface LabServiceApi {
  id: number;
  service_code: string;
  service_title: string;
  service_description: string | null;
  client_name: string;
  client_contact: string | null;
  status: LabServiceStatus;
  payment_status: ServicePaymentStatus;
  start_date: string | null;
  end_date: string | null;
  service_fee: number;
  assigned_staff: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface LabServicePayload {
  service_title: string;
  service_description?: string | null;
  client_name: string;
  client_contact?: string | null;
  status?: LabServiceStatus;
  payment_status?: ServicePaymentStatus;
  start_date?: string | null;
  end_date?: string | null;
  service_fee?: number;
  assigned_staff?: string[];
}

export interface LabServiceStats {
  total_services: number;
  pending: number;
  in_progress: number;
  completed: number;
  delivered: number;
  total_revenue: number;
  pending_payments: number;
}

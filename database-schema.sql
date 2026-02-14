-- ═══════════════════════════════════════════════════════════════════
-- BioLab Compass — PostgreSQL Database Schema (DDL)
-- ═══════════════════════════════════════════════════════════════════
-- Version: 1.0
-- Date: 2026-02-14
-- Database: PostgreSQL 14+
-- Character Set: UTF-8
-- Collation: en_US.UTF-8
-- ═══════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════
-- STEP 1: CREATE ENUMS
-- ═══════════════════════════════════════════════════════════════════

-- Business Module Enums
CREATE TYPE enum_client_type AS ENUM (
  'Farm Owner',
  'Investor',
  'Government',
  'NGO',
  'Research Partner'
);

CREATE TYPE enum_contract_status AS ENUM (
  'Draft',
  'Sent',
  'Signed',
  'In Production',
  'Ready',
  'Delivered',
  'Cancelled'
);

CREATE TYPE enum_payment_status AS ENUM (
  'Pending',
  'Received',
  'Overdue',
  'Cancelled'
);

CREATE TYPE enum_payment_type AS ENUM (
  'Deposit',
  'Milestone',
  'Final',
  'Refund'
);

CREATE TYPE enum_milestone_status AS ENUM (
  'Pending',
  'On Track',
  'At Risk',
  'Completed',
  'Missed'
);

-- Inventory Module Enums
CREATE TYPE enum_hazard_level AS ENUM (
  'low',
  'medium',
  'high'
);

CREATE TYPE enum_equipment_status AS ENUM (
  'Available',
  'Borrowed',
  'Maintenance',
  'Retired'
);

CREATE TYPE enum_transaction_action AS ENUM (
  'Added',
  'Consumed',
  'Disposed',
  'Borrowed',
  'Returned',
  'Transferred',
  'Harvested',
  'Lost'
);

CREATE TYPE enum_item_type AS ENUM (
  'plant',
  'chemical',
  'equipment',
  'other'
);

-- Research Module Enums
CREATE TYPE enum_experiment_status AS ENUM (
  'Planning',
  'Active',
  'Paused',
  'Completed',
  'Failed'
);

CREATE TYPE enum_growth_stage AS ENUM (
  'Germination',
  'Seedling',
  'Vegetative',
  'Hardening',
  'Ready'
);

CREATE TYPE enum_propagation_method AS ENUM (
  'Seed',
  'Cutting',
  'Grafting',
  'Tissue Culture'
);

CREATE TYPE enum_protocol_status AS ENUM (
  'Draft',
  'Active',
  'Archived'
);

-- ═══════════════════════════════════════════════════════════════════
-- STEP 2: CREATE INDEPENDENT TABLES (No FK dependencies)
-- ═══════════════════════════════════════════════════════════════════

-- Plant Species (Master catalog)
CREATE TABLE plant_species (
  id BIGSERIAL PRIMARY KEY,
  species_code VARCHAR(20) NOT NULL UNIQUE,
  scientific_name VARCHAR(255) NOT NULL UNIQUE,
  common_name VARCHAR(255) NOT NULL,
  family VARCHAR(100) NOT NULL,
  growth_type VARCHAR(50) NOT NULL,
  optimal_temp VARCHAR(50),
  native_region VARCHAR(255),
  light_requirement VARCHAR(255),
  water_requirement VARCHAR(255),
  soil_type VARCHAR(255),
  humidity VARCHAR(50),
  propagation VARCHAR(255),
  maturity_days INTEGER CHECK (maturity_days > 0),
  max_height VARCHAR(50),
  description TEXT,
  image_url VARCHAR(512),
  active_batches INTEGER NOT NULL DEFAULT 0 CHECK (active_batches >= 0),
  total_plants INTEGER NOT NULL DEFAULT 0 CHECK (total_plants >= 0),
  tags JSONB,
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_species_code ON plant_species(species_code);
CREATE INDEX idx_scientific_name ON plant_species(scientific_name);
CREATE INDEX idx_common_name ON plant_species(common_name);
CREATE INDEX idx_family ON plant_species(family);
CREATE INDEX idx_deleted_at ON plant_species(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE plant_species IS 'Master catalog of plant species';
COMMENT ON COLUMN plant_species.species_code IS 'Business identifier (SP-###)';
COMMENT ON COLUMN plant_species.active_batches IS 'Computed: count of active plant batches';
COMMENT ON COLUMN plant_species.total_plants IS 'Computed: sum of plant quantities across batches';

-- Protocols (Standard Operating Procedures)
CREATE TABLE protocols (
  id BIGSERIAL PRIMARY KEY,
  protocol_code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  version VARCHAR(20) NOT NULL,
  status enum_protocol_status NOT NULL DEFAULT 'Draft',
  author VARCHAR(255) NOT NULL,
  last_updated DATE NOT NULL,
  steps INTEGER NOT NULL CHECK (steps > 0),
  linked_experiments INTEGER NOT NULL DEFAULT 0 CHECK (linked_experiments >= 0),
  tags JSONB,
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_protocol_code ON protocols(protocol_code);
CREATE INDEX idx_protocol_title ON protocols(title);
CREATE INDEX idx_protocol_category ON protocols(category);
CREATE INDEX idx_protocol_status ON protocols(status);
CREATE INDEX idx_protocol_deleted_at ON protocols(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE protocols IS 'Standard Operating Procedures for lab processes';

-- ═══════════════════════════════════════════════════════════════════
-- STEP 3: BUSINESS MODULE TABLES
-- ═══════════════════════════════════════════════════════════════════

-- Clients
CREATE TABLE clients (
  id BIGSERIAL PRIMARY KEY,
  client_code VARCHAR(20) NOT NULL UNIQUE,
  company_name VARCHAR(255) NOT NULL CHECK (LENGTH(company_name) > 0),
  contact_name VARCHAR(255) NOT NULL CHECK (LENGTH(contact_name) > 0),
  email VARCHAR(255) CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone VARCHAR(50),
  address TEXT,
  client_type enum_client_type NOT NULL,
  notes TEXT,
  total_contracts INTEGER NOT NULL DEFAULT 0 CHECK (total_contracts >= 0),
  total_value DECIMAL(12,2) NOT NULL DEFAULT 0.00 CHECK (total_value >= 0),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_client_code ON clients(client_code);
CREATE INDEX idx_company_name ON clients(company_name);
CREATE INDEX idx_client_type ON clients(client_type);
CREATE INDEX idx_clients_deleted_at ON clients(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE clients IS 'Client/customer information for seedling production contracts';
COMMENT ON COLUMN clients.total_contracts IS 'Computed: count of contracts';
COMMENT ON COLUMN clients.total_value IS 'Computed: sum of contract values (USD)';

-- Contracts
CREATE TABLE contracts (
  id BIGSERIAL PRIMARY KEY,
  contract_code VARCHAR(20) NOT NULL UNIQUE,
  client_id BIGINT NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  species_id BIGINT NOT NULL REFERENCES plant_species(id) ON DELETE RESTRICT,
  species_name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255) NOT NULL,
  quantity_ordered INTEGER NOT NULL CHECK (quantity_ordered > 0),
  quantity_delivered INTEGER NOT NULL DEFAULT 0 CHECK (quantity_delivered >= 0 AND quantity_delivered <= quantity_ordered),
  unit_price DECIMAL(10,2) NOT NULL CHECK (unit_price >= 0),
  total_value DECIMAL(12,2) NOT NULL CHECK (total_value >= 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  contract_date DATE NOT NULL CHECK (contract_date <= CURRENT_DATE),
  delivery_deadline DATE NOT NULL,
  actual_delivery_date DATE,
  status enum_contract_status NOT NULL DEFAULT 'Draft',
  terms TEXT,
  managed_by VARCHAR(255) NOT NULL,
  progress_pct DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  CONSTRAINT chk_delivery_deadline CHECK (delivery_deadline > contract_date)
);

CREATE INDEX idx_contract_code ON contracts(contract_code);
CREATE INDEX idx_contract_client_id ON contracts(client_id);
CREATE INDEX idx_contract_species_id ON contracts(species_id);
CREATE INDEX idx_contract_status ON contracts(status);
CREATE INDEX idx_delivery_deadline ON contracts(delivery_deadline);
CREATE INDEX idx_contracts_deleted_at ON contracts(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE contracts IS 'Seedling production contracts';
COMMENT ON COLUMN contracts.total_value IS 'Computed: quantity_ordered * unit_price';
COMMENT ON COLUMN contracts.progress_pct IS 'Completion percentage (0-100)';

-- Contract Milestones
CREATE TABLE contract_milestones (
  id BIGSERIAL PRIMARY KEY,
  contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  milestone_name VARCHAR(255) NOT NULL,
  target_date DATE NOT NULL,
  actual_date DATE,
  projected_count INTEGER NOT NULL CHECK (projected_count >= 0),
  actual_count INTEGER CHECK (actual_count >= 0),
  status enum_milestone_status NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_milestone_contract_id ON contract_milestones(contract_id);
CREATE INDEX idx_milestone_status ON contract_milestones(status);
CREATE INDEX idx_milestone_target_date ON contract_milestones(target_date);

COMMENT ON TABLE contract_milestones IS 'Production milestones for contracts';

-- Payments
CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  payment_code VARCHAR(20) NOT NULL UNIQUE,
  contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE RESTRICT,
  contract_code VARCHAR(20) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  payment_type enum_payment_type NOT NULL,
  payment_method VARCHAR(100) NOT NULL,
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status enum_payment_status NOT NULL DEFAULT 'Pending',
  reference_number VARCHAR(100),
  notes TEXT,
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_payment_code ON payments(payment_code);
CREATE INDEX idx_payment_contract_id ON payments(contract_id);
CREATE INDEX idx_payment_status ON payments(status);
CREATE INDEX idx_payment_date ON payments(payment_date);
CREATE INDEX idx_due_date ON payments(due_date);
CREATE INDEX idx_payments_deleted_at ON payments(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE payments IS 'Financial transactions linked to contracts';

-- Production Forecasts
CREATE TABLE production_forecasts (
  id BIGSERIAL PRIMARY KEY,
  forecast_code VARCHAR(20) NOT NULL UNIQUE,
  species_name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255) NOT NULL,
  desired_quantity INTEGER NOT NULL CHECK (desired_quantity > 0),
  recommended_initial_stock INTEGER NOT NULL CHECK (recommended_initial_stock > 0),
  estimated_weeks INTEGER NOT NULL CHECK (estimated_weeks > 0),
  confidence_lower_weeks INTEGER NOT NULL CHECK (confidence_lower_weeks > 0),
  confidence_upper_weeks INTEGER NOT NULL CHECK (confidence_upper_weeks > 0),
  estimated_cycles INTEGER NOT NULL CHECK (estimated_cycles >= 1),
  estimated_survival_rate DECIMAL(5,2) NOT NULL CHECK (estimated_survival_rate >= 0 AND estimated_survival_rate <= 100),
  estimated_multiplication_rate DECIMAL(5,2) NOT NULL CHECK (estimated_multiplication_rate >= 1),
  weekly_milestones JSONB,
  resource_requirements JSONB NOT NULL,
  propagation_method VARCHAR(50) NOT NULL,
  calculated_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_forecast_code ON production_forecasts(forecast_code);
CREATE INDEX idx_forecast_species_name ON production_forecasts(species_name);
CREATE INDEX idx_forecast_propagation_method ON production_forecasts(propagation_method);

COMMENT ON TABLE production_forecasts IS 'Production planning calculations and resource estimates';

-- ═══════════════════════════════════════════════════════════════════
-- STEP 4: INVENTORY MODULE TABLES
-- ═══════════════════════════════════════════════════════════════════

-- Plant Batches
CREATE TABLE plant_batches (
  id BIGSERIAL PRIMARY KEY,
  batch_code VARCHAR(20) NOT NULL UNIQUE,
  species_id BIGINT NOT NULL REFERENCES plant_species(id) ON DELETE RESTRICT,
  species_name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255) NOT NULL,
  stage enum_growth_stage NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  location VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  expected_harvest_date DATE CHECK (expected_harvest_date > start_date),
  source_material VARCHAR(255),
  health_score INTEGER CHECK (health_score >= 0 AND health_score <= 100),
  notes TEXT,
  image_url VARCHAR(512),
  assigned_to VARCHAR(255),
  growth_milestones JSONB,
  environmental_log JSONB,
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_batch_code ON plant_batches(batch_code);
CREATE INDEX idx_batch_species_id ON plant_batches(species_id);
CREATE INDEX idx_batch_stage ON plant_batches(stage);
CREATE INDEX idx_batch_location ON plant_batches(location);
CREATE INDEX idx_batch_start_date ON plant_batches(start_date);
CREATE INDEX idx_batches_deleted_at ON plant_batches(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE plant_batches IS 'Groups of plants being grown together';

-- Chemicals
CREATE TABLE chemicals (
  id BIGSERIAL PRIMARY KEY,
  chemical_code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL CHECK (LENGTH(name) > 0),
  cas_number VARCHAR(50),
  quantity VARCHAR(100) NOT NULL,
  concentration VARCHAR(100),
  molecular_weight VARCHAR(50),
  purity VARCHAR(50),
  expiry_date DATE,
  days_until_expiry INTEGER,
  hazard_level enum_hazard_level NOT NULL,
  safety_class VARCHAR(100),
  ghs_codes JSONB,
  location VARCHAR(255) NOT NULL,
  storage_temp VARCHAR(50),
  storage_conditions TEXT,
  supplier VARCHAR(255),
  supplier_catalog VARCHAR(100),
  lot_number VARCHAR(100),
  date_received DATE,
  sds_url VARCHAR(512),
  notes TEXT,
  image_url VARCHAR(512),
  usage_records JSONB,
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_chemical_code ON chemicals(chemical_code);
CREATE INDEX idx_chemical_name ON chemicals(name);
CREATE INDEX idx_cas_number ON chemicals(cas_number);
CREATE INDEX idx_hazard_level ON chemicals(hazard_level);
CREATE INDEX idx_chemical_location ON chemicals(location);
CREATE INDEX idx_expiry_date ON chemicals(expiry_date);
CREATE INDEX idx_chemicals_deleted_at ON chemicals(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE chemicals IS 'Chemical inventory with safety and expiry tracking';

-- Equipment
CREATE TABLE equipment (
  id BIGSERIAL PRIMARY KEY,
  equipment_code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL CHECK (LENGTH(name) > 0),
  category VARCHAR(100) NOT NULL,
  status enum_equipment_status NOT NULL DEFAULT 'Available',
  location VARCHAR(255) NOT NULL,
  last_maintenance DATE,
  borrowed_by VARCHAR(255),
  return_date DATE,
  issue VARCHAR(255),
  manufacturer VARCHAR(255),
  model VARCHAR(100),
  serial_number VARCHAR(100) UNIQUE,
  purchase_date DATE,
  purchase_price DECIMAL(10,2) CHECK (purchase_price >= 0),
  current_value DECIMAL(10,2) CHECK (current_value >= 0),
  depreciation_rate VARCHAR(100),
  warranty_expiry DATE,
  specifications JSONB,
  maintenance_history JSONB,
  usage_log JSONB,
  notes TEXT,
  image_url VARCHAR(512),
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_equipment_code ON equipment(equipment_code);
CREATE INDEX idx_equipment_serial_number ON equipment(serial_number) WHERE serial_number IS NOT NULL;
CREATE INDEX idx_equipment_category ON equipment(category);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_location ON equipment(location);
CREATE INDEX idx_last_maintenance ON equipment(last_maintenance);
CREATE INDEX idx_equipment_deleted_at ON equipment(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE equipment IS 'Laboratory equipment inventory and maintenance tracking';

-- Inventory Transactions (Audit log)
CREATE TABLE inventory_transactions (
  id BIGSERIAL PRIMARY KEY,
  transaction_code VARCHAR(20) NOT NULL UNIQUE,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id BIGINT,
  user_name VARCHAR(255) NOT NULL,
  action enum_transaction_action NOT NULL,
  item_type enum_item_type NOT NULL,
  item_id BIGINT,
  item_name VARCHAR(255) NOT NULL,
  quantity_change VARCHAR(100),
  category VARCHAR(100) NOT NULL,
  location_from VARCHAR(255),
  location_to VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transaction_code ON inventory_transactions(transaction_code);
CREATE INDEX idx_transaction_user_id ON inventory_transactions(user_id);
CREATE INDEX idx_transaction_action ON inventory_transactions(action);
CREATE INDEX idx_transaction_item_type ON inventory_transactions(item_type);
CREATE INDEX idx_transaction_timestamp ON inventory_transactions(timestamp);
CREATE INDEX idx_transaction_item_type_id ON inventory_transactions(item_type, item_id);

COMMENT ON TABLE inventory_transactions IS 'Complete audit trail of inventory movements';
COMMENT ON COLUMN inventory_transactions.transaction_code IS 'Immutable log — never modified or deleted';

-- ═══════════════════════════════════════════════════════════════════
-- STEP 5: RESEARCH MODULE TABLES
-- ═══════════════════════════════════════════════════════════════════

-- Experiments
CREATE TABLE experiments (
  id BIGSERIAL PRIMARY KEY,
  experiment_code VARCHAR(20) NOT NULL UNIQUE,
  species_id BIGINT NOT NULL REFERENCES plant_species(id) ON DELETE RESTRICT,
  species_name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL CHECK (LENGTH(title) > 0),
  objective TEXT NOT NULL CHECK (LENGTH(objective) > 0),
  propagation_method enum_propagation_method NOT NULL,
  growth_medium VARCHAR(255) NOT NULL,
  environment VARCHAR(255) NOT NULL,
  initial_seed_count INTEGER NOT NULL CHECK (initial_seed_count > 0),
  current_count INTEGER NOT NULL CHECK (current_count >= 0),
  start_date DATE NOT NULL,
  expected_end_date DATE NOT NULL CHECK (expected_end_date > start_date),
  actual_end_date DATE CHECK (actual_end_date >= start_date),
  status enum_experiment_status NOT NULL DEFAULT 'Planning',
  final_yield INTEGER CHECK (final_yield >= 0),
  avg_survival_rate DECIMAL(5,2) CHECK (avg_survival_rate >= 0 AND avg_survival_rate <= 100),
  multiplication_rate DECIMAL(5,2) CHECK (multiplication_rate >= 1),
  conclusion TEXT,
  assigned_to JSONB NOT NULL,
  tags JSONB,
  image_url VARCHAR(512),
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_experiment_code ON experiments(experiment_code);
CREATE INDEX idx_experiment_species_id ON experiments(species_id);
CREATE INDEX idx_experiment_status ON experiments(status);
CREATE INDEX idx_experiment_propagation_method ON experiments(propagation_method);
CREATE INDEX idx_experiment_title ON experiments(title);
CREATE INDEX idx_experiment_start_date ON experiments(start_date);
CREATE INDEX idx_experiments_deleted_at ON experiments(deleted_at) WHERE deleted_at IS NULL;

COMMENT ON TABLE experiments IS 'Research experiments tracking seedling propagation trials';

-- Growth Logs
CREATE TABLE growth_logs (
  id BIGSERIAL PRIMARY KEY,
  log_code VARCHAR(20) NOT NULL UNIQUE,
  experiment_id BIGINT NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL CHECK (week_number > 0),
  log_date DATE NOT NULL,
  seedling_count INTEGER NOT NULL CHECK (seedling_count >= 0),
  alive_count INTEGER NOT NULL CHECK (alive_count >= 0 AND alive_count <= seedling_count),
  dead_count INTEGER NOT NULL CHECK (dead_count >= 0),
  new_propagations INTEGER NOT NULL CHECK (new_propagations >= 0),
  survival_rate_pct DECIMAL(5,2) NOT NULL CHECK (survival_rate_pct >= 0 AND survival_rate_pct <= 100),
  multiplication_rate DECIMAL(5,2) NOT NULL CHECK (multiplication_rate >= 1),
  health_score INTEGER NOT NULL CHECK (health_score >= 1 AND health_score <= 10),
  avg_height_cm DECIMAL(5,2) CHECK (avg_height_cm >= 0),
  growth_stage enum_growth_stage NOT NULL,
  observations TEXT NOT NULL CHECK (LENGTH(observations) > 0),
  photo_urls JSONB,
  environmental_data JSONB,
  recorded_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_exp_week UNIQUE (experiment_id, week_number)
);

CREATE INDEX idx_log_code ON growth_logs(log_code);
CREATE INDEX idx_growth_log_experiment_id ON growth_logs(experiment_id);
CREATE INDEX idx_growth_stage ON growth_logs(growth_stage);
CREATE INDEX idx_log_date ON growth_logs(log_date);

COMMENT ON TABLE growth_logs IS 'Weekly tracking of seedling growth during experiments';

-- Lab Notebooks
CREATE TABLE lab_notebooks (
  id BIGSERIAL PRIMARY KEY,
  notebook_code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL CHECK (LENGTH(title) > 0),
  content TEXT NOT NULL CHECK (LENGTH(content) > 0),
  author VARCHAR(255) NOT NULL,
  experiment_id BIGINT REFERENCES experiments(id) ON DELETE SET NULL,
  experiment_code VARCHAR(20),
  tags JSONB,
  is_locked BOOLEAN NOT NULL DEFAULT FALSE,
  created_by BIGINT,
  updated_by BIGINT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE INDEX idx_notebook_code ON lab_notebooks(notebook_code);
CREATE INDEX idx_notebook_experiment_id ON lab_notebooks(experiment_id);
CREATE INDEX idx_notebook_author ON lab_notebooks(author);
CREATE INDEX idx_notebook_is_locked ON lab_notebooks(is_locked);
CREATE INDEX idx_notebook_created_at ON lab_notebooks(created_at);
CREATE INDEX idx_notebooks_deleted_at ON lab_notebooks(deleted_at) WHERE deleted_at IS NULL;

-- Full-text search (PostgreSQL specific)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_notebook_title_content_fulltext ON lab_notebooks USING GIN (to_tsvector('english', title || ' ' || content));

COMMENT ON TABLE lab_notebooks IS 'Digital lab notebook entries for documenting research observations';

-- Species Growth Profiles (Aggregated statistics)
CREATE TABLE species_growth_profiles (
  id BIGSERIAL PRIMARY KEY,
  species_id BIGINT NOT NULL UNIQUE REFERENCES plant_species(id) ON DELETE RESTRICT,
  species_name VARCHAR(255) NOT NULL,
  common_name VARCHAR(255) NOT NULL,
  total_experiments INTEGER NOT NULL CHECK (total_experiments >= 0),
  completed_experiments INTEGER NOT NULL CHECK (completed_experiments >= 0),
  avg_multiplication_rate DECIMAL(5,2) NOT NULL CHECK (avg_multiplication_rate >= 1),
  avg_survival_rate DECIMAL(5,2) NOT NULL CHECK (avg_survival_rate >= 0 AND avg_survival_rate <= 100),
  std_dev_survival DECIMAL(5,2) CHECK (std_dev_survival >= 0),
  avg_cycle_duration_weeks INTEGER NOT NULL CHECK (avg_cycle_duration_weeks > 0),
  best_multiplication_rate DECIMAL(5,2) NOT NULL CHECK (best_multiplication_rate >= 1),
  worst_multiplication_rate DECIMAL(5,2) NOT NULL CHECK (worst_multiplication_rate >= 1),
  avg_yield_per_initial DECIMAL(5,2) NOT NULL CHECK (avg_yield_per_initial >= 0),
  propagation_methods JSONB NOT NULL,
  last_calculated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_profile_species_id ON species_growth_profiles(species_id);
CREATE INDEX idx_avg_multiplication_rate ON species_growth_profiles(avg_multiplication_rate);
CREATE INDEX idx_avg_survival_rate ON species_growth_profiles(avg_survival_rate);

COMMENT ON TABLE species_growth_profiles IS 'Aggregated statistics per species from completed experiments';
COMMENT ON COLUMN species_growth_profiles.last_calculated IS 'Populated by scheduled job from experiments and growth_logs';

-- ═══════════════════════════════════════════════════════════════════
-- STEP 6: TRIGGERS FOR AUTO-UPDATE
-- ═══════════════════════════════════════════════════════════════════

-- Trigger function for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plant_species_updated_at BEFORE UPDATE ON plant_species FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_plant_batches_updated_at BEFORE UPDATE ON plant_batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chemicals_updated_at BEFORE UPDATE ON chemicals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_equipment_updated_at BEFORE UPDATE ON equipment FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiments_updated_at BEFORE UPDATE ON experiments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_protocols_updated_at BEFORE UPDATE ON protocols FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lab_notebooks_updated_at BEFORE UPDATE ON lab_notebooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════════════
-- STEP 7: SAMPLE DATA (Optional - for testing)
-- ═══════════════════════════════════════════════════════════════════

-- Insert a sample plant species
INSERT INTO plant_species (
  species_code, scientific_name, common_name, family, growth_type, 
  optimal_temp, description
) VALUES (
  'SP-001', 
  'Solanum lycopersicum', 
  'Tomato', 
  'Solanaceae', 
  'Annual',
  '20–25°C',
  'Widely cultivated edible fruit-bearing plant used in various research studies.'
);

-- Insert a sample client
INSERT INTO clients (
  client_code, company_name, contact_name, email, phone, 
  address, client_type, notes
) VALUES (
  'CLT-001',
  'Green Valley Farms',
  'John Smith',
  'john@greenvalley.com',
  '+1-555-0123',
  '123 Farm Road, CA 90210',
  'Farm Owner',
  'Long-term partner since 2020'
);

-- ═══════════════════════════════════════════════════════════════════
-- END OF SCHEMA
-- ═══════════════════════════════════════════════════════════════════

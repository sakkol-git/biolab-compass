// ═══════════════════════════════════════════════════════════════════════════
// MOCK BUSINESS DATA — Clients, Contracts, Milestones, Payments
// ═══════════════════════════════════════════════════════════════════════════

import type { Client, Contract, ContractMilestone, Payment, ProductionForecast } from "@/types/business";

// ─── Clients ────────────────────────────────────────────────────────────────

export const clientsData: Client[] = [
  { id: "CLT-001", companyName: "Green Valley Farms", contactName: "Robert Anderson", email: "robert@greenvalley.com", phone: "+1-555-0101", address: "123 Farm Road, Sacramento, CA 95814", clientType: "Farm Owner", notes: "Large-scale organic farm. Repeat customer. Interested in tomato and maize seedlings.", totalContracts: 3, totalValue: 45000, createdAt: "2025-06-15" },
  { id: "CLT-002", companyName: "AgriTech Ventures", contactName: "Lisa Patel", email: "lisa@agritechvc.com", phone: "+1-555-0202", address: "456 Investment Ave, San Francisco, CA 94105", clientType: "Investor", notes: "Venture capital firm focusing on agricultural biotech. Interested in bulk orders for portfolio companies.", totalContracts: 2, totalValue: 82000, createdAt: "2025-08-20" },
  { id: "CLT-003", companyName: "Thailand Rice Cooperative", contactName: "Somchai Prasert", email: "somchai@thairicecooop.th", phone: "+66-2-555-0303", address: "789 Paddy Lane, Chiang Mai 50200, Thailand", clientType: "Farm Owner", notes: "Cooperative of 200+ rice farmers. Need high-yield disease-resistant rice seedlings.", totalContracts: 1, totalValue: 35000, createdAt: "2025-10-01" },
  { id: "CLT-004", companyName: "Ministry of Agriculture", contactName: "Dr. Amara Suksai", email: "amara@moa.gov.th", phone: "+66-2-555-0404", address: "Government Complex, Bangkok 10200, Thailand", clientType: "Government", notes: "Government contract for national wheat cultivation program.", totalContracts: 1, totalValue: 120000, createdAt: "2025-11-10" },
  { id: "CLT-005", companyName: "Sunshine Nurseries", contactName: "Maria Santos", email: "maria@sunshinenurseries.com", phone: "+1-555-0505", address: "321 Nursery Drive, Tampa, FL 33601", clientType: "Farm Owner", notes: "Medium nursery specializing in tropical plants. New client.", totalContracts: 1, totalValue: 18000, createdAt: "2026-01-05" },
  { id: "CLT-006", companyName: "BioGreen Research Institute", contactName: "Prof. David Park", email: "dpark@biogreen.edu", phone: "+1-555-0606", address: "University Campus, Davis, CA 95616", clientType: "Research Partner", notes: "Academic partner. Collaborative research on Arabidopsis genetics.", totalContracts: 1, totalValue: 8500, createdAt: "2025-09-15" },
];

// ─── Contracts ──────────────────────────────────────────────────────────────

export const contractsData: Contract[] = [
  { id: "CON-001", contractCode: "CON-001", clientId: "CLT-001", clientName: "Green Valley Farms", speciesId: "SP-001", speciesName: "Solanum lycopersicum", commonName: "Tomato", quantityOrdered: 5000, quantityDelivered: 5000, unitPrice: 3.0, totalValue: 15000, currency: "USD", contractDate: "2025-07-01", deliveryDeadline: "2025-11-15", actualDeliveryDate: "2025-11-10", status: "Delivered", terms: "40% deposit, 30% midpoint, 30% on delivery", managedBy: "Dr. Sarah Chen", progressPct: 100, createdAt: "2025-07-01" },
  { id: "CON-002", contractCode: "CON-002", clientId: "CLT-002", clientName: "AgriTech Ventures", speciesId: "SP-003", speciesName: "Zea mays", commonName: "Maize", quantityOrdered: 10000, quantityDelivered: 6500, unitPrice: 4.5, totalValue: 45000, currency: "USD", contractDate: "2025-09-15", deliveryDeadline: "2026-03-15", status: "In Production", terms: "50% deposit, 50% on delivery", managedBy: "Dr. Sarah Chen", progressPct: 65, createdAt: "2025-09-15" },
  { id: "CON-003", contractCode: "CON-003", clientId: "CLT-003", clientName: "Thailand Rice Cooperative", speciesId: "SP-004", speciesName: "Oryza sativa", commonName: "Rice", quantityOrdered: 8000, quantityDelivered: 3200, unitPrice: 4.38, totalValue: 35000, currency: "USD", contractDate: "2025-10-20", deliveryDeadline: "2026-04-30", status: "In Production", terms: "30% deposit, 40% midpoint, 30% on delivery", managedBy: "Dr. Sarah Chen", progressPct: 40, createdAt: "2025-10-20" },
  { id: "CON-004", contractCode: "CON-004", clientId: "CLT-004", clientName: "Ministry of Agriculture", speciesId: "SP-007", speciesName: "Triticum aestivum", commonName: "Wheat", quantityOrdered: 20000, quantityDelivered: 0, unitPrice: 6.0, totalValue: 120000, currency: "USD", contractDate: "2025-12-01", deliveryDeadline: "2026-06-30", status: "Signed", terms: "30% deposit, 3 milestone payments of 15%, 25% on delivery", managedBy: "Dr. Sarah Chen", progressPct: 5, createdAt: "2025-12-01" },
  { id: "CON-005", contractCode: "CON-005", clientId: "CLT-001", clientName: "Green Valley Farms", speciesId: "SP-001", speciesName: "Solanum lycopersicum", commonName: "Tomato", quantityOrdered: 8000, quantityDelivered: 0, unitPrice: 2.75, totalValue: 22000, currency: "USD", contractDate: "2026-01-10", deliveryDeadline: "2026-05-15", status: "In Production", terms: "40% deposit, 60% on delivery", managedBy: "James Wong", progressPct: 20, createdAt: "2026-01-10" },
  { id: "CON-006", contractCode: "CON-006", clientId: "CLT-005", clientName: "Sunshine Nurseries", speciesId: "SP-001", speciesName: "Solanum lycopersicum", commonName: "Tomato", quantityOrdered: 3000, quantityDelivered: 0, unitPrice: 6.0, totalValue: 18000, currency: "USD", contractDate: "2026-01-20", deliveryDeadline: "2026-04-20", status: "Signed", terms: "50% deposit, 50% on delivery", managedBy: "James Wong", progressPct: 10, createdAt: "2026-01-20" },
  { id: "CON-007", contractCode: "CON-007", clientId: "CLT-006", clientName: "BioGreen Research Institute", speciesId: "SP-002", speciesName: "Arabidopsis thaliana", commonName: "Thale Cress", quantityOrdered: 2000, quantityDelivered: 2000, unitPrice: 4.25, totalValue: 8500, currency: "USD", contractDate: "2025-10-01", deliveryDeadline: "2025-12-20", actualDeliveryDate: "2025-12-18", status: "Delivered", terms: "100% on delivery", managedBy: "Dr. Sarah Chen", progressPct: 100, createdAt: "2025-10-01" },
  { id: "CON-008", contractCode: "CON-008", clientId: "CLT-002", clientName: "AgriTech Ventures", speciesId: "SP-004", speciesName: "Oryza sativa", commonName: "Rice", quantityOrdered: 15000, quantityDelivered: 0, unitPrice: 2.47, totalValue: 37000, currency: "USD", contractDate: "2026-02-01", deliveryDeadline: "2026-08-01", status: "Draft", terms: "TBD", managedBy: "Dr. Sarah Chen", progressPct: 0, createdAt: "2026-02-01" },
];

// ─── Contract Milestones ────────────────────────────────────────────────────

export const contractMilestonesData: Record<string, ContractMilestone[]> = {
  "CON-002": [
    { id: "MS-001", contractId: "CON-002", milestoneName: "Germination Complete", targetDate: "2025-10-15", actualDate: "2025-10-12", projectedCount: 1500, actualCount: 1400, status: "Completed", notes: "Germination ahead of schedule" },
    { id: "MS-002", contractId: "CON-002", milestoneName: "First Propagation Cycle", targetDate: "2025-11-30", actualDate: "2025-11-28", projectedCount: 3500, actualCount: 3600, status: "Completed", notes: "Exceeded target by 100 seedlings" },
    { id: "MS-003", contractId: "CON-002", milestoneName: "Second Propagation Cycle", targetDate: "2026-01-15", actualDate: "2026-01-18", projectedCount: 7000, actualCount: 6500, status: "At Risk", notes: "Slightly behind due to cold snap. Adjusted greenhouse heating." },
    { id: "MS-004", contractId: "CON-002", milestoneName: "Hardening Phase", targetDate: "2026-02-15", projectedCount: 9000, status: "Pending", notes: "Upcoming" },
    { id: "MS-005", contractId: "CON-002", milestoneName: "Final Delivery", targetDate: "2026-03-15", projectedCount: 10000, status: "Pending", notes: "Target: 10,000 seedlings" },
  ],
  "CON-003": [
    { id: "MS-010", contractId: "CON-003", milestoneName: "Callus Induction", targetDate: "2025-11-15", actualDate: "2025-11-14", projectedCount: 500, actualCount: 480, status: "Completed", notes: "TC initiation successful" },
    { id: "MS-011", contractId: "CON-003", milestoneName: "First Multiplication", targetDate: "2025-12-30", actualDate: "2026-01-02", projectedCount: 2000, actualCount: 1800, status: "Completed", notes: "Slightly below target. Media adjusted." },
    { id: "MS-012", contractId: "CON-003", milestoneName: "Second Multiplication", targetDate: "2026-02-15", projectedCount: 5000, actualCount: 3200, status: "On Track", notes: "Current pace on target" },
    { id: "MS-013", contractId: "CON-003", milestoneName: "Hardening & Delivery", targetDate: "2026-04-30", projectedCount: 8000, status: "Pending", notes: "Final delivery" },
  ],
  "CON-004": [
    { id: "MS-020", contractId: "CON-004", milestoneName: "Seed Treatment & Germination", targetDate: "2026-01-30", actualDate: "2026-01-28", projectedCount: 2000, actualCount: 1900, status: "Completed", notes: "Initial batch germination" },
    { id: "MS-021", contractId: "CON-004", milestoneName: "First Growth Phase", targetDate: "2026-03-15", projectedCount: 6000, status: "Pending", notes: "Scale-up phase" },
    { id: "MS-022", contractId: "CON-004", milestoneName: "Second Growth Phase", targetDate: "2026-05-01", projectedCount: 14000, status: "Pending", notes: "Major multiplication" },
    { id: "MS-023", contractId: "CON-004", milestoneName: "Final Delivery", targetDate: "2026-06-30", projectedCount: 20000, status: "Pending", notes: "Full 20,000 wheat seedlings" },
  ],
};

// ─── Payments ───────────────────────────────────────────────────────────────

export const paymentsData: Payment[] = [
  // CON-001 (Delivered)
  { id: "PAY-001", contractId: "CON-001", contractCode: "CON-001", clientName: "Green Valley Farms", amount: 6000, currency: "USD", paymentType: "Deposit", paymentMethod: "Bank Transfer", paymentDate: "2025-07-05", dueDate: "2025-07-10", status: "Received", referenceNumber: "TXN-20250705-001", notes: "40% deposit", createdAt: "2025-07-01" },
  { id: "PAY-002", contractId: "CON-001", contractCode: "CON-001", clientName: "Green Valley Farms", amount: 4500, currency: "USD", paymentType: "Milestone", paymentMethod: "Bank Transfer", paymentDate: "2025-09-15", dueDate: "2025-09-20", status: "Received", referenceNumber: "TXN-20250915-001", notes: "30% midpoint", createdAt: "2025-07-01" },
  { id: "PAY-003", contractId: "CON-001", contractCode: "CON-001", clientName: "Green Valley Farms", amount: 4500, currency: "USD", paymentType: "Final", paymentMethod: "Bank Transfer", paymentDate: "2025-11-12", dueDate: "2025-11-15", status: "Received", referenceNumber: "TXN-20251112-001", notes: "30% final", createdAt: "2025-07-01" },
  // CON-002 (In Production)
  { id: "PAY-004", contractId: "CON-002", contractCode: "CON-002", clientName: "AgriTech Ventures", amount: 22500, currency: "USD", paymentType: "Deposit", paymentMethod: "Wire Transfer", paymentDate: "2025-09-18", dueDate: "2025-09-20", status: "Received", referenceNumber: "TXN-20250918-002", notes: "50% deposit", createdAt: "2025-09-15" },
  { id: "PAY-005", contractId: "CON-002", contractCode: "CON-002", clientName: "AgriTech Ventures", amount: 22500, currency: "USD", paymentType: "Final", paymentMethod: "Wire Transfer", paymentDate: "", dueDate: "2026-03-20", status: "Pending", referenceNumber: "", notes: "50% on delivery", createdAt: "2025-09-15" },
  // CON-003 (In Production)
  { id: "PAY-006", contractId: "CON-003", contractCode: "CON-003", clientName: "Thailand Rice Cooperative", amount: 10500, currency: "USD", paymentType: "Deposit", paymentMethod: "Bank Transfer", paymentDate: "2025-10-25", dueDate: "2025-10-30", status: "Received", referenceNumber: "TXN-20251025-003", notes: "30% deposit", createdAt: "2025-10-20" },
  { id: "PAY-007", contractId: "CON-003", contractCode: "CON-003", clientName: "Thailand Rice Cooperative", amount: 14000, currency: "USD", paymentType: "Milestone", paymentMethod: "Bank Transfer", paymentDate: "", dueDate: "2026-02-28", status: "Pending", referenceNumber: "", notes: "40% midpoint", createdAt: "2025-10-20" },
  { id: "PAY-008", contractId: "CON-003", contractCode: "CON-003", clientName: "Thailand Rice Cooperative", amount: 10500, currency: "USD", paymentType: "Final", paymentMethod: "Bank Transfer", paymentDate: "", dueDate: "2026-05-10", status: "Pending", referenceNumber: "", notes: "30% final", createdAt: "2025-10-20" },
  // CON-004 (Signed)
  { id: "PAY-009", contractId: "CON-004", contractCode: "CON-004", clientName: "Ministry of Agriculture", amount: 36000, currency: "USD", paymentType: "Deposit", paymentMethod: "Government Wire", paymentDate: "2025-12-10", dueDate: "2025-12-15", status: "Received", referenceNumber: "GOV-20251210-004", notes: "30% deposit", createdAt: "2025-12-01" },
  { id: "PAY-010", contractId: "CON-004", contractCode: "CON-004", clientName: "Ministry of Agriculture", amount: 18000, currency: "USD", paymentType: "Milestone", paymentMethod: "Government Wire", paymentDate: "", dueDate: "2026-03-15", status: "Pending", referenceNumber: "", notes: "15% milestone 1", createdAt: "2025-12-01" },
  { id: "PAY-011", contractId: "CON-004", contractCode: "CON-004", clientName: "Ministry of Agriculture", amount: 18000, currency: "USD", paymentType: "Milestone", paymentMethod: "Government Wire", paymentDate: "", dueDate: "2026-05-01", status: "Pending", referenceNumber: "", notes: "15% milestone 2", createdAt: "2025-12-01" },
  { id: "PAY-012", contractId: "CON-004", contractCode: "CON-004", clientName: "Ministry of Agriculture", amount: 18000, currency: "USD", paymentType: "Milestone", paymentMethod: "Government Wire", paymentDate: "", dueDate: "2026-06-01", status: "Pending", referenceNumber: "", notes: "15% milestone 3", createdAt: "2025-12-01" },
  { id: "PAY-013", contractId: "CON-004", contractCode: "CON-004", clientName: "Ministry of Agriculture", amount: 30000, currency: "USD", paymentType: "Final", paymentMethod: "Government Wire", paymentDate: "", dueDate: "2026-07-15", status: "Pending", referenceNumber: "", notes: "25% final", createdAt: "2025-12-01" },
  // CON-005 (In Production)
  { id: "PAY-014", contractId: "CON-005", contractCode: "CON-005", clientName: "Green Valley Farms", amount: 8800, currency: "USD", paymentType: "Deposit", paymentMethod: "Bank Transfer", paymentDate: "2026-01-15", dueDate: "2026-01-15", status: "Received", referenceNumber: "TXN-20260115-005", notes: "40% deposit", createdAt: "2026-01-10" },
  { id: "PAY-015", contractId: "CON-005", contractCode: "CON-005", clientName: "Green Valley Farms", amount: 13200, currency: "USD", paymentType: "Final", paymentMethod: "Bank Transfer", paymentDate: "", dueDate: "2026-05-20", status: "Pending", referenceNumber: "", notes: "60% on delivery", createdAt: "2026-01-10" },
  // CON-006 (Signed)
  { id: "PAY-016", contractId: "CON-006", contractCode: "CON-006", clientName: "Sunshine Nurseries", amount: 9000, currency: "USD", paymentType: "Deposit", paymentMethod: "Check", paymentDate: "2026-01-25", dueDate: "2026-01-25", status: "Received", referenceNumber: "CHK-20260125-006", notes: "50% deposit", createdAt: "2026-01-20" },
  { id: "PAY-017", contractId: "CON-006", contractCode: "CON-006", clientName: "Sunshine Nurseries", amount: 9000, currency: "USD", paymentType: "Final", paymentMethod: "Check", paymentDate: "", dueDate: "2026-04-25", status: "Pending", referenceNumber: "", notes: "50% on delivery", createdAt: "2026-01-20" },
  // CON-007 (Delivered)
  { id: "PAY-018", contractId: "CON-007", contractCode: "CON-007", clientName: "BioGreen Research Institute", amount: 8500, currency: "USD", paymentType: "Final", paymentMethod: "Bank Transfer", paymentDate: "2025-12-20", dueDate: "2025-12-25", status: "Received", referenceNumber: "TXN-20251220-007", notes: "100% on delivery", createdAt: "2025-10-01" },
];

// ─── Production Forecasts (pre-computed examples) ───────────────────────────

export const productionForecastsData: ProductionForecast[] = [
  {
    id: "FC-001",
    speciesName: "Solanum lycopersicum",
    commonName: "Tomato",
    desiredQuantity: 10000,
    recommendedInitialStock: 1100,
    estimatedWeeks: 16,
    confidenceLowerWeeks: 14,
    confidenceUpperWeeks: 19,
    estimatedCycles: 3,
    estimatedSurvivalRate: 93.2,
    estimatedMultiplicationRate: 9.8,
    weeklyMilestones: [
      { week: 1, projected: 1020 }, { week: 2, projected: 1000 },
      { week: 4, projected: 1950 }, { week: 6, projected: 1900 },
      { week: 8, projected: 3700 }, { week: 10, projected: 3600 },
      { week: 12, projected: 7000 }, { week: 14, projected: 8500 },
      { week: 16, projected: 10200 },
    ],
    resourceRequirements: { greenhouses: 2, laborHours: 320, estimatedCost: 8500 },
    propagationMethod: "Grafting",
    createdAt: "2026-02-05",
    calculatedBy: "Dr. Sarah Chen",
  },
];

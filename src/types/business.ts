// ═══════════════════════════════════════════════════════════════════════════
// BUSINESS MODULE — TypeScript Interfaces
// ═══════════════════════════════════════════════════════════════════════════

export type ContractStatus = "Draft" | "Sent" | "Signed" | "In Production" | "Ready" | "Delivered" | "Cancelled";
export type ClientType = "Farm Owner" | "Investor" | "Government" | "NGO" | "Research Partner";
export type PaymentStatus = "Pending" | "Received" | "Overdue" | "Cancelled";
export type PaymentType = "Deposit" | "Milestone" | "Final" | "Refund";
export type MilestoneStatus = "Pending" | "On Track" | "At Risk" | "Completed" | "Missed";

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  clientType: ClientType;
  notes: string;
  totalContracts: number;
  totalValue: number;
  createdAt: string;
}

export interface Contract {
  id: string;
  contractCode: string;
  clientId: string;
  clientName: string;
  speciesId: string;
  speciesName: string;
  commonName: string;
  quantityOrdered: number;
  quantityDelivered: number;
  unitPrice: number;
  totalValue: number;
  currency: string;
  contractDate: string;
  deliveryDeadline: string;
  actualDeliveryDate?: string;
  status: ContractStatus;
  terms: string;
  managedBy: string;
  progressPct: number;
  createdAt: string;
}

export interface ContractMilestone {
  id: string;
  contractId: string;
  milestoneName: string;
  targetDate: string;
  actualDate?: string;
  projectedCount: number;
  actualCount?: number;
  status: MilestoneStatus;
  notes: string;
}

export interface Payment {
  id: string;
  contractId: string;
  contractCode: string;
  clientName: string;
  amount: number;
  currency: string;
  paymentType: PaymentType;
  paymentMethod: string;
  paymentDate: string;
  dueDate: string;
  status: PaymentStatus;
  referenceNumber: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductionForecast {
  id: string;
  speciesName: string;
  commonName: string;
  desiredQuantity: number;
  recommendedInitialStock: number;
  estimatedWeeks: number;
  confidenceLowerWeeks: number;
  confidenceUpperWeeks: number;
  estimatedCycles: number;
  estimatedSurvivalRate: number;
  estimatedMultiplicationRate: number;
  weeklyMilestones: { week: number; projected: number }[];
  resourceRequirements: {
    greenhouses: number;
    laborHours: number;
    estimatedCost: number;
  };
  propagationMethod: string;
  createdAt: string;
  calculatedBy: string;
}

/* ═══════════════════════════════════════════════════════════════════════════
 * useContractsView — All state + logic for the Contracts page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { contractsData as initialContracts, clientsData } from "@/data/mockBusinessData";
import { formatCurrency } from "@/lib/calculator";
import { useCRUD } from "@/hooks/useCRUD";
import { ID_GENERATORS } from "@/lib/idGenerator";
import type { ContractStatus, Contract } from "@/types/business";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ContractForm {
  clientId: string;
  speciesName: string;
  commonName: string;
  quantityOrdered: number;
  unitPrice: number;
  deliveryDeadline: string;
  terms: string;
  managedBy: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: ContractForm = {
  clientId: "", speciesName: "", commonName: "", quantityOrdered: 0,
  unitPrice: 0, deliveryDeadline: "", terms: "", managedBy: "",
};

const STATUS_OPTIONS: ContractStatus[] = [
  "Draft", "Sent", "Signed", "In Production", "Ready", "Delivered", "Cancelled",
];

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useContractsView() {
  const navigate = useNavigate();

  const contractsCRUD = useCRUD<Contract>({
    entityName: "contract",
    idGenerator: ID_GENERATORS.contract,
    toastMessages: {
      created: (c) => `Contract ${c.contractCode} created`,
      updated: (c) => `Contract ${c.contractCode} updated`,
    },
    onBeforeCreate: (dto) => {
      const client = clientsData.find((c) => c.id === (dto as any).clientId);
      if (!client) return {};
      const totalValue = (dto as any).quantityOrdered * (dto as any).unitPrice;
      return {
        contractCode: ID_GENERATORS.contract(contractsCRUD.items.length + 1),
        clientName: client.companyName,
        speciesId: "SP-001",
        totalValue,
        currency: "USD",
        contractDate: new Date().toISOString().split("T")[0],
        quantityDelivered: 0,
        status: "Draft" as ContractStatus,
        progressPct: 0,
      };
    },
    onBeforeUpdate: (_id, dto) => {
      const client = clientsData.find((c) => c.id === (dto as any).clientId);
      if (!client) return {};
      const totalValue = (dto as any).quantityOrdered * (dto as any).unitPrice;
      return { clientName: client.companyName, totalValue };
    },
  }, initialContracts);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Contract | null>(null);
  const [form, setForm] = useState<ContractForm>(EMPTY_FORM);

  // ── Derived ──
  const contracts = contractsCRUD.items;

  const filteredContracts = contracts.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = c.clientName.toLowerCase().includes(q) || c.contractCode.toLowerCase().includes(q) || c.commonName.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Contract" : "Create Contract";
  const formDescription = isEditing ? "Update contract details." : "Create a new seedling production contract.";

  const canSubmitForm = Boolean(
    form.clientId && form.speciesName && form.commonName &&
    form.quantityOrdered && form.unitPrice && form.deliveryDeadline && form.managedBy,
  );

  const computedTotalValue = formatCurrency(form.quantityOrdered * form.unitPrice);

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateStatusFilter = (s: string) => setStatusFilter(s);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);
  const navigateToDetail = (id: string) => navigate(`/business/contracts/${id}`);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (contract: Contract) => {
    setEditingItem(contract);
    setForm({
      clientId: contract.clientId, speciesName: contract.speciesName,
      commonName: contract.commonName, quantityOrdered: contract.quantityOrdered,
      unitPrice: contract.unitPrice, deliveryDeadline: contract.deliveryDeadline,
      terms: contract.terms, managedBy: contract.managedBy,
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ContractForm>(field: K, value: ContractForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitContractForm = () => {
    if (editingItem) {
      contractsCRUD.update(editingItem.id, form);
    } else {
      contractsCRUD.create(form as any);
    }
    setFormOpen(false);
    setForm(EMPTY_FORM);
    setEditingItem(null);
  };

  return {
    contracts, filteredContracts, totalCount: contracts.length,
    searchQuery, updateSearchQuery, statusFilter, updateStatusFilter,
    statusOptions: STATUS_OPTIONS, availableClients: clientsData,
    viewMode, switchViewMode, navigateToDetail,
    formOpen, isEditing, formTitle, formDescription, form, canSubmitForm, computedTotalValue,
    openCreateForm, openEditForm, closeForm, updateFormField, submitContractForm,
  };
}

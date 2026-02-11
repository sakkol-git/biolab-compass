/* ═══════════════════════════════════════════════════════════════════════════
 * useClientsView — All state + logic for the Clients page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { toast } from "sonner";
import type { ViewMode } from "@/components/shared/ViewToggle";
import { clientsData as initialClients } from "@/data/mockBusinessData";
import { formatCurrency } from "@/lib/calculator";
import { useCRUD } from "@/hooks/useCRUD";
import { ID_GENERATORS } from "@/lib/idGenerator";
import type { Client, ClientType } from "@/types/business";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ClientForm {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  clientType: ClientType;
  notes: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: ClientForm = {
  companyName: "", contactName: "", email: "", phone: "",
  address: "", clientType: "Farm Owner", notes: "",
};

const CLIENT_TYPES: ClientType[] = ["Farm Owner", "Investor", "Government", "NGO", "Research Partner"];

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useClientsView() {
  const clientsCRUD = useCRUD<Client>({
    entityName: "client",
    idGenerator: ID_GENERATORS.client,
    toastMessages: {
      created: (c) => `${c.companyName} added`,
      updated: (c) => `${c.companyName} updated`,
    },
    onBeforeCreate: () => ({ totalContracts: 0, totalValue: 0 }),
  }, initialClients);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Client | null>(null);
  const [form, setForm] = useState<ClientForm>(EMPTY_FORM);

  // ── Derived ──
  const clients = clientsCRUD.items;

  const filteredClients = clients.filter((cl) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = cl.companyName.toLowerCase().includes(q) || cl.contactName.toLowerCase().includes(q);
    const matchesType = typeFilter === "all" || cl.clientType === typeFilter;
    return matchesSearch && matchesType;
  });

  const summaryStats = [
    { label: "Total Clients", value: String(clients.length) },
    { label: "Farm Owners", value: String(clients.filter((c) => c.clientType === "Farm Owner").length) },
    { label: "Total Pipeline", value: formatCurrency(clients.reduce((s, c) => s + c.totalValue, 0)) },
    { label: "Avg Value", value: formatCurrency(clients.reduce((s, c) => s + c.totalValue, 0) / (clients.length || 1)) },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Client" : "Add Client";
  const formDescription = isEditing ? "Update client details." : "Add a new client to your system.";
  const canSubmitForm = Boolean(form.companyName && form.contactName);

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateTypeFilter = (t: string) => setTypeFilter(t);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (cl: Client) => {
    setEditingItem(cl);
    setForm({
      companyName: cl.companyName, contactName: cl.contactName,
      email: cl.email, phone: cl.phone, address: cl.address,
      clientType: cl.clientType, notes: cl.notes,
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ClientForm>(field: K, value: ClientForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitClientForm = () => {
    if (editingItem) {
      clientsCRUD.update(editingItem.id, form);
    } else {
      clientsCRUD.create(form as Omit<Client, "id" | "createdAt">);
    }
    setFormOpen(false);
    setForm(EMPTY_FORM);
    setEditingItem(null);
  };

  return {
    filteredClients, totalCount: clients.length, summaryStats,
    searchQuery, updateSearchQuery, typeFilter, updateTypeFilter,
    clientTypes: CLIENT_TYPES,
    viewMode, switchViewMode,
    formOpen, isEditing, formTitle, formDescription, form, canSubmitForm,
    openCreateForm, openEditForm, closeForm, updateFormField, submitClientForm,
  };
}

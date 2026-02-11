/* ═══════════════════════════════════════════════════════════════════════════
 * useProtocolsView — All state + logic for the Protocols page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { toast } from "sonner";
import type { ViewMode } from "@/components/shared/ViewToggle";
import type { Stat } from "@/components/shared/QuickStats";
import { protocolsData as initialProtocols } from "@/data/mockResearchData";
import type { Protocol, ProtocolStatus } from "@/types/research";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ProtocolForm {
  title: string;
  description: string;
  category: string;
  status: ProtocolStatus;
  steps: string;
  author: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: ProtocolForm = {
  title: "", description: "", category: "", status: "Draft", steps: "", author: "",
};

const STATUS_OPTIONS: ProtocolStatus[] = ["Draft", "Active", "Archived"];

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useProtocolsView() {
  const [protocols, setProtocols] = useState<Protocol[]>(initialProtocols);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Protocol | null>(null);
  const [form, setForm] = useState<ProtocolForm>(EMPTY_FORM);

  // ── Derived ──
  const filteredProtocols = protocols.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const categories = [...new Set(protocols.map((p) => p.category))];

  const quickStats: Stat[] = [
    { label: "Total", value: protocols.length, color: "primary" },
    { label: "Active", value: protocols.filter((p) => p.status === "Active").length, color: "primary" },
    { label: "Draft", value: protocols.filter((p) => p.status === "Draft").length, color: "muted" },
    { label: "Categories", value: categories.length, color: "muted" },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Protocol" : "New Protocol";
  const formDescription = isEditing
    ? `Update ${editingItem!.id}`
    : "Define a new standard operating procedure.";

  const canSubmitForm = Boolean(form.title && form.category && form.author);

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);
  const updateStatusFilter = (s: string) => setStatusFilter(s);
  const switchViewMode = (mode: ViewMode) => setViewMode(mode);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (p: Protocol) => {
    setEditingItem(p);
    setForm({
      title: p.title, description: p.description, category: p.category,
      status: p.status, steps: String(p.steps), author: p.author,
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof ProtocolForm>(field: K, value: ProtocolForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submitProtocolForm = () => {
    if (editingItem) {
      setProtocols((prev) => prev.map((p) =>
        p.id === editingItem.id
          ? { ...p, title: form.title, description: form.description, category: form.category, status: form.status, steps: Number(form.steps), author: form.author, lastUpdated: new Date().toISOString().split("T")[0] }
          : p,
      ));
    } else {
      const newId = `PROT-${String(protocols.length + 1).padStart(3, "0")}`;
      setProtocols((prev) => [...prev, {
        id: newId, title: form.title, description: form.description,
        category: form.category, status: form.status, version: "1.0",
        steps: Number(form.steps) || 1, author: form.author,
        linkedExperiments: 0, tags: [], lastUpdated: new Date().toISOString().split("T")[0],
      }]);
    }

    setFormOpen(false);
    setForm(EMPTY_FORM);
    toast.success(isEditing ? `${form.title} updated` : `${form.title} created`);
    setEditingItem(null);
  };

  return {
    filteredProtocols, totalCount: protocols.length, quickStats,
    searchQuery, updateSearchQuery, statusFilter, updateStatusFilter,
    viewMode, switchViewMode,
    formOpen, isEditing, formTitle, formDescription, form, canSubmitForm,
    statusOptions: STATUS_OPTIONS,
    openCreateForm, openEditForm, closeForm, updateFormField, submitProtocolForm,
  };
}

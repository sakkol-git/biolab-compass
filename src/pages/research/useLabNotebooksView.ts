/* ═══════════════════════════════════════════════════════════════════════════
 * useLabNotebooksView — All state + logic for the Lab Notebooks page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useState } from "react";
import { toast } from "sonner";
import { experimentsData } from "@/data/mockResearchData";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface NotebookEntry {
  id: string;
  title: string;
  content: string;
  author: string;
  experimentId: string | null;
  experimentCode: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isLocked: boolean;
}

export interface NotebookForm {
  title: string;
  content: string;
  author: string;
  experimentId: string;
  tags: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const EMPTY_FORM: NotebookForm = {
  title: "", content: "", author: "", experimentId: "", tags: "",
};

const SEED_DATA: NotebookEntry[] = [
  {
    id: "NB-001", title: "Tomato Grafting Observations — Week 3",
    content: "Observed significant callus formation at the graft union site. Temperature maintained at 22°C with 85% humidity. Three out of fifty grafts showing early signs of vascular reconnection. Protocol PROT-002 followed without deviation. Noted slight wilting in batch C but recovered after misting.",
    author: "Dr. Sarah Chen", experimentId: "EXP-001", experimentCode: "EXP-001",
    tags: ["grafting", "observations", "week-3"], createdAt: "2025-01-15", updatedAt: "2025-01-15", isLocked: true,
  },
  {
    id: "NB-002", title: "Arabidopsis Tissue Culture Media Prep Notes",
    content: "Prepared MS media with modified cytokinin ratios: BAP at 1.5mg/L instead of standard 1.0mg/L. Autoclave cycle completed at 121°C for 20 minutes. pH adjusted to 5.7 before autoclaving. Media poured into 24 petri dishes and 12 culture vessels. Contamination check scheduled for 48 hours.",
    author: "James Wong", experimentId: "EXP-002", experimentCode: "EXP-002",
    tags: ["media-prep", "tissue-culture", "protocol"], createdAt: "2025-01-14", updatedAt: "2025-01-16", isLocked: false,
  },
  {
    id: "NB-003", title: "Environmental Chamber Calibration Log",
    content: "Calibrated temperature sensors in chambers A through D. Chamber B showing 0.3°C drift — sensor replaced and recalibrated. All humidity sensors within acceptable range (±2%). Light intensity verified at 150 µmol/m²/s PAR across all chambers. Full calibration report filed with equipment maintenance.",
    author: "Dr. Aisha Patel", experimentId: null, experimentCode: null,
    tags: ["calibration", "equipment", "maintenance"], createdAt: "2025-01-12", updatedAt: "2025-01-12", isLocked: true,
  },
  {
    id: "NB-004", title: "Maize Hybrid Vigor Study — Initial Planting",
    content: "Planted 500 seeds of hybrid line ZM-H7 alongside 200 inbred parents for comparison. Seeds pre-treated with fungicide (Thiram 2g/kg). Planting density: 10 seeds per pot, 50 pots total. Soil substrate: 60% peat, 30% perlite, 10% vermiculite. Growth chamber set to 28°C day / 22°C night, 16h photoperiod.",
    author: "Dr. Sarah Chen", experimentId: "EXP-003", experimentCode: "EXP-003",
    tags: ["hybrid-vigor", "planting", "maize"], createdAt: "2025-01-10", updatedAt: "2025-01-11", isLocked: false,
  },
  {
    id: "NB-005", title: "Weekly Lab Meeting Notes — Jan 8",
    content: "Team discussed Q1 experiment priorities. Agreed to fast-track tobacco expression study (EXP-005). Budget approved for additional growth chamber rental. Sarah to present rice drought tolerance results at next meeting. Action items: James to prepare cutting propagation materials, Aisha to complete equipment inventory audit by Jan 20.",
    author: "James Wong", experimentId: null, experimentCode: null,
    tags: ["meeting", "planning", "team"], createdAt: "2025-01-08", updatedAt: "2025-01-08", isLocked: true,
  },
];

// ─── Hook ──────────────────────────────────────────────────────────────────

export function useLabNotebooksView() {
  const [notebooks, setNotebooks] = useState<NotebookEntry[]>(SEED_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NotebookEntry | null>(null);
  const [form, setForm] = useState<NotebookForm>(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Derived ──
  const filteredEntries = notebooks.filter((nb) => {
    const q = searchQuery.toLowerCase();
    return (
      nb.title.toLowerCase().includes(q) ||
      nb.content.toLowerCase().includes(q) ||
      nb.author.toLowerCase().includes(q) ||
      nb.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const summaryStats = [
    { label: "Total Entries", value: notebooks.length },
    { label: "Locked", value: notebooks.filter((n) => n.isLocked).length },
    { label: "Linked to Experiments", value: notebooks.filter((n) => n.experimentId).length },
    { label: "Authors", value: [...new Set(notebooks.map((n) => n.author))].length },
  ];

  const isEditing = editingItem !== null;
  const formTitle = isEditing ? "Edit Entry" : "New Notebook Entry";
  const formDescription = isEditing
    ? "Update this notebook entry."
    : "Record observations, procedures, or notes.";

  const canSubmitForm = Boolean(form.title && form.content && form.author);

  const availableExperiments = experimentsData;

  // ── Actions ──
  const updateSearchQuery = (q: string) => setSearchQuery(q);

  const isExpanded = (id: string) => expandedId === id;
  const toggleExpansion = (id: string) => setExpandedId(expandedId === id ? null : id);

  const openCreateForm = () => { setEditingItem(null); setForm(EMPTY_FORM); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditingItem(null); };

  const openEditForm = (nb: NotebookEntry) => {
    if (nb.isLocked) { toast.error("This entry is locked and cannot be edited."); return; }
    setEditingItem(nb);
    setForm({
      title: nb.title, content: nb.content, author: nb.author,
      experimentId: nb.experimentId || "", tags: nb.tags.join(", "),
    });
    setFormOpen(true);
  };

  const updateFormField = <K extends keyof NotebookForm>(field: K, value: NotebookForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLock = (nb: NotebookEntry) => {
    setNotebooks((prev) => prev.map((n) =>
      n.id === nb.id ? { ...n, isLocked: !n.isLocked } : n,
    ));
    toast.success(nb.isLocked ? `${nb.id} unlocked` : `${nb.id} locked`);
  };

  const submitNotebookForm = () => {
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const linkedExp = availableExperiments.find((e) => e.id === form.experimentId);

    if (editingItem) {
      setNotebooks((prev) => prev.map((nb) =>
        nb.id === editingItem.id
          ? { ...nb, title: form.title, content: form.content, author: form.author, experimentId: form.experimentId || null, experimentCode: linkedExp?.experimentCode || null, tags, updatedAt: new Date().toISOString().split("T")[0] }
          : nb,
      ));
    } else {
      const newId = `NB-${String(notebooks.length + 1).padStart(3, "0")}`;
      setNotebooks((prev) => [{
        id: newId, title: form.title, content: form.content, author: form.author,
        experimentId: form.experimentId || null, experimentCode: linkedExp?.experimentCode || null,
        tags, createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0], isLocked: false,
      }, ...prev]);
    }

    setFormOpen(false);
    setForm(EMPTY_FORM);
    toast.success(isEditing ? `${form.title} updated` : `${form.title} created`);
    setEditingItem(null);
  };

  return {
    filteredEntries, totalCount: notebooks.length, summaryStats,
    searchQuery, updateSearchQuery,
    isExpanded, toggleExpansion,
    formOpen, isEditing, formTitle, formDescription, form, canSubmitForm,
    availableExperiments,
    openCreateForm, openEditForm, closeForm, updateFormField, submitNotebookForm, toggleLock,
  };
}

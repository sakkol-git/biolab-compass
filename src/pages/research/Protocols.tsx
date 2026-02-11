/* ═══════════════════════════════════════════════════════════════════════════
 * Protocols — Standard operating procedures and lab protocols.
 *
 * All state lives in useProtocolsView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { BookOpen, Plus, Tag, FileText, Link2, Pencil } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import { QuickStats } from "@/components/shared/QuickStats";
import SearchFilter from "@/components/shared/SearchFilter";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { protocolStatusStyles, statusBadge } from "@/lib/status-styles";

// ─── Hook & Types ──────────────────────────────────────────────────────────
import { useProtocolsView, type ProtocolForm } from "./useProtocolsView";
import type { Protocol, ProtocolStatus } from "@/types/research";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Protocols = () => {
  const view = useProtocolsView();
  const hasResults = view.filteredProtocols.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={BookOpen}
          title="Protocols"
          description="Standard operating procedures and lab protocols"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> Add Protocol
            </Button>
          }
        />

        <QuickStats stats={view.quickStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search protocols..."
        >
          <StatusFilter value={view.statusFilter} onChange={view.updateStatusFilter} options={view.statusOptions} />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && <EmptyState icon={BookOpen} title="No protocols found" description="Try adjusting your search or filter, or add a new protocol." />}

        {hasResults && view.viewMode === "grid" && <ProtocolGrid protocols={view.filteredProtocols} onEdit={view.openEditForm} />}
        {hasResults && view.viewMode === "list" && <ProtocolTable protocols={view.filteredProtocols} onEdit={view.openEditForm} />}

        <p className="text-sm text-muted-foreground">Showing {view.filteredProtocols.length} of {view.totalCount} protocols</p>
      </div>

      <ProtocolFormDialog view={view} />
    </AppLayout>
  );
};

export default Protocols;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Status Filter ─────────────────────────────────────────────────────── */

const StatusFilter = ({ value, onChange, options }: { value: string; onChange: (s: string) => void; options: ProtocolStatus[] }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Statuses</SelectItem>
      {options.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

const ProtocolGrid = ({ protocols, onEdit }: { protocols: Protocol[]; onEdit: (p: Protocol) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {protocols.map((p) => <ProtocolCard key={p.id} protocol={p} onEdit={onEdit} />)}
  </div>
);

const ProtocolCard = ({ protocol: p, onEdit }: { protocol: Protocol; onEdit: (p: Protocol) => void }) => (
  <div className="bg-card rounded-xl border border-border/60 hover:bg-muted/30 transition-colors p-5 flex flex-col overflow-hidden">
    <div className="flex items-start justify-between mb-3">
      <span className="font-mono text-xs font-normal text-muted-foreground/70">{p.id}</span>
      <span className={cn(statusBadge(protocolStatusStyles, p.status))}>{p.status}</span>
    </div>
    <h3 className="font-medium text-foreground text-sm leading-tight mb-1 line-clamp-2">{p.title}</h3>
    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
    <div className="mt-auto space-y-2 text-xs">
      <InfoLine icon={Tag} label={p.category} trailing={`v${p.version}`} />
      <InfoLine icon={FileText} label={`${p.steps} steps`} />
      <InfoLine icon={Link2} label={`${p.linkedExperiments} linked experiments`} />
    </div>
    <div className="pt-3 mt-3 border-t border-border/40 flex items-center justify-between">
      <div>
        <span className="text-xs text-muted-foreground">{p.author}</span>
        <span className="text-xs text-muted-foreground ml-2">{p.lastUpdated}</span>
      </div>
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onEdit(p)} aria-label={`Edit ${p.title}`}>
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

const InfoLine = ({ icon: Icon, label, trailing }: { icon: React.ElementType; label: string; trailing?: string }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3 w-3 text-muted-foreground/50 shrink-0" />
    <span className="text-muted-foreground/70">{label}</span>
    {trailing && <span className="text-foreground font-medium ml-auto">{trailing}</span>}
  </div>
);

/* ─── Table View ────────────────────────────────────────────────────────── */

const ProtocolTable = ({ protocols, onEdit }: { protocols: Protocol[]; onEdit: (p: Protocol) => void }) => (
  <div className="rounded-lg overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-center">Version</TableHead>
          <TableHead className="text-center">Steps</TableHead>
          <TableHead className="text-center">Linked</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Updated</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {protocols.map((p) => <ProtocolTableRow key={p.id} protocol={p} onEdit={onEdit} />)}
      </TableBody>
    </Table>
  </div>
);

const ProtocolTableRow = ({ protocol: p, onEdit }: { protocol: Protocol; onEdit: (p: Protocol) => void }) => (
  <TableRow>
    <TableCell className="font-mono text-xs text-muted-foreground/70">{p.id}</TableCell>
    <TableCell className="font-medium max-w-[200px] truncate">{p.title}</TableCell>
    <TableCell className="text-muted-foreground">{p.category}</TableCell>
    <TableCell className="text-center font-medium">v{p.version}</TableCell>
    <TableCell className="text-center tabular-nums">{p.steps}</TableCell>
    <TableCell className="text-center tabular-nums">{p.linkedExperiments}</TableCell>
    <TableCell className="text-center">
      <span className={cn(statusBadge(protocolStatusStyles, p.status, false))}>{p.status}</span>
    </TableCell>
    <TableCell className="text-sm text-muted-foreground">{p.author}</TableCell>
    <TableCell className="text-sm">{p.lastUpdated}</TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onEdit(p)} aria-label={`Edit ${p.title}`}>
        <Pencil className="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
);

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const ProtocolFormDialog = ({ view }: { view: ReturnType<typeof useProtocolsView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Protocol Title *</Label>
          <Input placeholder="e.g. Tissue Culture Initiation SOP" value={view.form.title} onChange={(e) => view.updateFormField("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea placeholder="Brief description..." value={view.form.description} onChange={(e) => view.updateFormField("description", e.target.value)} rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Input placeholder="e.g. Propagation" value={view.form.category} onChange={(e) => view.updateFormField("category", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={view.form.status} onValueChange={(v) => view.updateFormField("status", v as ProtocolStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {view.statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Number of Steps</Label>
            <Input type="number" min="1" placeholder="e.g. 8" value={view.form.steps} onChange={(e) => view.updateFormField("steps", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Author *</Label>
            <Input placeholder="e.g. Dr. Sarah Chen" value={view.form.author} onChange={(e) => view.updateFormField("author", e.target.value)} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitProtocolForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Create Protocol"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

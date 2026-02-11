/* ═══════════════════════════════════════════════════════════════════════════
 * Contracts — Seedling production contracts and deliveries.
 *
 * All state lives in useContractsView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { Receipt, Plus, Pencil } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import SearchFilter from "@/components/shared/SearchFilter";
import { ViewToggle } from "@/components/shared/ViewToggle";
import ContractCard from "@/components/business/ContractCard";
import ContractPipeline from "@/components/business/ContractPipeline";
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
import { contractStatusStyles, statusBadge } from "@/lib/status-styles";
import { formatCurrency } from "@/lib/calculator";

// ─── Hook & Types ──────────────────────────────────────────────────────────
import { useContractsView, type ContractForm } from "./useContractsView";
import type { Contract, ContractStatus } from "@/types/business";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Contracts = () => {
  const view = useContractsView();
  const hasResults = view.filteredContracts.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={Receipt}
          title="Contracts"
          description="Manage seedling production contracts and deliveries"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> Add Contract
            </Button>
          }
        />

        <PipelineOverview contracts={view.contracts} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search contracts..."
        >
          <StatusFilter value={view.statusFilter} onChange={view.updateStatusFilter} options={view.statusOptions} />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && <EmptyState icon={Receipt} title="No contracts found" description="Try adjusting your search or filter." />}

        {hasResults && view.viewMode === "grid" && <ContractGrid contracts={view.filteredContracts} onEdit={view.openEditForm} />}
        {hasResults && view.viewMode === "list" && <ContractTable contracts={view.filteredContracts} onNavigate={view.navigateToDetail} onEdit={view.openEditForm} />}

        <p className="text-sm text-muted-foreground">Showing {view.filteredContracts.length} of {view.totalCount} contracts</p>
      </div>

      <ContractFormDialog view={view} />
    </AppLayout>
  );
};

export default Contracts;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Pipeline Overview ─────────────────────────────────────────────────── */

const PipelineOverview = ({ contracts }: { contracts: Contract[] }) => (
  <div className="bg-card border border-border/60 p-5 rounded-xl">
    <h3 className="text-sm font-normal text-muted-foreground/70 mb-3">Pipeline Overview</h3>
    <ContractPipeline contracts={contracts} />
  </div>
);

/* ─── Status Filter ─────────────────────────────────────────────────────── */

const StatusFilter = ({ value, onChange, options }: { value: string; onChange: (s: string) => void; options: ContractStatus[] }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Statuses" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Statuses</SelectItem>
      {options.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

const ContractGrid = ({ contracts, onEdit }: { contracts: Contract[]; onEdit: (c: Contract) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {contracts.map((c) => (
      <div key={c.id} className="relative">
        <ContractCard contract={c} />
        <Button
          variant="ghost" size="sm"
          className="absolute top-3 right-3 h-9 w-9 p-0 bg-card/80 hover:bg-muted/40 rounded-lg"
          onClick={(e) => { e.stopPropagation(); onEdit(c); }}
          aria-label={`Edit contract ${c.contractCode}`}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    ))}
  </div>
);

/* ─── Table View ────────────────────────────────────────────────────────── */

interface ContractTableProps {
  contracts: Contract[];
  onNavigate: (id: string) => void;
  onEdit: (c: Contract) => void;
}

const ContractTable = ({ contracts, onNavigate, onEdit }: ContractTableProps) => (
  <div className="overflow-hidden rounded-xl border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Code</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Species</TableHead>
          <TableHead className="text-center">Qty Ordered</TableHead>
          <TableHead className="text-center">Delivered</TableHead>
          <TableHead className="text-right">Value</TableHead>
          <TableHead className="text-center">Progress</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Deadline</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((c) => (
          <ContractTableRow key={c.id} contract={c} onNavigate={onNavigate} onEdit={onEdit} />
        ))}
      </TableBody>
    </Table>
  </div>
);

const ContractTableRow = ({ contract: c, onNavigate, onEdit }: { contract: Contract; onNavigate: (id: string) => void; onEdit: (c: Contract) => void }) => (
  <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => onNavigate(c.id)}>
    <TableCell className="font-mono text-xs font-normal">{c.contractCode}</TableCell>
    <TableCell className="font-medium">{c.clientName}</TableCell>
    <TableCell className="text-muted-foreground">{c.commonName}</TableCell>
    <TableCell className="text-center font-medium tabular-nums">{c.quantityOrdered.toLocaleString()}</TableCell>
    <TableCell className="text-center font-medium tabular-nums">{c.quantityDelivered.toLocaleString()}</TableCell>
    <TableCell className="text-right font-medium tabular-nums">{formatCurrency(c.totalValue)}</TableCell>
    <TableCell className="text-center">
      <ProgressBar progress={c.progressPct} />
    </TableCell>
    <TableCell className="text-center">
      <span className={cn(statusBadge(contractStatusStyles, c.status, false))}>{c.status}</span>
    </TableCell>
    <TableCell className="text-sm">{c.deliveryDeadline}</TableCell>
    <TableCell onClick={(e) => e.stopPropagation()}>
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onEdit(c)} aria-label={`Edit contract ${c.contractCode}`}>
        <Pencil className="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
);

const ProgressBar = ({ progress }: { progress: number }) => {
  const barColor = progress >= 100 ? "bg-emerald-500" : progress >= 50 ? "bg-primary" : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full">
        <div className={cn("h-full", barColor)} style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
      <span className="text-xs font-medium tabular-nums w-8">{progress}%</span>
    </div>
  );
};

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const ContractFormDialog = ({ view }: { view: ReturnType<typeof useContractsView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Client *</Label>
            <Select value={view.form.clientId} onValueChange={(v) => view.updateFormField("clientId", v)}>
              <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
              <SelectContent>
                {view.availableClients.map((cl) => (
                  <SelectItem key={cl.id} value={cl.id}>{cl.companyName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Managed By *</Label>
            <Input placeholder="e.g. Dr. Sarah Chen" value={view.form.managedBy} onChange={(e) => view.updateFormField("managedBy", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Species Name *</Label>
            <Input placeholder="e.g. Solanum lycopersicum" value={view.form.speciesName} onChange={(e) => view.updateFormField("speciesName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Common Name *</Label>
            <Input placeholder="e.g. Tomato" value={view.form.commonName} onChange={(e) => view.updateFormField("commonName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Quantity Ordered *</Label>
            <Input type="number" placeholder="0" value={view.form.quantityOrdered || ""} onChange={(e) => view.updateFormField("quantityOrdered", parseInt(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>Unit Price (USD) *</Label>
            <Input type="number" step="0.01" placeholder="0.00" value={view.form.unitPrice || ""} onChange={(e) => view.updateFormField("unitPrice", parseFloat(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>Delivery Deadline *</Label>
            <Input type="date" value={view.form.deliveryDeadline} onChange={(e) => view.updateFormField("deliveryDeadline", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Total Value</Label>
            <Input type="text" disabled value={view.computedTotalValue} className="bg-muted" />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Payment Terms</Label>
            <Textarea placeholder="e.g. 40% deposit, 30% midpoint, 30% on delivery" value={view.form.terms} onChange={(e) => view.updateFormField("terms", e.target.value)} rows={2} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitContractForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Create Contract"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

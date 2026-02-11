/* ═══════════════════════════════════════════════════════════════════════════
 * Clients — Client relationships and contacts.
 *
 * All state lives in useClientsView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { Handshake, Plus, Mail, Phone, Building2, Pencil } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
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
import { cn } from "@/lib/utils";
import { clientTypeStyles, statusBadge } from "@/lib/status-styles";
import { formatCurrency } from "@/lib/calculator";

// ─── Hook & Types ──────────────────────────────────────────────────────────
import { useClientsView, type ClientForm } from "./useClientsView";
import type { Client, ClientType } from "@/types/business";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Clients = () => {
  const view = useClientsView();
  const hasResults = view.filteredClients.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={Handshake}
          title="Clients"
          description="Manage your client relationships and contacts"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> Add Client
            </Button>
          }
        />

        <SummaryStrip stats={view.summaryStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search clients..."
        >
          <TypeFilter value={view.typeFilter} onChange={view.updateTypeFilter} options={view.clientTypes} />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && <EmptyState icon={Handshake} title="No clients found" description="Try adjusting your search or add a new client." />}

        {hasResults && view.viewMode === "grid" && <ClientGrid clients={view.filteredClients} onEdit={view.openEditForm} />}
        {hasResults && view.viewMode === "list" && <ClientTable clients={view.filteredClients} onEdit={view.openEditForm} />}

        <p className="text-sm text-muted-foreground">Showing {view.filteredClients.length} of {view.totalCount} clients</p>
      </div>

      <ClientFormDialog view={view} />
    </AppLayout>
  );
};

export default Clients;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Summary Strip ─────────────────────────────────────────────────────── */

const SummaryStrip = ({ stats }: { stats: { label: string; value: string }[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {stats.map((stat) => (
      <div key={stat.label} className="bg-card border border-border/60 p-3 rounded-xl">
        <p className="text-xs font-normal text-muted-foreground/70">{stat.label}</p>
        <p className="text-xl font-medium text-foreground tabular-nums mt-0.5">{stat.value}</p>
      </div>
    ))}
  </div>
);

/* ─── Type Filter ───────────────────────────────────────────────────────── */

const TypeFilter = ({ value, onChange, options }: { value: string; onChange: (t: string) => void; options: ClientType[] }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Types" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Types</SelectItem>
      {options.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

const ClientGrid = ({ clients, onEdit }: { clients: Client[]; onEdit: (cl: Client) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {clients.map((cl) => <ClientCard key={cl.id} client={cl} onEdit={onEdit} />)}
  </div>
);

const ClientCard = ({ client: cl, onEdit }: { client: Client; onEdit: (cl: Client) => void }) => (
  <div className="bg-card border border-border/60 hover:bg-muted/30 transition-colors p-5 rounded-xl">
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className="font-medium text-foreground text-sm">{cl.companyName}</h3>
        <p className="text-xs text-muted-foreground/60">{cl.contactName}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={cn(statusBadge(clientTypeStyles, cl.clientType, false))}>{cl.clientType}</span>
        <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onEdit(cl)} aria-label={`Edit ${cl.companyName}`}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <ContactLines email={cl.email} phone={cl.phone} address={cl.address} />
    <div className="flex items-center justify-between pt-3 border-t border-border/40">
      <div className="text-xs">
        <span className="font-medium text-foreground tabular-nums">{cl.totalContracts}</span>
        <span className="text-muted-foreground ml-1">contracts</span>
      </div>
      <p className="text-sm font-medium text-primary tabular-nums">{formatCurrency(cl.totalValue)}</p>
    </div>
  </div>
);

const ContactLines = ({ email, phone, address }: { email: string; phone: string; address: string }) => (
  <div className="space-y-1.5 text-sm mb-4">
    <ContactLine icon={Mail} value={email} />
    <ContactLine icon={Phone} value={phone} />
    <ContactLine icon={Building2} value={address} />
  </div>
);

const ContactLine = ({ icon: Icon, value }: { icon: React.ElementType; value: string }) => (
  <div className="flex items-center gap-2">
    <Icon className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
    <span className="text-muted-foreground/70 truncate">{value}</span>
  </div>
);

/* ─── Table View ────────────────────────────────────────────────────────── */

const ClientTable = ({ clients, onEdit }: { clients: Client[]; onEdit: (cl: Client) => void }) => (
  <div className="bg-card overflow-x-auto rounded-xl border border-border/40">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border/40">
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">Company</th>
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">Contact</th>
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">Type</th>
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">Email</th>
          <th className="text-left p-3 text-xs font-normal text-muted-foreground/70">Phone</th>
          <th className="text-right p-3 text-xs font-normal text-muted-foreground/70">Contracts</th>
          <th className="text-right p-3 text-xs font-normal text-muted-foreground/70">Value</th>
          <th className="p-3 w-10"></th>
        </tr>
      </thead>
      <tbody>
        {clients.map((cl) => <ClientTableRow key={cl.id} client={cl} onEdit={onEdit} />)}
      </tbody>
    </table>
  </div>
);

const ClientTableRow = ({ client: cl, onEdit }: { client: Client; onEdit: (cl: Client) => void }) => (
  <tr className="border-b border-border/40 hover:bg-muted/20 transition-colors">
    <td className="p-3 text-sm font-medium text-foreground">{cl.companyName}</td>
    <td className="p-3 text-sm text-muted-foreground">{cl.contactName}</td>
    <td className="p-3"><span className={cn(statusBadge(clientTypeStyles, cl.clientType, false))}>{cl.clientType}</span></td>
    <td className="p-3 text-sm text-muted-foreground">{cl.email}</td>
    <td className="p-3 text-sm text-muted-foreground">{cl.phone}</td>
    <td className="p-3 text-sm font-medium text-foreground tabular-nums text-right">{cl.totalContracts}</td>
    <td className="p-3 text-sm font-medium text-primary tabular-nums text-right">{formatCurrency(cl.totalValue)}</td>
    <td className="p-3">
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onEdit(cl)} aria-label={`Edit ${cl.companyName}`}>
        <Pencil className="h-4 w-4" />
      </Button>
    </td>
  </tr>
);

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const ClientFormDialog = ({ view }: { view: ReturnType<typeof useClientsView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 col-span-2">
            <Label>Company Name *</Label>
            <Input placeholder="e.g. Green Valley Farms" value={view.form.companyName} onChange={(e) => view.updateFormField("companyName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Contact Name *</Label>
            <Input placeholder="e.g. John Smith" value={view.form.contactName} onChange={(e) => view.updateFormField("contactName", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Client Type</Label>
            <Select value={view.form.clientType} onValueChange={(v) => view.updateFormField("clientType", v as ClientType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {view.clientTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="email@example.com" value={view.form.email} onChange={(e) => view.updateFormField("email", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input placeholder="+1-555-0000" value={view.form.phone} onChange={(e) => view.updateFormField("phone", e.target.value)} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Address</Label>
            <Input placeholder="Full address" value={view.form.address} onChange={(e) => view.updateFormField("address", e.target.value)} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes..." value={view.form.notes} onChange={(e) => view.updateFormField("notes", e.target.value)} rows={2} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitClientForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Add Client"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

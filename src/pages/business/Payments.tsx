/* ═══════════════════════════════════════════════════════════════════════════
 * Payments — Track invoices, deposits, and payment statuses.
 *
 * All state lives in usePaymentsView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import {
  DollarSign, Plus, Pencil, CheckCircle2, Clock, AlertTriangle, ArrowUpDown,
} from "lucide-react";
import type { ReactNode } from "react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import SearchFilter from "@/components/shared/SearchFilter";
import StatCard from "@/components/dashboard/StatCard";
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
import { paymentStatusStyles, statusBadge } from "@/lib/status-styles";
import { formatCurrency } from "@/lib/calculator";

// ─── Hook & Types ──────────────────────────────────────────────────────────
import { usePaymentsView, type PaymentForm } from "./usePaymentsView";
import type { Payment, PaymentStatus, PaymentType } from "@/types/business";

// ─── Constants ─────────────────────────────────────────────────────────────

const PAYMENT_STATUS_ICONS: Record<string, ReactNode> = {
  Received: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  Pending: <Clock className="h-4 w-4 text-amber-500" />,
  Overdue: <AlertTriangle className="h-4 w-4 text-destructive" />,
  Cancelled: <Clock className="h-4 w-4 text-muted-foreground" />,
};

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Payments = () => {
  const view = usePaymentsView();
  const hasResults = view.filteredPayments.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={DollarSign}
          title="Payments"
          description="Track invoices, deposits, and payment statuses"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> Add Payment
            </Button>
          }
        />

        <KpiStats stats={view.kpiStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search payments..."
        >
          <PaymentStatusFilter value={view.statusFilter} onChange={view.updateStatusFilter} options={view.statusOptions} />
          <PaymentTypeFilter value={view.typeFilter} onChange={view.updateTypeFilter} options={view.typeOptions} />
        </SearchFilter>

        {!hasResults && <EmptyState icon={DollarSign} title="No payments found" description="Try adjusting your search or filters." />}

        {hasResults && <PaymentTable payments={view.filteredPayments} onEdit={view.openEditForm} />}

        <p className="text-sm text-muted-foreground">Showing {view.filteredPayments.length} of {view.totalCount} payments</p>
      </div>

      <PaymentFormDialog view={view} />
    </AppLayout>
  );
};

export default Payments;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── KPI Stats ─────────────────────────────────────────────────────────── */

const KpiStats = ({ stats }: { stats: ReturnType<typeof usePaymentsView>["kpiStats"] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <StatCard
      title="Total Received"
      value={stats.formatted.totalReceived}
      subtitle={`${stats.receivedCount} payments`}
      icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
    />
    <StatCard
      title="Total Pending"
      value={stats.formatted.totalPending}
      subtitle={`${stats.pendingCount} invoices`}
      icon={<Clock className="h-5 w-5 text-amber-500" />}
    />
    <StatCard
      title="Grand Total"
      value={stats.formatted.grandTotal}
      subtitle="All payments"
      icon={<DollarSign className="h-5 w-5 text-primary" />}
    />
    <StatCard
      title="Collection Rate"
      value={`${stats.collectionRate}%`}
      subtitle="Of total invoiced"
      icon={<ArrowUpDown className="h-5 w-5 text-primary" />}
    />
  </div>
);

/* ─── Filters ───────────────────────────────────────────────────────────── */

const PaymentStatusFilter = ({ value, onChange, options }: { value: string; onChange: (s: string) => void; options: PaymentStatus[] }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Statuses</SelectItem>
      {options.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
    </SelectContent>
  </Select>
);

const PaymentTypeFilter = ({ value, onChange, options }: { value: string; onChange: (t: string) => void; options: PaymentType[] }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Types" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Types</SelectItem>
      {options.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
    </SelectContent>
  </Select>
);

/* ─── Payment Table ─────────────────────────────────────────────────────── */

const PaymentTable = ({ payments, onEdit }: { payments: Payment[]; onEdit: (p: Payment) => void }) => (
  <div className="overflow-hidden rounded-xl border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"></TableHead>
          <TableHead>Contract</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Paid Date</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((pay) => <PaymentTableRow key={pay.id} payment={pay} onEdit={onEdit} />)}
      </TableBody>
    </Table>
  </div>
);

const PaymentTableRow = ({ payment: pay, onEdit }: { payment: Payment; onEdit: (p: Payment) => void }) => (
  <TableRow>
    <TableCell>{PAYMENT_STATUS_ICONS[pay.status]}</TableCell>
    <TableCell className="font-mono text-xs font-normal">{pay.contractCode}</TableCell>
    <TableCell className="font-medium">{pay.clientName}</TableCell>
    <TableCell>
      <span className="text-xs font-normal px-2 py-0.5 bg-muted/50 text-muted-foreground/70 rounded-lg">{pay.paymentType}</span>
    </TableCell>
    <TableCell className="text-right font-medium tabular-nums">{formatCurrency(pay.amount)}</TableCell>
    <TableCell className="text-sm text-muted-foreground">{pay.paymentMethod}</TableCell>
    <TableCell className="text-sm">{pay.dueDate}</TableCell>
    <TableCell className="text-sm">{pay.paymentDate || "—"}</TableCell>
    <TableCell className="text-center">
      <span className={cn(statusBadge(paymentStatusStyles, pay.status, false))}>{pay.status}</span>
    </TableCell>
    <TableCell className="font-mono text-xs text-muted-foreground">{pay.referenceNumber || "—"}</TableCell>
    <TableCell>
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={() => onEdit(pay)} aria-label="Edit payment">
        <Pencil className="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
);

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const PaymentFormDialog = ({ view }: { view: ReturnType<typeof usePaymentsView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Contract *</Label>
            <Select value={view.form.contractId} onValueChange={(v) => view.updateFormField("contractId", v)}>
              <SelectTrigger><SelectValue placeholder="Select contract" /></SelectTrigger>
              <SelectContent>
                {view.availableContracts.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.contractCode} - {c.clientName}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Amount (USD) *</Label>
            <Input type="number" step="0.01" placeholder="0.00" value={view.form.amount || ""} onChange={(e) => view.updateFormField("amount", parseFloat(e.target.value) || 0)} />
          </div>
          <div className="space-y-2">
            <Label>Payment Type *</Label>
            <Select value={view.form.paymentType} onValueChange={(v) => view.updateFormField("paymentType", v as PaymentType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {view.typeOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Payment Method *</Label>
            <Input placeholder="e.g. Bank Transfer" value={view.form.paymentMethod} onChange={(e) => view.updateFormField("paymentMethod", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Due Date *</Label>
            <Input type="date" value={view.form.dueDate} onChange={(e) => view.updateFormField("dueDate", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Input type="date" value={view.form.paymentDate} onChange={(e) => view.updateFormField("paymentDate", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Status *</Label>
            <Select value={view.form.status} onValueChange={(v) => view.updateFormField("status", v as PaymentStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {view.statusOptions.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Reference Number</Label>
            <Input placeholder="e.g. INV-2026-001" value={view.form.referenceNumber} onChange={(e) => view.updateFormField("referenceNumber", e.target.value)} />
          </div>
          <div className="space-y-2 col-span-2">
            <Label>Notes</Label>
            <Textarea placeholder="Additional notes..." value={view.form.notes} onChange={(e) => view.updateFormField("notes", e.target.value)} rows={2} />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitPaymentForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Add Payment"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

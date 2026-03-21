/* ═══════════════════════════════════════════════════════════════════════════
 * PaymentTable — Table view for payments.
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    Pencil,
    Trash2,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/shared/lib/calculator";
import { paymentStatusStyles, statusBadge } from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { PaymentApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";

// ─── Constants ─────────────────────────────────────────────────────────────

const PAYMENT_STATUS_ICONS: Record<string, ReactNode> = {
  received: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  overdue: <AlertTriangle className="h-4 w-4 text-destructive" />,
  cancelled: <Clock className="h-4 w-4 text-muted-foreground" />,
};

// ─── Props ─────────────────────────────────────────────────────────────────

interface PaymentTableProps {
  payments: PaymentApi[];
  onEdit: (p: PaymentApi) => void;
  onDelete: (p: PaymentApi) => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const PaymentTable = ({ payments, onEdit, onDelete }: PaymentTableProps) => (
  <div className="overflow-hidden rounded-xl border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"></TableHead>
          <TableHead>Contract</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Paid Date</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Reference</TableHead>
          <TableHead className="w-20"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((pay) => (
          <PaymentTableRow
            key={pay.id}
            payment={pay}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  </div>
);

const PaymentTableRow = ({
  payment: pay,
  onEdit,
  onDelete,
}: {
  payment: PaymentApi;
  onEdit: (p: PaymentApi) => void;
  onDelete: (p: PaymentApi) => void;
}) => (
  <TableRow>
    <TableCell>{PAYMENT_STATUS_ICONS[pay.status]}</TableCell>
    <TableCell className="font-mono text-xs font-normal">
      {pay.contract.contract_code}
    </TableCell>
    <TableCell className="font-medium">
      {pay.contract.client?.company_name || "—"}
    </TableCell>
    <TableCell>
      <span className="text-xs font-normal px-2 py-0.5 bg-muted/50 text-muted-foreground/70 rounded-lg">
        {formatEnumLabel(pay.payment_type)}
      </span>
    </TableCell>
    <TableCell className="text-right font-medium tabular-nums">
      {formatCurrency(pay.amount)}
    </TableCell>
    <TableCell className="text-sm">{pay.due_date || "—"}</TableCell>
    <TableCell className="text-sm">{pay.payment_date || "—"}</TableCell>
    <TableCell className="text-center">
      <span className={cn(statusBadge(paymentStatusStyles, pay.status, false))}>
        {formatEnumLabel(pay.status)}
      </span>
    </TableCell>
    <TableCell className="font-mono text-xs text-muted-foreground">
      {pay.reference_number || "—"}
    </TableCell>
    <TableCell>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0"
          onClick={() => onEdit(pay)}
          aria-label="Edit payment"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-9 p-0 text-destructive"
          onClick={() => onDelete(pay)}
          aria-label="Delete payment"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export default PaymentTable;

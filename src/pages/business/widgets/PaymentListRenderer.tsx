// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT LIST WIDGET
// Recent payments with status badges and amounts.
// ═══════════════════════════════════════════════════════════════════════════

import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/calculator";
import { paymentStatusStyles, statusBadge } from "@/lib/status-styles";
import type { PaymentListWidget } from "../types";

interface PaymentListRendererProps {
  config: PaymentListWidget;
}

const PaymentListRenderer = ({ config }: PaymentListRendererProps) => (
  <div className="bg-card border border-border shadow-sm p-5 rounded-xl">
    <h3 className="text-sm font-medium text-muted-foreground mb-4">
      {config.title}
    </h3>
    <div className="space-y-2">
      {config.payments.map((payment) => (
        <div
          key={payment.id}
          className="flex items-center justify-between p-2 bg-muted/30 rounded-lg"
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              {payment.contractId}
            </p>
            <p className="text-xs text-muted-foreground">
              {payment.paymentDate} · {payment.paymentMethod}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                statusBadge(paymentStatusStyles, payment.status)
              )}
            >
              {payment.status}
            </span>
            <p className="text-sm font-medium text-foreground tabular-nums">
              {formatCurrency(payment.amount)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PaymentListRenderer;

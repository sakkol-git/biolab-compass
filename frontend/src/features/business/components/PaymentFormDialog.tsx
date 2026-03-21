/* ═══════════════════════════════════════════════════════════════════════════
 * PaymentFormDialog — Create/Edit dialog for payments.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/shared/components/FormField";
import { formatEnumLabel } from "@/shared/types/enums";

import type { usePaymentsView } from "../pages/usePaymentsView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface PaymentFormDialogProps {
  view: ReturnType<typeof usePaymentsView>;
}

// ─── Component ─────────────────────────────────────────────────────────────

const PaymentFormDialog = ({ view }: PaymentFormDialogProps) => (
  <Dialog
    open={view.formOpen}
    onOpenChange={(open) => {
      if (!open) view.closeForm();
    }}
  >
    <DialogContent className="sm:max-w-2xl">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="pay-contract"
            label="Contract"
            required
            error={view.formErrors.contractId}
          >
            <Select
              value={view.form.contractId}
              onValueChange={(v) => view.updateFormField("contractId", v)}
            >
              <SelectTrigger id="pay-contract">
                <SelectValue placeholder="Select contract" />
              </SelectTrigger>
              <SelectContent>
                {view.availableContracts.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.contract_code} — {c.client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            id="pay-amount"
            label="Amount (USD)"
            required
            error={view.formErrors.amount}
          >
            <Input
              id="pay-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={view.form.amount}
              onChange={(e) => view.updateFormField("amount", e.target.value)}
            />
          </FormField>
          <FormField
            id="pay-type"
            label="Payment Type"
            required
            error={view.formErrors.paymentType}
          >
            <Select
              value={view.form.paymentType}
              onValueChange={(v) => view.updateFormField("paymentType", v)}
            >
              <SelectTrigger id="pay-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {view.typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {formatEnumLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            id="pay-status"
            label="Status"
            error={view.formErrors.status}
          >
            <Select
              value={view.form.status}
              onValueChange={(v) => view.updateFormField("status", v)}
            >
              <SelectTrigger id="pay-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {view.statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {formatEnumLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            id="pay-due"
            label="Due Date"
            required
            error={view.formErrors.dueDate}
          >
            <Input
              id="pay-due"
              type="date"
              value={view.form.dueDate}
              onChange={(e) => view.updateFormField("dueDate", e.target.value)}
            />
          </FormField>
          <FormField
            id="pay-paid"
            label="Payment Date"
            error={view.formErrors.paymentDate}
          >
            <Input
              id="pay-paid"
              type="date"
              value={view.form.paymentDate}
              onChange={(e) =>
                view.updateFormField("paymentDate", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="pay-ref"
            label="Reference Number"
            error={view.formErrors.referenceNumber}
          >
            <Input
              id="pay-ref"
              placeholder="e.g. INV-2026-001"
              value={view.form.referenceNumber}
              onChange={(e) =>
                view.updateFormField("referenceNumber", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="pay-notes"
            label="Notes"
            error={view.formErrors.notes}
            className="col-span-2"
          >
            <Textarea
              id="pay-notes"
              placeholder="Additional notes..."
              value={view.form.notes}
              onChange={(e) => view.updateFormField("notes", e.target.value)}
              rows={2}
            />
          </FormField>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button
          onClick={view.submitPaymentForm}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isEditing ? "Save Changes" : "Add Payment"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default PaymentFormDialog;

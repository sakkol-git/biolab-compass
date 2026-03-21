/* ═══════════════════════════════════════════════════════════════════════════
 * ContractFormDialog — Create/Edit dialog for contracts.
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

import type { useContractsView } from "../pages/useContractsView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ContractFormDialogProps {
  view: ReturnType<typeof useContractsView>;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ContractFormDialog = ({ view }: ContractFormDialogProps) => (
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
            id="client-id"
            label="Client"
            required
            error={view.formErrors.clientId}
          >
            <Select
              value={view.form.clientId}
              onValueChange={(v) => view.updateFormField("clientId", v)}
            >
              <SelectTrigger id="client-id">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {view.availableClients.map((cl) => (
                  <SelectItem key={cl.id} value={String(cl.id)}>
                    {cl.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            id="common-name"
            label="Common Name"
            required
            error={view.formErrors.commonName}
          >
            <Input
              id="common-name"
              placeholder="e.g. Tomato"
              value={view.form.commonName}
              onChange={(e) =>
                view.updateFormField("commonName", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="qty-ordered"
            label="Quantity Ordered"
            required
            error={view.formErrors.quantityOrdered}
          >
            <Input
              id="qty-ordered"
              type="number"
              placeholder="0"
              value={view.form.quantityOrdered}
              onChange={(e) =>
                view.updateFormField("quantityOrdered", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="unit-price"
            label="Unit Price (USD)"
            required
            error={view.formErrors.unitPrice}
          >
            <Input
              id="unit-price"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={view.form.unitPrice}
              onChange={(e) =>
                view.updateFormField("unitPrice", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="contract-date"
            label="Contract Date"
            error={view.formErrors.contractDate}
          >
            <Input
              id="contract-date"
              type="date"
              value={view.form.contractDate}
              onChange={(e) =>
                view.updateFormField("contractDate", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="delivery-deadline"
            label="Delivery Deadline"
            required
            error={view.formErrors.deliveryDeadline}
          >
            <Input
              id="delivery-deadline"
              type="date"
              value={view.form.deliveryDeadline}
              onChange={(e) =>
                view.updateFormField("deliveryDeadline", e.target.value)
              }
            />
          </FormField>
          <FormField id="total-value" label="Total Value">
            <Input
              id="total-value"
              type="text"
              disabled
              value={view.computedTotalValue}
              className="bg-muted"
            />
          </FormField>
          <FormField
            id="notes"
            label="Notes"
            error={view.formErrors.notes}
            className="col-span-2"
          >
            <Textarea
              id="notes"
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
          onClick={view.submitContractForm}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isEditing ? "Save Changes" : "Create Contract"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ContractFormDialog;

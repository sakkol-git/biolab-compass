/* ═══════════════════════════════════════════════════════════════════════════
 * ClientFormDialog — Create/Edit dialog for clients.
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
import { FormField } from "@/shared/components/FormField";
import { formatEnumLabel } from "@/shared/types/enums";

import type { useClientsView } from "../pages/useClientsView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ClientFormDialogProps {
  view: ReturnType<typeof useClientsView>;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ClientFormDialog = ({ view }: ClientFormDialogProps) => (
  <Dialog
    open={view.formOpen}
    onOpenChange={(open) => {
      if (!open) view.closeForm();
    }}
  >
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            id="company-name"
            label="Company Name"
            required
            error={view.formErrors.companyName}
            className="col-span-2"
          >
            <Input
              id="company-name"
              autoFocus
              placeholder="e.g. Green Valley Farms"
              value={view.form.companyName}
              onChange={(e) =>
                view.updateFormField("companyName", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="contact-name"
            label="Contact Name"
            required
            error={view.formErrors.contactName}
          >
            <Input
              id="contact-name"
              placeholder="e.g. John Smith"
              value={view.form.contactName}
              onChange={(e) =>
                view.updateFormField("contactName", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="client-type"
            label="Client Type"
            error={view.formErrors.clientType}
          >
            <Select
              value={view.form.clientType}
              onValueChange={(v) => view.updateFormField("clientType", v)}
            >
              <SelectTrigger id="client-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {view.clientTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {formatEnumLabel(t)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField id="email" label="Email" error={view.formErrors.email}>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={view.form.email}
              onChange={(e) => view.updateFormField("email", e.target.value)}
            />
          </FormField>
          <FormField id="phone" label="Phone" error={view.formErrors.phone}>
            <Input
              id="phone"
              placeholder="+1-555-0000"
              value={view.form.phone}
              onChange={(e) => view.updateFormField("phone", e.target.value)}
            />
          </FormField>
          <FormField
            id="address"
            label="Address"
            error={view.formErrors.address}
            className="col-span-2"
          >
            <Input
              id="address"
              placeholder="Full address"
              value={view.form.address}
              onChange={(e) => view.updateFormField("address", e.target.value)}
            />
          </FormField>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button
          onClick={view.submitClientForm}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isEditing ? "Save Changes" : "Add Client"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ClientFormDialog;

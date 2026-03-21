/* ═══════════════════════════════════════════════════════════════════════════
 * LabServiceFormDialog — Create/Edit dialog for lab services.
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

import type { useLabServicesView } from "../pages/useLabServicesView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface LabServiceFormDialogProps {
  view: ReturnType<typeof useLabServicesView>;
}

// ─── Component ─────────────────────────────────────────────────────────────

const LabServiceFormDialog = ({ view }: LabServiceFormDialogProps) => (
  <Dialog
    open={view.formOpen}
    onOpenChange={(open) => {
      if (!open) view.closeForm();
    }}
  >
    <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <FormField
          id="svc-title"
          label="Service Title"
          required
          error={view.formErrors.serviceTitle}
        >
          <Input
            id="svc-title"
            autoFocus
            value={view.form.serviceTitle}
            onChange={(e) =>
              view.updateFormField("serviceTitle", e.target.value)
            }
            placeholder="e.g. Rice Disease Analysis"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="svc-client"
            label="Client Name"
            required
            error={view.formErrors.clientName}
          >
            <Input
              id="svc-client"
              value={view.form.clientName}
              onChange={(e) =>
                view.updateFormField("clientName", e.target.value)
              }
              placeholder="Client name"
            />
          </FormField>
          <FormField
            id="svc-contact"
            label="Client Contact"
            error={view.formErrors.clientContact}
          >
            <Input
              id="svc-contact"
              value={view.form.clientContact}
              onChange={(e) =>
                view.updateFormField("clientContact", e.target.value)
              }
              placeholder="Phone or email"
            />
          </FormField>
        </div>
        <FormField
          id="svc-desc"
          label="Service Description"
          error={view.formErrors.serviceDescription}
        >
          <Textarea
            id="svc-desc"
            value={view.form.serviceDescription}
            onChange={(e) =>
              view.updateFormField("serviceDescription", e.target.value)
            }
            rows={3}
            placeholder="Describe what the client needs..."
          />
        </FormField>
        <FormField
          id="svc-staff"
          label="Assigned Staff"
          error={view.formErrors.assignedStaff}
        >
          <Input
            id="svc-staff"
            value={view.form.assignedStaff}
            onChange={(e) =>
              view.updateFormField("assignedStaff", e.target.value)
            }
            placeholder="Comma-separated names"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="svc-start"
            label="Start Date"
            error={view.formErrors.startDate}
          >
            <Input
              id="svc-start"
              type="date"
              value={view.form.startDate}
              onChange={(e) =>
                view.updateFormField("startDate", e.target.value)
              }
            />
          </FormField>
          <FormField
            id="svc-end"
            label="End Date"
            error={view.formErrors.endDate}
          >
            <Input
              id="svc-end"
              type="date"
              value={view.form.endDate}
              onChange={(e) => view.updateFormField("endDate", e.target.value)}
            />
          </FormField>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <FormField
            id="svc-status"
            label="Status"
            error={view.formErrors.status}
          >
            <Select
              value={view.form.status}
              onValueChange={(v) => view.updateFormField("status", v)}
            >
              <SelectTrigger id="svc-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(view.statusOptions as readonly string[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {formatEnumLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField
            id="svc-pay"
            label="Payment Status"
            error={view.formErrors.paymentStatus}
          >
            <Select
              value={view.form.paymentStatus}
              onValueChange={(v) => view.updateFormField("paymentStatus", v)}
            >
              <SelectTrigger id="svc-pay">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(view.paymentStatusOptions as readonly string[]).map((s) => (
                  <SelectItem key={s} value={s}>
                    {formatEnumLabel(s)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <FormField
          id="svc-fee"
          label="Service Fee ($)"
          error={view.formErrors.serviceFee}
        >
          <Input
            id="svc-fee"
            type="number"
            value={view.form.serviceFee}
            onChange={(e) => view.updateFormField("serviceFee", e.target.value)}
            placeholder="0.00"
          />
        </FormField>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button
          onClick={view.handleSave}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isEditing ? "Save Changes" : "Create"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default LabServiceFormDialog;

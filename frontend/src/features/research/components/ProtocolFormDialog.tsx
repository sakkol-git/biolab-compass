/* ═══════════════════════════════════════════════════════════════════════════
 * ProtocolFormDialog — Create / Edit dialog for protocols.
 *
 * Uses the shared FormField component (with `id` + `required` props).
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

import { useProtocolsView } from "../pages/useProtocolsView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ProtocolFormDialogProps {
  view: ReturnType<typeof useProtocolsView>;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ProtocolFormDialog = ({ view }: ProtocolFormDialogProps) => (
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
        {/* ── Title ─────────────────────────────────────────────── */}
        <FormField
          id="proto-title"
          label="Protocol Title"
          required
          error={view.formErrors.title}
        >
          <Input
            id="proto-title"
            placeholder="e.g. Tissue Culture Initiation SOP"
            value={view.form.title}
            onChange={(e) => view.updateFormField("title", e.target.value)}
          />
        </FormField>

        {/* ── Description ───────────────────────────────────────── */}
        <FormField
          id="proto-desc"
          label="Description"
          error={view.formErrors.description}
        >
          <Textarea
            id="proto-desc"
            placeholder="Brief description..."
            value={view.form.description}
            onChange={(e) =>
              view.updateFormField("description", e.target.value)
            }
            rows={3}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          {/* ── Category ──────────────────────────────────────────── */}
          <FormField
            id="proto-category"
            label="Category"
            required
            error={view.formErrors.category}
          >
            <Input
              id="proto-category"
              placeholder="e.g. Propagation"
              value={view.form.category}
              onChange={(e) => view.updateFormField("category", e.target.value)}
            />
          </FormField>

          {/* ── Status ────────────────────────────────────────────── */}
          <FormField
            id="proto-status"
            label="Status"
            error={view.formErrors.status}
          >
            <Select
              value={view.form.status}
              onValueChange={(v) => view.updateFormField("status", v)}
            >
              <SelectTrigger id="proto-status">
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

          {/* ── Version ───────────────────────────────────────────── */}
          <FormField
            id="proto-version"
            label="Version"
            error={view.formErrors.version}
          >
            <Input
              id="proto-version"
              placeholder="e.g. 1.0"
              value={view.form.version}
              onChange={(e) => view.updateFormField("version", e.target.value)}
            />
          </FormField>

          {/* ── Tags ──────────────────────────────────────────────── */}
          <FormField id="proto-tags" label="Tags" error={view.formErrors.tags}>
            <Input
              id="proto-tags"
              placeholder="e.g. propagation, tissue-culture"
              value={view.form.tags}
              onChange={(e) => view.updateFormField("tags", e.target.value)}
            />
          </FormField>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button
          onClick={view.submitProtocolForm}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isSubmitting
            ? "Saving…"
            : view.isEditing
              ? "Save Changes"
              : "Create Protocol"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ProtocolFormDialog;

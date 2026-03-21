/* ═══════════════════════════════════════════════════════════════════════════
 * NotebookFormDialog — Create / Edit dialog for lab notebook entries.
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

import { useLabNotebooksView } from "../pages/useLabNotebooksView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface NotebookFormDialogProps {
  view: ReturnType<typeof useLabNotebooksView>;
}

// ─── Component ─────────────────────────────────────────────────────────────

const NotebookFormDialog = ({ view }: NotebookFormDialogProps) => (
  <Dialog
    open={view.formOpen}
    onOpenChange={(open) => {
      if (!open) view.closeForm();
    }}
  >
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        {/* ── Title ─────────────────────────────────────────────── */}
        <FormField
          id="nb-title"
          label="Title"
          required
          error={view.formErrors.title}
        >
          <Input
            id="nb-title"
            placeholder="e.g. Grafting Observations — Week 3"
            value={view.form.title}
            onChange={(e) => view.updateFormField("title", e.target.value)}
          />
        </FormField>

        {/* ── Content ───────────────────────────────────────────── */}
        <FormField
          id="nb-content"
          label="Content"
          required
          error={view.formErrors.content}
        >
          <Textarea
            id="nb-content"
            placeholder="Detailed observations, procedures, measurements…"
            value={view.form.content}
            onChange={(e) => view.updateFormField("content", e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
        </FormField>

        {/* ── Experiment link ───────────────────────────────────── */}
        <FormField
          id="nb-experiment"
          label="Link to Experiment"
          error={view.formErrors.experimentId}
        >
          <Select
            value={view.form.experimentId}
            onValueChange={(v) =>
              view.updateFormField("experimentId", v === "none" ? "" : v)
            }
          >
            <SelectTrigger id="nb-experiment">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {view.availableExperiments.map((exp) => (
                <SelectItem key={exp.id} value={String(exp.id)}>
                  {exp.experiment_code} — {exp.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        {/* ── Tags ──────────────────────────────────────────────── */}
        <FormField
          id="nb-tags"
          label="Tags"
          hint="Comma-separated"
          error={view.formErrors.tags}
        >
          <Input
            id="nb-tags"
            placeholder="e.g. observations, week-3, grafting"
            value={view.form.tags}
            onChange={(e) => view.updateFormField("tags", e.target.value)}
          />
        </FormField>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>
          Cancel
        </Button>
        <Button
          onClick={view.submitNotebookForm}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isSubmitting
            ? "Saving…"
            : view.isEditing
              ? "Save Changes"
              : "Create Entry"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default NotebookFormDialog;

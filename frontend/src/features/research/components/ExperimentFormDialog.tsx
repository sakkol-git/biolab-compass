/* ═══════════════════════════════════════════════════════════════════════════
 * ExperimentFormDialog — Create / Edit dialog for experiments.
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

import {
    PROPAGATION_METHODS,
    useExperimentsView,
} from "../pages/useExperimentsView";

// ─── Props ─────────────────────────────────────────────────────────────────

interface ExperimentFormDialogProps {
  view: ReturnType<typeof useExperimentsView>;
}

// ─── Component ─────────────────────────────────────────────────────────────

const ExperimentFormDialog = ({ view }: ExperimentFormDialogProps) => (
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
        <div className="grid grid-cols-2 gap-4">
          {/* ── Title ─────────────────────────────────────────────── */}
          <FormField
            id="exp-title"
            label="Experiment Title"
            required
            error={view.formErrors.title}
            className="col-span-2"
          >
            <Input
              id="exp-title"
              placeholder="e.g. Tomato Grafting Trial A"
              value={view.form.title}
              onChange={(e) => view.updateFormField("title", e.target.value)}
            />
          </FormField>

          {/* ── Plant Species ID ──────────────────────────────────── */}
          <FormField
            id="exp-species"
            label="Plant Species ID"
            required
            error={view.formErrors.plantSpeciesId}
          >
            <Input
              id="exp-species"
              type="number"
              min="1"
              placeholder="e.g. 1"
              value={view.form.plantSpeciesId}
              onChange={(e) =>
                view.updateFormField("plantSpeciesId", e.target.value)
              }
            />
          </FormField>

          {/* ── Propagation Method ────────────────────────────────── */}
          <FormField
            id="exp-method"
            label="Propagation Method"
            required
            error={view.formErrors.propagationMethod}
          >
            <Select
              value={view.form.propagationMethod}
              onValueChange={(v) =>
                view.updateFormField("propagationMethod", v)
              }
            >
              <SelectTrigger id="exp-method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROPAGATION_METHODS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {formatEnumLabel(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* ── Objective ─────────────────────────────────────────── */}
          <FormField
            id="exp-objective"
            label="Objective"
            error={view.formErrors.objective}
            className="col-span-2"
          >
            <Textarea
              id="exp-objective"
              placeholder="Research objective..."
              value={view.form.objective}
              onChange={(e) =>
                view.updateFormField("objective", e.target.value)
              }
              rows={2}
            />
          </FormField>

          {/* ── Growth Medium ─────────────────────────────────────── */}
          <FormField
            id="exp-medium"
            label="Growth Medium"
            error={view.formErrors.growthMedium}
          >
            <Input
              id="exp-medium"
              placeholder="e.g. Rockwool cubes"
              value={view.form.growthMedium}
              onChange={(e) =>
                view.updateFormField("growthMedium", e.target.value)
              }
            />
          </FormField>

          {/* ── Environment ───────────────────────────────────────── */}
          <FormField
            id="exp-environment"
            label="Environment"
            error={view.formErrors.environment}
          >
            <Input
              id="exp-environment"
              placeholder="e.g. Greenhouse A"
              value={view.form.environment}
              onChange={(e) =>
                view.updateFormField("environment", e.target.value)
              }
            />
          </FormField>

          {/* ── Initial Seed Count ────────────────────────────────── */}
          <FormField
            id="exp-seed-count"
            label="Initial Seed Count"
            required
            error={view.formErrors.initialSeedCount}
          >
            <Input
              id="exp-seed-count"
              type="number"
              min="1"
              placeholder="e.g. 200"
              value={view.form.initialSeedCount}
              onChange={(e) =>
                view.updateFormField("initialSeedCount", e.target.value)
              }
            />
          </FormField>

          {/* ── Start Date ────────────────────────────────────────── */}
          <FormField
            id="exp-start"
            label="Start Date"
            required
            error={view.formErrors.startDate}
          >
            <Input
              id="exp-start"
              type="date"
              value={view.form.startDate}
              onChange={(e) =>
                view.updateFormField("startDate", e.target.value)
              }
            />
          </FormField>

          {/* ── Expected End Date ──────────────────────────────────── */}
          <FormField
            id="exp-end"
            label="Expected End Date"
            error={view.formErrors.expectedEndDate}
          >
            <Input
              id="exp-end"
              type="date"
              value={view.form.expectedEndDate}
              onChange={(e) =>
                view.updateFormField("expectedEndDate", e.target.value)
              }
            />
          </FormField>

          {/* ── Tags ──────────────────────────────────────────────── */}
          <FormField
            id="exp-tags"
            label="Tags"
            hint="Comma-separated"
            error={view.formErrors.tags}
          >
            <Input
              id="exp-tags"
              placeholder="grafting, high-yield"
              value={view.form.tags}
              onChange={(e) => view.updateFormField("tags", e.target.value)}
            />
          </FormField>

          {/* ── Notes ─────────────────────────────────────────────── */}
          <FormField
            id="exp-notes"
            label="Notes"
            error={view.formErrors.notes}
            className="col-span-2"
          >
            <Textarea
              id="exp-notes"
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
          onClick={view.submitExperimentForm}
          disabled={!view.canSubmitForm || view.isSubmitting}
        >
          {view.isSubmitting
            ? "Saving…"
            : view.isEditing
              ? "Save Changes"
              : "Create Experiment"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ExperimentFormDialog;

// ═══════════════════════════════════════════════════════════════════════════
// GROWTH LOG FORM — Section Renderer (Modal Dialog)
// ═══════════════════════════════════════════════════════════════════════════

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import GrowthLogForm from "@/features/research/components/GrowthLogForm";
import type { GrowthLogFormSection } from "../types";

interface Props {
  section: GrowthLogFormSection;
}

const GrowthLogFormRenderer = ({ section }: Props) => (
  <Dialog
    open={section.showForm}
    onOpenChange={(open) => !open && section.onCancel()}
  >
    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <section.icon className="h-5 w-5" />
          {section.title}
        </DialogTitle>
        <DialogDescription>
          Record growth log data for this experiment.
        </DialogDescription>
      </DialogHeader>
      <GrowthLogForm
        experimentId={section.experimentId}
        nextWeekNumber={section.nextWeekNumber}
        onSubmit={section.onSubmit}
        onCancel={section.onCancel}
        editingLog={section.editingLog}
      />
    </DialogContent>
  </Dialog>
);

export default GrowthLogFormRenderer;

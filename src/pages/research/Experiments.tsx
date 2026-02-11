/* ═══════════════════════════════════════════════════════════════════════════
 * Experiments — Seedling propagation experiments and growth data.
 *
 * All state lives in useExperimentsView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { TestTubes, Plus, Pencil } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import { QuickStats } from "@/components/shared/QuickStats";
import SearchFilter from "@/components/shared/SearchFilter";
import { ViewToggle } from "@/components/shared/ViewToggle";
import ExperimentCard from "@/components/research/ExperimentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { experimentStatusStyles, statusBadge } from "@/lib/status-styles";

// ─── Hook & Types ──────────────────────────────────────────────────────────
import { useExperimentsView, type ExperimentForm } from "./useExperimentsView";
import type { Experiment, PropagationMethod } from "@/types/research";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Experiments = () => {
  const view = useExperimentsView();
  const hasResults = view.filteredExperiments.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={TestTubes}
          title="Experiments"
          description="Track seedling propagation experiments and growth data"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> New Experiment
            </Button>
          }
        />

        <QuickStats stats={view.quickStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search experiments..."
        >
          <StatusFilter
            value={view.statusFilter}
            onChange={view.updateStatusFilter}
            options={view.statusOptions}
          />
          <ViewToggle current={view.viewMode} onChange={view.switchViewMode} />
        </SearchFilter>

        {!hasResults && (
          <EmptyState icon={TestTubes} title="No experiments found" description="Try adjusting your search or filter." />
        )}

        {hasResults && view.viewMode === "grid" && (
          <ExperimentGrid experiments={view.filteredExperiments} onEdit={view.openEditForm} />
        )}

        {hasResults && view.viewMode === "list" && (
          <ExperimentTable
            experiments={view.filteredExperiments}
            onNavigate={view.navigateToDetail}
            onEdit={view.openEditForm}
          />
        )}

        <p className="text-sm text-muted-foreground">
          Showing {view.filteredExperiments.length} of {view.totalCount} experiments
        </p>
      </div>

      <ExperimentFormDialog view={view} />
    </AppLayout>
  );
};

export default Experiments;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Status Filter ─────────────────────────────────────────────────────── */

const StatusFilter = ({ value, onChange, options }: { value: string; onChange: (s: string) => void; options: string[] }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-44">
      <SelectValue placeholder="All Statuses" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Statuses</SelectItem>
      {options.map((s) => (
        <SelectItem key={s} value={s}>{s}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

/* ─── Grid View ─────────────────────────────────────────────────────────── */

const ExperimentGrid = ({ experiments, onEdit }: { experiments: Experiment[]; onEdit: (exp: Experiment) => void }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {experiments.map((exp) => (
      <ExperimentCard key={exp.id} experiment={exp} onEdit={onEdit} />
    ))}
  </div>
);

/* ─── Table View ────────────────────────────────────────────────────────── */

interface ExperimentTableProps {
  experiments: Experiment[];
  onNavigate: (id: string) => void;
  onEdit: (exp: Experiment) => void;
}

const ExperimentTable = ({ experiments, onNavigate, onEdit }: ExperimentTableProps) => (
  <div className="rounded-lg overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Code</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Species</TableHead>
          <TableHead className="text-center">Method</TableHead>
          <TableHead className="text-center">Initial</TableHead>
          <TableHead className="text-center">Current</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {experiments.map((exp) => (
          <ExperimentTableRow key={exp.id} experiment={exp} onNavigate={onNavigate} onEdit={onEdit} />
        ))}
      </TableBody>
    </Table>
  </div>
);

const ExperimentTableRow = ({ experiment: exp, onNavigate, onEdit }: { experiment: Experiment; onNavigate: (id: string) => void; onEdit: (exp: Experiment) => void }) => (
  <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => onNavigate(exp.id)}>
    <TableCell className="font-mono text-xs text-muted-foreground/70">{exp.experimentCode}</TableCell>
    <TableCell className="font-medium max-w-[200px] truncate">{exp.title}</TableCell>
    <TableCell className="text-muted-foreground">{exp.commonName}</TableCell>
    <TableCell className="text-center text-xs">{exp.propagationMethod}</TableCell>
    <TableCell className="text-center font-medium tabular-nums">{exp.initialSeedCount}</TableCell>
    <TableCell className="text-center font-medium tabular-nums">{exp.currentCount.toLocaleString()}</TableCell>
    <TableCell className="text-center">
      <span className={cn(statusBadge(experimentStatusStyles, exp.status, false))}>{exp.status}</span>
    </TableCell>
    <TableCell className="text-sm">{exp.startDate}</TableCell>
    <TableCell className="text-right">
      <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={(e) => { e.stopPropagation(); onEdit(exp); }} aria-label={`Edit ${exp.title}`}>
        <Pencil className="h-4 w-4" />
      </Button>
    </TableCell>
  </TableRow>
);

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const ExperimentFormDialog = ({ view }: { view: ReturnType<typeof useExperimentsView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <TitleField form={view.form} updateField={view.updateFormField} />
          <SpeciesFields form={view.form} updateField={view.updateFormField} />
          <ObjectiveField form={view.form} updateField={view.updateFormField} />
          <MethodAndMediumFields form={view.form} updateField={view.updateFormField} propagationMethods={view.propagationMethods} />
          <EnvironmentAndCountFields form={view.form} updateField={view.updateFormField} />
          <DateFields form={view.form} updateField={view.updateFormField} />
          <MetaFields form={view.form} updateField={view.updateFormField} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitExperimentForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Create Experiment"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

/* ─── Form Sections ─────────────────────────────────────────────────────── */

type FieldProps = {
  form: ExperimentForm;
  updateField: <K extends keyof ExperimentForm>(field: K, value: ExperimentForm[K]) => void;
};

const TitleField = ({ form, updateField }: FieldProps) => (
  <div className="space-y-2 col-span-2">
    <Label>Experiment Title *</Label>
    <Input placeholder="e.g. Tomato Grafting Trial A" value={form.title} onChange={(e) => updateField("title", e.target.value)} />
  </div>
);

const SpeciesFields = ({ form, updateField }: FieldProps) => (
  <>
    <div className="space-y-2">
      <Label>Species (Scientific) *</Label>
      <Input placeholder="e.g. Solanum lycopersicum" value={form.speciesName} onChange={(e) => updateField("speciesName", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>Common Name *</Label>
      <Input placeholder="e.g. Tomato" value={form.commonName} onChange={(e) => updateField("commonName", e.target.value)} />
    </div>
  </>
);

const ObjectiveField = ({ form, updateField }: FieldProps) => (
  <div className="space-y-2 col-span-2">
    <Label>Objective</Label>
    <Textarea placeholder="Research objective..." value={form.objective} onChange={(e) => updateField("objective", e.target.value)} rows={2} />
  </div>
);

const MethodAndMediumFields = ({ form, updateField, propagationMethods }: FieldProps & { propagationMethods: PropagationMethod[] }) => (
  <>
    <div className="space-y-2">
      <Label>Propagation Method *</Label>
      <Select value={form.propagationMethod} onValueChange={(v) => updateField("propagationMethod", v as PropagationMethod)}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {propagationMethods.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
      <Label>Growth Medium</Label>
      <Input placeholder="e.g. Rockwool cubes" value={form.growthMedium} onChange={(e) => updateField("growthMedium", e.target.value)} />
    </div>
  </>
);

const EnvironmentAndCountFields = ({ form, updateField }: FieldProps) => (
  <>
    <div className="space-y-2">
      <Label>Environment</Label>
      <Input placeholder="e.g. Greenhouse A" value={form.environment} onChange={(e) => updateField("environment", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>Initial Seed Count *</Label>
      <Input type="number" min="1" placeholder="e.g. 200" value={form.initialSeedCount} onChange={(e) => updateField("initialSeedCount", e.target.value)} />
    </div>
  </>
);

const DateFields = ({ form, updateField }: FieldProps) => (
  <>
    <div className="space-y-2">
      <Label>Start Date *</Label>
      <Input type="date" value={form.startDate} onChange={(e) => updateField("startDate", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>Expected End Date</Label>
      <Input type="date" value={form.expectedEndDate} onChange={(e) => updateField("expectedEndDate", e.target.value)} />
    </div>
  </>
);

const MetaFields = ({ form, updateField }: FieldProps) => (
  <>
    <div className="space-y-2">
      <Label>Assigned To (comma-separated)</Label>
      <Input placeholder="Dr. Sarah Chen, James Wong" value={form.assignedTo} onChange={(e) => updateField("assignedTo", e.target.value)} />
    </div>
    <div className="space-y-2">
      <Label>Tags (comma-separated)</Label>
      <Input placeholder="grafting, high-yield" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} />
    </div>
  </>
);

/* ═══════════════════════════════════════════════════════════════════════════
 * LabNotebooks — Digital lab notebook entries.
 *
 * All state lives in useLabNotebooksView().
 * This file is pure declarative JSX — no useState, no business logic.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import {
  FileText, Plus, Calendar, User, Lock, Clock, Pencil, FlaskConical,
} from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import EmptyState from "@/components/EmptyState";
import PageHeader from "@/components/shared/PageHeader";
import SearchFilter from "@/components/shared/SearchFilter";
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
import { cn } from "@/lib/utils";

// ─── Hook & Types ──────────────────────────────────────────────────────────
import {
  useLabNotebooksView,
  type NotebookEntry,
  type NotebookForm,
} from "./useLabNotebooksView";

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const LabNotebooks = () => {
  const view = useLabNotebooksView();
  const hasResults = view.filteredEntries.length > 0;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={FileText}
          title="Lab Notebooks"
          description="Digital lab notebook entries, observations, and experimental notes"
          actions={
            <Button className="gap-2" onClick={view.openCreateForm}>
              <Plus className="h-4 w-4" /> New Entry
            </Button>
          }
        />

        <SummaryStrip stats={view.summaryStats} />

        <SearchFilter
          query={view.searchQuery}
          onQueryChange={view.updateSearchQuery}
          placeholder="Search entries by title, content, author, or tags..."
        />

        {!hasResults && <EmptyState icon={FileText} title="No entries found" description="Try adjusting your search or create a new notebook entry." />}

        {hasResults && (
          <div className="space-y-4">
            {view.filteredEntries.map((nb) => (
              <NotebookCard
                key={nb.id}
                entry={nb}
                isExpanded={view.isExpanded(nb.id)}
                onToggle={() => view.toggleExpansion(nb.id)}
                onEdit={() => view.openEditForm(nb)}
                onToggleLock={() => view.toggleLock(nb)}
              />
            ))}
          </div>
        )}

        <p className="text-sm text-muted-foreground">Showing {view.filteredEntries.length} of {view.totalCount} entries</p>
      </div>

      <NotebookFormDialog view={view} />
    </AppLayout>
  );
};

export default LabNotebooks;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Summary Strip ─────────────────────────────────────────────────────── */

const SummaryStrip = ({ stats }: { stats: { label: string; value: number }[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {stats.map((stat) => (
      <div key={stat.label} className="bg-card rounded-xl p-3 border border-border/60">
        <p className="text-xs font-normal text-muted-foreground/70">{stat.label}</p>
        <p className="text-xl font-medium text-foreground tabular-nums mt-0.5">{stat.value}</p>
      </div>
    ))}
  </div>
);

/* ─── Notebook Card (expandable) ────────────────────────────────────────── */

interface NotebookCardProps {
  entry: NotebookEntry;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onToggleLock: () => void;
}

const NotebookCard = ({ entry, isExpanded, onToggle, onEdit, onToggleLock }: NotebookCardProps) => (
  <div className={cn("bg-card rounded-xl transition-colors border border-border/60", isExpanded && "bg-muted/10")}>
    {/* ── Header ── */}
    <div
      className="p-5 cursor-pointer hover:bg-muted/20 transition-colors"
      onClick={onToggle}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Toggle entry: ${entry.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs font-normal text-muted-foreground/70">{entry.id}</span>
            {entry.isLocked && <Lock className="h-3 w-3 text-muted-foreground" />}
            {entry.experimentCode && (
              <span className="text-xs font-normal px-2 py-0.5 bg-muted/50 text-muted-foreground/70 border border-border/40 rounded-lg">
                <FlaskConical className="h-3 w-3 inline mr-1" />{entry.experimentCode}
              </span>
            )}
          </div>
          <h3 className="font-medium text-foreground text-sm leading-tight">{entry.title}</h3>
          {!isExpanded && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.content}</p>}
        </div>
        <div className="text-right shrink-0">
          <AuthorLine author={entry.author} />
          <DateLine date={entry.createdAt} />
        </div>
      </div>
    </div>

    {/* ── Expanded Content ── */}
    {isExpanded && (
      <div className="px-5 pb-5 pt-0 space-y-4 border-t border-border/40 animate-fade-in">
        <div className="bg-muted/30 rounded-lg p-4 mt-4">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{entry.content}</p>
        </div>
        <div className="flex items-center justify-between">
          <TagList tags={entry.tags} />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> Updated: {entry.updatedAt}
            </div>
            <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs" onClick={onToggleLock}>
              <Lock className="h-3 w-3" /> {entry.isLocked ? "Unlock" : "Lock"}
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0" onClick={onEdit} disabled={entry.isLocked} aria-label={`Edit ${entry.title}`}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
);

const AuthorLine = ({ author }: { author: string }) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <User className="h-3 w-3 text-muted-foreground/50" /> <span>{author}</span>
  </div>
);

const DateLine = ({ date }: { date: string }) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
    <Calendar className="h-3 w-3 text-muted-foreground/50" /> <span>{date}</span>
  </div>
);

const TagList = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span key={tag} className="text-xs font-normal px-2 py-1 bg-muted/50 text-muted-foreground/70 rounded-lg">{tag}</span>
    ))}
  </div>
);

/* ─── Form Dialog ───────────────────────────────────────────────────────── */

const NotebookFormDialog = ({ view }: { view: ReturnType<typeof useLabNotebooksView> }) => (
  <Dialog open={view.formOpen} onOpenChange={(open) => { if (!open) view.closeForm(); }}>
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{view.formTitle}</DialogTitle>
        <DialogDescription>{view.formDescription}</DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Title *</Label>
          <Input placeholder="e.g. Grafting Observations — Week 3" value={view.form.title} onChange={(e) => view.updateFormField("title", e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Content *</Label>
          <Textarea placeholder="Detailed observations, procedures, measurements..." value={view.form.content} onChange={(e) => view.updateFormField("content", e.target.value)} rows={8} className="font-mono text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Author *</Label>
            <Input placeholder="e.g. Dr. Sarah Chen" value={view.form.author} onChange={(e) => view.updateFormField("author", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Link to Experiment</Label>
            <Select value={view.form.experimentId} onValueChange={(v) => view.updateFormField("experimentId", v)}>
              <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {view.availableExperiments.map((exp) => (
                  <SelectItem key={exp.id} value={exp.id}>{exp.experimentCode} — {exp.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Tags (comma-separated)</Label>
          <Input placeholder="e.g. observations, week-3, grafting" value={view.form.tags} onChange={(e) => view.updateFormField("tags", e.target.value)} />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={view.closeForm}>Cancel</Button>
        <Button onClick={view.submitNotebookForm} disabled={!view.canSubmitForm}>
          {view.isEditing ? "Save Changes" : "Create Entry"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

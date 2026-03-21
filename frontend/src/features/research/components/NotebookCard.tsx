/* ═══════════════════════════════════════════════════════════════════════════
 * NotebookCard — Expandable card for lab notebook entries.
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
  Calendar,
  Clock,
  FlaskConical,
  Lock,
  Pencil,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/lib/utils";
import type { LabNotebookApi } from "@/shared/types";

// ─── Props ─────────────────────────────────────────────────────────────────

export interface NotebookCardProps {
  entry: LabNotebookApi;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onToggleLock: () => void;
  onDelete: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

const NotebookCard = ({
  entry,
  isExpanded,
  onToggle,
  onEdit,
  onToggleLock,
  onDelete,
}: NotebookCardProps) => (
  <div
    className={cn(
      "bg-card rounded-xl transition-colors border border-border/60",
      isExpanded && "bg-muted/10",
    )}
  >
    {/* ── Header ── */}
    <div
      className="p-5 cursor-pointer hover:bg-muted/20 transition-colors"
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Toggle entry: ${entry.title}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-mono text-xs font-normal text-muted-foreground/70">
              {entry.notebook_code}
            </span>
            {entry.is_locked && (
              <Lock className="h-3 w-3 text-muted-foreground" />
            )}
            {entry.experiment && (
              <span className="text-xs font-normal px-2 py-0.5 bg-muted/50 text-muted-foreground/70 border border-border/40 rounded-lg">
                <FlaskConical className="h-3 w-3 inline mr-1" />
                {entry.experiment.code}
              </span>
            )}
          </div>
          <h3 className="font-medium text-foreground text-sm leading-tight">
            {entry.title}
          </h3>
          {!isExpanded && entry.content && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {entry.content}
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <AuthorLine author={entry.user?.name ?? "—"} />
          <DateLine date={entry.created_at} />
        </div>
      </div>
    </div>

    {/* ── Expanded Content ── */}
    {isExpanded && (
      <div className="px-5 pb-5 pt-0 space-y-4 border-t border-border/40 animate-fade-in">
        {entry.content && (
          <div className="bg-muted/30 rounded-lg p-4 mt-4">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <TagList tags={entry.tags} />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> Updated: {entry.updated_at}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 gap-1 text-xs"
              onClick={onToggleLock}
            >
              <Lock className="h-3 w-3" /> {entry.is_locked ? "Unlock" : "Lock"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0"
              onClick={onEdit}
              disabled={entry.is_locked}
              aria-label={`Edit ${entry.title}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-9 p-0 text-destructive hover:text-destructive"
              onClick={onDelete}
              aria-label={`Delete ${entry.title}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default NotebookCard;

// ─── Sub-components ────────────────────────────────────────────────────────

const AuthorLine = ({ author }: { author: string }) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    <User className="h-3 w-3 text-muted-foreground/50" /> <span>{author}</span>
  </div>
);

const DateLine = ({ date }: { date: string }) => (
  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
    <Calendar className="h-3 w-3 text-muted-foreground/50" />{" "}
    <span>{date}</span>
  </div>
);

const TagList = ({
  tags,
}: {
  tags: Array<{ id: number; name: string; slug: string }>;
}) => (
  <div className="flex flex-wrap gap-2">
    {tags.map((tag) => (
      <span
        key={tag.id}
        className="text-xs font-normal px-2 py-1 bg-muted/50 text-muted-foreground/70 rounded-lg"
      >
        {tag.name}
      </span>
    ))}
  </div>
);

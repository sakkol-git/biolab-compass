/**
 * ViewToggle — Eliminates the repeated grid/list toggle pattern
 * that appears in 8+ inventory & research pages.
 */

import { Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "grid" | "list";

interface ViewToggleProps {
  current: ViewMode;
  onChange: (mode: ViewMode) => void;
}

const ViewToggle = ({ current, onChange }: ViewToggleProps) => (
  <div className="flex gap-1 rounded-lg p-1">
    <Button
      variant={current === "grid" ? "default" : "ghost"}
      size="sm"
      onClick={() => onChange("grid")}
      className="gap-2"
      aria-label="Grid view"
    >
      <Grid3x3 className="h-4 w-4" />
      Grid
    </Button>
    <Button
      variant={current === "list" ? "default" : "ghost"}
      size="sm"
      onClick={() => onChange("list")}
      className="gap-2"
      aria-label="List view"
    >
      <List className="h-4 w-4" />
      List
    </Button>
  </div>
);

export { ViewToggle, type ViewMode };

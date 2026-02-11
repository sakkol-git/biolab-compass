// ═══════════════════════════════════════════════════════════════════════════
// TAGS — Section Renderer
// ═══════════════════════════════════════════════════════════════════════════

import { SectionCard } from "@/components/detail/DetailPageShell";
import type { TagsSection } from "../types";

interface Props {
  section: TagsSection;
}

const TagsRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    <div className="flex flex-wrap gap-2">
      {section.tags.map((tag) => (
        <span
          key={tag}
          className="text-xs font-medium px-2.5 py-1 bg-muted text-muted-foreground rounded-lg"
        >
          {tag}
        </span>
      ))}
    </div>
  </SectionCard>
);

export default TagsRenderer;

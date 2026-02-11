// ═══════════════════════════════════════════════════════════════════════════
// TEAM — Section Renderer
// ═══════════════════════════════════════════════════════════════════════════

import { SectionCard } from "@/components/detail/DetailPageShell";
import type { TeamSection } from "../types";

interface Props {
  section: TeamSection;
}

const TeamRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    <div className="space-y-2">
      {section.members.map((member) => (
        <div
          key={member.name}
          className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg text-sm"
        >
          <div className="w-7 h-7 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-primary">
              {member.initial}
            </span>
          </div>
          <span className="font-medium text-foreground">{member.name}</span>
        </div>
      ))}
    </div>
  </SectionCard>
);

export default TeamRenderer;

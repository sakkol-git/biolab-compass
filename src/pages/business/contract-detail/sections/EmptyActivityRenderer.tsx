import { Receipt } from "lucide-react";
import { SectionCard } from "@/components/detail/DetailPageShell";
import type { EmptyActivitySection } from "../types";

interface Props {
  section: EmptyActivitySection;
}

const EmptyActivityRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-lg">
      <Receipt className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-sm font-medium text-muted-foreground">
        No milestones or payments recorded yet
      </p>
    </div>
  </SectionCard>
);

export default EmptyActivityRenderer;

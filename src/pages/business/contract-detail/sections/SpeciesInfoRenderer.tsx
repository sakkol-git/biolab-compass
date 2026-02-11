import { SectionCard, InfoRow } from "@/components/detail/DetailPageShell";
import type { SpeciesInfoSection } from "../types";

interface Props {
  section: SpeciesInfoSection;
}

const SpeciesInfoRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    <div className="space-y-4">
      {section.fields.map((f) => (
        <InfoRow key={f.label} label={f.label} value={f.value} mono={f.mono} />
      ))}
    </div>
  </SectionCard>
);

export default SpeciesInfoRenderer;

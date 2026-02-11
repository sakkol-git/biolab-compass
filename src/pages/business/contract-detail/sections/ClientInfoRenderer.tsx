import { SectionCard, InfoRow } from "@/components/detail/DetailPageShell";
import type { ClientInfoSection } from "../types";

interface Props {
  section: ClientInfoSection;
}

const ClientInfoRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    <div className="space-y-4">
      {section.fields.map((f) => (
        <InfoRow key={f.label} label={f.label} value={f.value} mono={f.mono} />
      ))}
    </div>
  </SectionCard>
);

export default ClientInfoRenderer;

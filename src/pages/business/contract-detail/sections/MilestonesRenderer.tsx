import { SectionCard } from "@/components/detail/DetailPageShell";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { MilestonesSection } from "../types";

interface Props {
  section: MilestonesSection;
}

const MilestonesRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon}>
    <div className="overflow-x-auto -mx-5 -mb-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 font-medium text-xs"></TableHead>
            <TableHead className="font-medium text-xs">Milestone</TableHead>
            <TableHead className="font-medium text-xs">Target Date</TableHead>
            <TableHead className="font-medium text-xs">Actual Date</TableHead>
            <TableHead className="text-center font-medium text-xs">Projected</TableHead>
            <TableHead className="text-center font-medium text-xs">Actual</TableHead>
            <TableHead className="text-center font-medium text-xs">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {section.rows.map((ms) => (
            <TableRow key={ms.id}>
              <TableCell className="w-8">{ms.statusIcon}</TableCell>
              <TableCell className="font-medium text-sm">{ms.milestoneName}</TableCell>
              <TableCell className="text-sm">{ms.targetDate}</TableCell>
              <TableCell className="text-sm">{ms.actualDate ?? "—"}</TableCell>
              <TableCell className="text-center font-medium tabular-nums">
                {ms.projectedCount.toLocaleString()}
              </TableCell>
              <TableCell className="text-center font-medium tabular-nums">
                {ms.actualCount?.toLocaleString() ?? "—"}
              </TableCell>
              <TableCell className="text-center">{ms.statusBadge}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </SectionCard>
);

export default MilestonesRenderer;

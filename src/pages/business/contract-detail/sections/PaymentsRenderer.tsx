import { SectionCard } from "@/components/detail/DetailPageShell";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { PaymentsSection } from "../types";

interface Props {
  section: PaymentsSection;
}

const PaymentsRenderer = ({ section }: Props) => (
  <SectionCard title={section.title} icon={section.icon} headerAction={section.headerAction}>
    <div className="overflow-x-auto -mx-5 -mb-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium text-xs">Type</TableHead>
            <TableHead className="text-right font-medium text-xs">Amount</TableHead>
            <TableHead className="font-medium text-xs">Method</TableHead>
            <TableHead className="font-medium text-xs">Due Date</TableHead>
            <TableHead className="font-medium text-xs">Paid Date</TableHead>
            <TableHead className="text-center font-medium text-xs">Status</TableHead>
            <TableHead className="font-medium text-xs">Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {section.rows.map((pay) => (
            <TableRow key={pay.id}>
              <TableCell className="font-medium text-sm">{pay.paymentType}</TableCell>
              <TableCell className="text-right font-medium tabular-nums">{pay.amount}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{pay.paymentMethod}</TableCell>
              <TableCell className="text-sm">{pay.dueDate}</TableCell>
              <TableCell className="text-sm">{pay.paymentDate ?? "—"}</TableCell>
              <TableCell className="text-center">{pay.statusBadge}</TableCell>
              <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">
                {pay.notes}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </SectionCard>
);

export default PaymentsRenderer;

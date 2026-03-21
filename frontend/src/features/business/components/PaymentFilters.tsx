/* ═══════════════════════════════════════════════════════════════════════════
 * PaymentFilters — Status and type filter dropdowns for Payments page.
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { formatEnumLabel } from "@/shared/types/enums";

// ─── Status Filter ─────────────────────────────────────────────────────────

interface FilterProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

export const PaymentStatusFilter = ({
  value,
  onChange,
  options,
}: FilterProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-40">
      <SelectValue placeholder="All Statuses" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Statuses</SelectItem>
      {options.map((s) => (
        <SelectItem key={s} value={s}>
          {formatEnumLabel(s)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

// ─── Type Filter ───────────────────────────────────────────────────────────

export const PaymentTypeFilter = ({
  value,
  onChange,
  options,
}: FilterProps) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger className="w-full sm:w-40">
      <SelectValue placeholder="All Types" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Types</SelectItem>
      {options.map((t) => (
        <SelectItem key={t} value={t}>
          {formatEnumLabel(t)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

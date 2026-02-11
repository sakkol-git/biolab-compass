/* ═══════════════════════════════════════════════════════════════════════════
 * Transactions — Complete audit trail of all inventory movements.
 *
 * Single useState (search). Table-only view with named sub-components.
 * ═══════════════════════════════════════════════════════════════════════════ */

// ─── External ──────────────────────────────────────────────────────────────
import { useState } from "react";
import { ArrowLeftRight, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";

// ─── Internal Components ───────────────────────────────────────────────────
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import SearchFilter from "@/components/shared/SearchFilter";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  item: string;
  quantity: string;
  type: string;
  category: string;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const TRANSACTIONS: Transaction[] = [
  { id: "TX-001", timestamp: "2026-02-05 14:32", user: "Dr. Sarah Chen", action: "Added", item: "Tomato Seedlings (Batch #127)", quantity: "+50", type: "plant", category: "Plants" },
  { id: "TX-002", timestamp: "2026-02-05 14:15", user: "James Wilson", action: "Consumed", item: "Ethanol 95%", quantity: "-500mL", type: "chemical", category: "Chemicals" },
  { id: "TX-003", timestamp: "2026-02-05 13:28", user: "Emily Rodriguez", action: "Returned", item: "Microscope (M-012)", quantity: "—", type: "equipment", category: "Equipment" },
  { id: "TX-004", timestamp: "2026-02-05 11:45", user: "Dr. Michael Park", action: "Borrowed", item: "pH Meter (PH-003)", quantity: "—", type: "equipment", category: "Equipment" },
  { id: "TX-005", timestamp: "2026-02-05 10:20", user: "Lisa Thompson", action: "Consumed", item: "Agar Powder", quantity: "-100g", type: "chemical", category: "Chemicals" },
  { id: "TX-006", timestamp: "2026-02-05 09:15", user: "Dr. Sarah Chen", action: "Added", item: "Murashige-Skoog Medium", quantity: "+2kg", type: "chemical", category: "Chemicals" },
  { id: "TX-007", timestamp: "2026-02-04 16:40", user: "James Wilson", action: "Harvested", item: "Wheat (Batch #089)", quantity: "-200", type: "plant", category: "Plants" },
  { id: "TX-008", timestamp: "2026-02-04 15:22", user: "Emily Rodriguez", action: "Borrowed", item: "Centrifuge (High-Speed)", quantity: "—", type: "equipment", category: "Equipment" },
  { id: "TX-009", timestamp: "2026-02-04 14:10", user: "Dr. Michael Park", action: "Disposed", item: "Phosphoric Acid (Expired)", quantity: "-500mL", type: "chemical", category: "Chemicals" },
  { id: "TX-010", timestamp: "2026-02-04 11:30", user: "Lisa Thompson", action: "Added", item: "Arabidopsis Seeds", quantity: "+1000", type: "plant", category: "Plants" },
];

// ─── Helpers (module-level, named) ─────────────────────────────────────────

const actionIcon = (action: string) => {
  if (action === "Added") return ArrowUp;
  if (action === "Consumed" || action === "Disposed" || action === "Harvested") return ArrowDown;
  if (action === "Returned") return RotateCcw;
  if (action === "Borrowed") return ArrowLeftRight;
  return null;
};

const actionStyle = (action: string): string => {
  if (action === "Added" || action === "Returned") return "text-primary bg-muted";
  if (action === "Consumed" || action === "Disposed" || action === "Harvested") return "text-warning bg-warning/10";
  return "text-muted-foreground bg-muted";
};

const quantityStyle = (quantity: string): string => {
  if (quantity.startsWith("+")) return "text-primary font-medium";
  if (quantity.startsWith("-")) return "text-warning font-medium";
  return "text-muted-foreground";
};

/* ═══════════════════════════════════════════════════════════════════════════
 * MAIN COMPONENT
 * ═══════════════════════════════════════════════════════════════════════════ */

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = TRANSACTIONS.filter((tx) => {
    const q = searchQuery.toLowerCase();
    return tx.item.toLowerCase().includes(q) || tx.user.toLowerCase().includes(q) || tx.id.toLowerCase().includes(q);
  });

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <PageHeader
          icon={ArrowLeftRight}
          title="Transaction Log"
          description="Complete audit trail of all inventory movements"
        />

        <SearchFilter query={searchQuery} onQueryChange={setSearchQuery} placeholder="Search transactions...">
          <ActionFilter />
          <CategoryFilter />
          <UserFilter />
        </SearchFilter>

        <TransactionTable transactions={filteredTransactions} />

        <TransactionFooter count={filteredTransactions.length} />
      </div>
    </AppLayout>
  );
};

export default Transactions;

/* ═══════════════════════════════════════════════════════════════════════════
 * SUB-COMPONENTS
 * ═══════════════════════════════════════════════════════════════════════════ */

/* ─── Filters (static, non-functional — as in original) ─────────────────── */

const ActionFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Actions" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Actions</SelectItem>
      <SelectItem value="added">Added</SelectItem>
      <SelectItem value="consumed">Consumed</SelectItem>
      <SelectItem value="borrowed">Borrowed</SelectItem>
      <SelectItem value="returned">Returned</SelectItem>
      <SelectItem value="disposed">Disposed</SelectItem>
    </SelectContent>
  </Select>
);

const CategoryFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Categories" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Categories</SelectItem>
      <SelectItem value="plants">Plants</SelectItem>
      <SelectItem value="chemicals">Chemicals</SelectItem>
      <SelectItem value="equipment">Equipment</SelectItem>
    </SelectContent>
  </Select>
);

const UserFilter = () => (
  <Select>
    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Users" /></SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Users</SelectItem>
      <SelectItem value="sarah">Dr. Sarah Chen</SelectItem>
      <SelectItem value="michael">Dr. Michael Park</SelectItem>
      <SelectItem value="emily">Emily Rodriguez</SelectItem>
      <SelectItem value="james">James Wilson</SelectItem>
      <SelectItem value="lisa">Lisa Thompson</SelectItem>
    </SelectContent>
  </Select>
);

/* ─── Table ─────────────────────────────────────────────────────────────── */

const TransactionTable = ({ transactions }: { transactions: Transaction[] }) => (
  <div className="rounded-xl overflow-hidden border border-border/40">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="font-medium w-44">Timestamp</TableHead>
          <TableHead className="font-medium">User</TableHead>
          <TableHead className="font-medium">Action</TableHead>
          <TableHead className="font-medium">Item</TableHead>
          <TableHead className="font-medium text-right">Quantity</TableHead>
          <TableHead className="font-medium">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} transaction={tx} />
        ))}
      </TableBody>
    </Table>
  </div>
);

const TransactionRow = ({ transaction: tx }: { transaction: Transaction }) => (
  <TableRow className="transition-colors">
    <TableCell className="font-mono text-sm text-muted-foreground">{tx.timestamp}</TableCell>
    <TableCell className="text-foreground">{tx.user}</TableCell>
    <TableCell><ActionBadge action={tx.action} /></TableCell>
    <TableCell className="max-w-xs truncate" title={tx.item}>{tx.item}</TableCell>
    <TableCell className={cn("text-right tabular-nums", quantityStyle(tx.quantity))}>{tx.quantity}</TableCell>
    <TableCell>
      <span className="text-xs font-normal text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-md tracking-wide">
        {tx.category}
      </span>
    </TableCell>
  </TableRow>
);

const ActionBadge = ({ action }: { action: string }) => {
  const Icon = actionIcon(action);
  return (
    <span className={cn("inline-flex items-center gap-2 px-2.5 py-0.5 text-xs font-medium border rounded-lg", actionStyle(action))}>
      {Icon && <Icon className="h-4 w-4" />}
      {action}
    </span>
  );
};

/* ─── Footer ────────────────────────────────────────────────────────────── */

const TransactionFooter = ({ count }: { count: number }) => (
  <div className="flex items-center justify-between text-sm text-muted-foreground">
    <p>Showing {count} transactions</p>
    <p>Last updated: Feb 5, 2026 at 14:32</p>
  </div>
);

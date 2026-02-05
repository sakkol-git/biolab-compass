import { useState } from "react";
import { Search, ArrowLeftRight, ArrowUp, ArrowDown, RotateCcw, Filter } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const transactionData = [
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

const getActionIcon = (action: string) => {
  switch (action) {
    case "Added":
      return <ArrowUp className="h-4 w-4" />;
    case "Consumed":
    case "Disposed":
    case "Harvested":
      return <ArrowDown className="h-4 w-4" />;
    case "Returned":
      return <RotateCcw className="h-4 w-4" />;
    case "Borrowed":
      return <ArrowLeftRight className="h-4 w-4" />;
    default:
      return null;
  }
};

const getActionStyle = (action: string) => {
  switch (action) {
    case "Added":
      return "text-primary bg-primary/10";
    case "Consumed":
    case "Disposed":
    case "Harvested":
      return "text-warning bg-warning/10";
    case "Returned":
      return "text-primary bg-primary/10";
    case "Borrowed":
      return "text-muted-foreground bg-muted";
    default:
      return "text-muted-foreground bg-muted";
  }
};

const getQuantityStyle = (quantity: string) => {
  if (quantity.startsWith("+")) return "text-primary font-medium";
  if (quantity.startsWith("-")) return "text-warning font-medium";
  return "text-muted-foreground";
};

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactionData.filter(
    (tx) =>
      tx.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Transaction Log</h1>
            <p className="text-sm text-muted-foreground">
              Complete audit trail of all inventory movements
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="added">Added</SelectItem>
              <SelectItem value="consumed">Consumed</SelectItem>
              <SelectItem value="borrowed">Borrowed</SelectItem>
              <SelectItem value="returned">Returned</SelectItem>
              <SelectItem value="disposed">Disposed</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="plants">Plants</SelectItem>
              <SelectItem value="chemicals">Chemicals</SelectItem>
              <SelectItem value="equipment">Equipment</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="sarah">Dr. Sarah Chen</SelectItem>
              <SelectItem value="michael">Dr. Michael Park</SelectItem>
              <SelectItem value="emily">Emily Rodriguez</SelectItem>
              <SelectItem value="james">James Wilson</SelectItem>
              <SelectItem value="lisa">Lisa Thompson</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-background">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold w-44">Timestamp</TableHead>
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Action</TableHead>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold text-right">Quantity</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx, index) => (
                <TableRow
                  key={tx.id}
                  className={cn(
                    "transition-colors",
                    index % 2 === 0 ? "bg-background" : "bg-muted/30"
                  )}
                >
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {tx.timestamp}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{tx.user}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getActionStyle(tx.action)
                    )}>
                      {getActionIcon(tx.action)}
                      {tx.action}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={tx.item}>
                    {tx.item}
                  </TableCell>
                  <TableCell className={cn("text-right tabular-nums", getQuantityStyle(tx.quantity))}>
                    {tx.quantity}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {tx.category}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>Showing {filteredTransactions.length} transactions</p>
          <p>Last updated: Feb 5, 2026 at 14:32</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Transactions;

import { cn } from "@/lib/utils";
import { ArrowLeftRight, Clock, Check, XCircle, AlertCircle } from "lucide-react";

interface Transaction {
  id: string;
  type: "checkout" | "return" | "consume" | "restock";
  item: string;
  category: "equipment" | "chemical" | "plant";
  user: string;
  quantity?: string;
  status: "completed" | "pending" | "overdue";
  time: string;
  imageUrl?: string;
}

const transactions: Transaction[] = [
  { id: "TX-1041", type: "checkout", item: "pH Meter", category: "equipment", user: "Dr. Chen", status: "completed", time: "09:15", imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=100&h=100&fit=crop" },
  { id: "TX-1040", type: "consume", item: "Ethanol 95%", category: "chemical", user: "J. Wilson", quantity: "200mL", status: "completed", time: "09:02", imageUrl: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=100&h=100&fit=crop" },
  { id: "TX-1039", type: "return", item: "Laminar Flow Hood", category: "equipment", user: "E. Rodriguez", status: "pending", time: "08:45", imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop" },
  { id: "TX-1038", type: "restock", item: "Agar Powder", category: "chemical", user: "L. Thompson", quantity: "500g", status: "completed", time: "08:30", imageUrl: "https://images.unsplash.com/photo-1578539186733-957976ed86a4?w=100&h=100&fit=crop" },
  { id: "TX-1037", type: "checkout", item: "Spectrophotometer", category: "equipment", user: "Dr. Park", status: "overdue", time: "Yesterday", imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=100&h=100&fit=crop" },
  { id: "TX-1036", type: "consume", item: "MS Medium", category: "chemical", user: "Dr. Chen", quantity: "50g", status: "completed", time: "Yesterday", imageUrl: "https://images.unsplash.com/photo-1576670159805-381f63ecd0c3?w=100&h=100&fit=crop" },
];

const typeConfig = {
  checkout: { label: "Out", color: "text-warning", bg: "bg-muted", border: "" },
  return: { label: "In", color: "text-primary", bg: "bg-muted", border: "" },
  consume: { label: "Use", color: "text-muted-foreground", bg: "bg-muted", border: "" },
  restock: { label: "Add", color: "text-primary", bg: "bg-muted", border: "" },
};

const statusConfig = {
  completed: { icon: Check, color: "text-primary" },
  pending: { icon: Clock, color: "text-warning" },
  overdue: { icon: AlertCircle, color: "text-destructive" },
};

const TransactionFeedCard = () => {
  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const overdueCount = transactions.filter((t) => t.status === "overdue").length;

  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="section-title text-foreground">Live Transactions</h3>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              Real-time inventory movements
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {pendingCount > 0 && (
            <span className="text-xs font-medium bg-muted text-warning px-2 py-1 rounded-xl">
              {pendingCount} pending
            </span>
          )}
          {overdueCount > 0 && (
            <span className="text-xs font-medium bg-muted text-destructive px-2 py-1 rounded-xl">
              {overdueCount} overdue
            </span>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {transactions.map((tx, index) => {
          const tConfig = typeConfig[tx.type];
          const sConfig = statusConfig[tx.status];
          const StatusIcon = sConfig.icon;

          return (
            <div
              key={tx.id}
              className="flex items-center gap-3 p-2.5 hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in rounded-xl"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Item Image */}
              <div className="w-10 h-10 shrink-0 overflow-hidden bg-muted flex items-center justify-center rounded-xl">
                {tx.imageUrl ? (
                  <>
                    <img 
                      src={tx.imageUrl} 
                      alt={tx.item}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <ArrowLeftRight className="h-4 w-4 text-muted-foreground hidden" />
                  </>
                ) : (
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Type Badge */}
              <span
                className={cn(
                  "text-xs font-medium w-9 text-center py-1 shrink-0 rounded-xl",
                  tConfig.bg,
                  tConfig.color
                )}
              >
                {tConfig.label}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{tx.item}</span>
                  {tx.quantity && (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-xl">
                      {tx.quantity}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground font-medium">{tx.user}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground font-medium">{tx.id}</span>
                </div>
              </div>

              {/* Time & Status */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-medium text-muted-foreground tabular-nums">{tx.time}</span>
                <StatusIcon className={cn("h-3.5 w-3.5", sConfig.color)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransactionFeedCard;

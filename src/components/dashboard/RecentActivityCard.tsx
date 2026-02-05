import { ArrowLeftRight, Plus, Minus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const activities = [
  {
    user: "Dr. Sarah Chen",
    action: "added",
    item: "Tomato Seedlings (Batch #127)",
    quantity: 50,
    time: "2 min ago",
    type: "add",
  },
  {
    user: "James Wilson",
    action: "consumed",
    item: "Ethanol 95%",
    quantity: 500,
    unit: "mL",
    time: "15 min ago",
    type: "consume",
  },
  {
    user: "Emily Rodriguez",
    action: "returned",
    item: "Microscope (M-012)",
    time: "1 hr ago",
    type: "return",
  },
  {
    user: "Dr. Michael Park",
    action: "borrowed",
    item: "pH Meter (PH-003)",
    time: "2 hr ago",
    type: "borrow",
  },
  {
    user: "Lisa Thompson",
    action: "consumed",
    item: "Agar Powder",
    quantity: 100,
    unit: "g",
    time: "3 hr ago",
    type: "consume",
  },
];

const getActionConfig = (type: string) => {
  switch (type) {
    case "add":
      return { 
        icon: Plus, 
        bgColor: "bg-primary/10", 
        borderColor: "border-primary/30",
        iconColor: "text-primary" 
      };
    case "consume":
      return { 
        icon: Minus, 
        bgColor: "bg-warning/10", 
        borderColor: "border-warning/30",
        iconColor: "text-warning" 
      };
    case "return":
      return { 
        icon: RotateCcw, 
        bgColor: "bg-primary/10", 
        borderColor: "border-primary/30",
        iconColor: "text-primary" 
      };
    case "borrow":
      return { 
        icon: ArrowLeftRight, 
        bgColor: "bg-muted", 
        borderColor: "border-border",
        iconColor: "text-muted-foreground" 
      };
    default:
      return { 
        icon: ArrowLeftRight, 
        bgColor: "bg-muted", 
        borderColor: "border-border",
        iconColor: "text-muted-foreground" 
      };
  }
};

const RecentActivityCard = () => {
  return (
    <div className="bg-card border-2 border-border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b-2 border-border">
        <div className="flex items-center gap-3">
          <div className="icon-badge-primary">
            <ArrowLeftRight className="h-5 w-5 text-primary" />
          </div>
          <h3 className="section-title text-foreground">Recent Activity</h3>
        </div>
        <Button variant="outline" size="sm" className="border-2 font-semibold text-xs uppercase tracking-wide">
          View All
        </Button>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {activities.map((activity, index) => {
          const config = getActionConfig(activity.type);
          const Icon = config.icon;
          
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-3 border-2 border-border hover:shadow-xs transition-all animate-fade-in"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className={cn(
                "w-9 h-9 flex items-center justify-center border-2 shrink-0",
                config.bgColor,
                config.borderColor
              )}>
                <Icon className={cn("h-4 w-4", config.iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-bold">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-semibold">{activity.item}</span>
                  {activity.quantity && (
                    <span className="text-muted-foreground font-medium">
                      {" "}({activity.quantity}{activity.unit || ""})
                    </span>
                  )}
                </p>
                <p className="text-xs font-semibold text-muted-foreground mt-1 uppercase tracking-wide">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivityCard;
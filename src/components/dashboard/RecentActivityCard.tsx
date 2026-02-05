import { ArrowLeftRight, Plus, Minus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    user: "Dr. Sarah Chen",
    action: "added",
    item: "Tomato Seedlings (Batch #127)",
    quantity: 50,
    time: "2 minutes ago",
    type: "add",
  },
  {
    user: "James Wilson",
    action: "consumed",
    item: "Ethanol 95%",
    quantity: 500,
    unit: "mL",
    time: "15 minutes ago",
    type: "consume",
  },
  {
    user: "Emily Rodriguez",
    action: "returned",
    item: "Microscope (M-012)",
    time: "1 hour ago",
    type: "return",
  },
  {
    user: "Dr. Michael Park",
    action: "borrowed",
    item: "pH Meter (PH-003)",
    time: "2 hours ago",
    type: "borrow",
  },
  {
    user: "Lisa Thompson",
    action: "consumed",
    item: "Agar Powder",
    quantity: 100,
    unit: "g",
    time: "3 hours ago",
    type: "consume",
  },
];

const getActionIcon = (type: string) => {
  switch (type) {
    case "add":
      return <Plus className="h-3.5 w-3.5 text-primary" />;
    case "consume":
      return <Minus className="h-3.5 w-3.5 text-warning" />;
    case "return":
      return <RotateCcw className="h-3.5 w-3.5 text-primary" />;
    case "borrow":
      return <ArrowLeftRight className="h-3.5 w-3.5 text-muted-foreground" />;
    default:
      return null;
  }
};

const getActionStyle = (type: string) => {
  switch (type) {
    case "add":
      return "bg-primary/10";
    case "consume":
      return "bg-warning/10";
    case "return":
      return "bg-primary/10";
    case "borrow":
      return "bg-muted";
    default:
      return "bg-muted";
  }
};

const RecentActivityCard = () => {
  return (
    <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ArrowLeftRight className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">Recent Activity</h3>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className={cn("p-1.5 rounded-full mt-0.5", getActionStyle(activity.type))}>
              {getActionIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium">{activity.item}</span>
                {activity.quantity && (
                  <span className="text-muted-foreground">
                    {" "}({activity.quantity}{activity.unit || ""})
                  </span>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityCard;

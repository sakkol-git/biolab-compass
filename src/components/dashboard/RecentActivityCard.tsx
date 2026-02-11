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
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=100&h=100&fit=crop",
  },
  {
    user: "James Wilson",
    action: "consumed",
    item: "Ethanol 95%",
    quantity: 500,
    unit: "mL",
    time: "15 min ago",
    type: "consume",
    imageUrl: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=100&h=100&fit=crop",
  },
  {
    user: "Emily Rodriguez",
    action: "returned",
    item: "Microscope (M-012)",
    time: "1 hr ago",
    type: "return",
    imageUrl: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?w=100&h=100&fit=crop",
  },
  {
    user: "Dr. Michael Park",
    action: "borrowed",
    item: "pH Meter (PH-003)",
    time: "2 hr ago",
    type: "borrow",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=100&h=100&fit=crop",
  },
  {
    user: "Lisa Thompson",
    action: "consumed",
    item: "Agar Powder",
    quantity: 100,
    unit: "g",
    time: "3 hr ago",
    type: "consume",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=100&h=100&fit=crop",
  },
];

const getActionConfig = (type: string) => {
  switch (type) {
    case "add":
      return { 
        icon: Plus, 
        bgColor: "bg-muted", 
        borderColor: "",
        iconColor: "text-primary" 
      };
    case "consume":
      return { 
        icon: Minus, 
        bgColor: "bg-muted", 
        borderColor: "",
        iconColor: "text-warning" 
      };
    case "return":
      return { 
        icon: RotateCcw, 
        bgColor: "bg-muted", 
        borderColor: "",
        iconColor: "text-primary" 
      };
    case "borrow":
      return { 
        icon: ArrowLeftRight, 
        bgColor: "bg-muted", 
        borderColor: "",
        iconColor: "text-muted-foreground" 
      };
    default:
      return { 
        icon: ArrowLeftRight, 
        bgColor: "bg-muted", 
        borderColor: "",
        iconColor: "text-muted-foreground" 
      };
  }
};

const RecentActivityCard = () => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
          <h3 className="section-title text-foreground">Recent Activity</h3>
        </div>
        <Button variant="outline" size="sm" className="border font-medium text-xs">
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
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/40 transition-all animate-fade-in"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Item Image */}
              <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                {activity.imageUrl ? (
                  <>
                    <img 
                      src={activity.imageUrl} 
                      alt={activity.item}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <Icon className={cn("h-5 w-5 hidden", config.iconColor)} />
                  </>
                ) : (
                  <Icon className={cn("h-5 w-5", config.iconColor)} />
                )}
              </div>

              {/* Action Icon Badge */}
              <div className={cn(
                "w-8 h-8 flex items-center justify-center rounded-xl shrink-0 self-center",
                config.bgColor
              )}>
                <Icon className={cn("h-3.5 w-3.5", config.iconColor)} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-medium">{activity.user}</span>{" "}
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.item}</span>
                  {activity.quantity && (
                    <span className="text-muted-foreground font-medium">
                      {" "}({activity.quantity}{activity.unit || ""})
                    </span>
                  )}
                </p>
                <p className="text-xs font-medium text-muted-foreground mt-1 tracking-wide">
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
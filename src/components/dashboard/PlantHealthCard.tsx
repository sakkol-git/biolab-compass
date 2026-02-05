import { Leaf } from "lucide-react";

const PlantHealthCard = () => {
  const total = 1247;
  const healthy = 1089;
  const failed = 42;
  const growing = total - healthy - failed;
  
  const healthPercentage = Math.round((healthy / total) * 100);

  return (
    <div className="bg-background border border-border rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Leaf className="h-4 w-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Plant Inventory Health</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${healthPercentage * 2.51} 251`}
              strokeLinecap="round"
              className="text-primary transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-foreground">{healthPercentage}%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">
              Healthy: <span className="font-medium text-foreground">{healthy.toLocaleString()}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">
              Growing: <span className="font-medium text-foreground">{growing}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">
              Failed: <span className="font-medium text-foreground">{failed}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantHealthCard;

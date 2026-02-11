import { Package } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import ProductionCalculator from "@/components/business/ProductionCalculator";

const ProductionPlanner = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg"><Package className="h-5 w-5 text-muted-foreground" /></div>
          <div>
            <h1 className="text-2xl font-medium text-foreground">Production Planner</h1>
            <p className="text-sm text-muted-foreground">
              Forecast timelines, initial stock, and resource requirements for seedling production orders.
            </p>
          </div>
        </div>

        {/* Calculator */}
        <ProductionCalculator />
      </div>
    </AppLayout>
  );
};

export default ProductionPlanner;

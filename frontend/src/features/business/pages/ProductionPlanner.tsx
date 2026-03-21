import AppLayout from "@/core/layouts/AppLayout";
import ProductionCalculator from "@/features/business/components/ProductionCalculator";
import PageHeader from "@/shared/components/PageHeader";
import { Package } from "lucide-react";

const ProductionPlanner = () => {
  return (
    <AppLayout>
      <div className="page-content">
        <PageHeader
          icon={Package}
          title="Production Planner"
          description="Forecast timelines, initial stock, and resource requirements for seedling production orders."
        />

        {/* Calculator */}
        <ProductionCalculator />
      </div>
    </AppLayout>
  );
};

export default ProductionPlanner;

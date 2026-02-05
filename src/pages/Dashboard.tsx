import { Leaf, FlaskConical, Wrench, ArrowLeftRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import StatCard from "@/components/dashboard/StatCard";
import PlantHealthCard from "@/components/dashboard/PlantHealthCard";
import ChemicalExpiryCard from "@/components/dashboard/ChemicalExpiryCard";
import EquipmentAvailabilityCard from "@/components/dashboard/EquipmentAvailabilityCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, Dr. Chen. Here's your lab inventory overview.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Plant Batches"
            value="1,247"
            subtitle="Across 12 species"
            icon={<Leaf className="h-5 w-5 text-primary" />}
            trend={{ value: 12, label: "this month", positive: true }}
          />
          <StatCard
            title="Chemical Stocks"
            value="156"
            subtitle="3 near expiry"
            icon={<FlaskConical className="h-5 w-5 text-primary" />}
          />
          <StatCard
            title="Equipment Units"
            value="89"
            subtitle="67 available"
            icon={<Wrench className="h-5 w-5 text-primary" />}
          />
          <StatCard
            title="Transactions Today"
            value="24"
            subtitle="8 pending approvals"
            icon={<ArrowLeftRight className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PlantHealthCard />
          <ChemicalExpiryCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EquipmentAvailabilityCard />
          <RecentActivityCard />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

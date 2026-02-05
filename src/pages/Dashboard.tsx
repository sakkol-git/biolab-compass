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
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div className="border-b-2 border-border pb-6">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Welcome back, <span className="text-foreground font-semibold">Dr. Chen</span>. Here's your lab inventory overview.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Plant Batches"
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
            title="Today's Transactions"
            value="24"
            subtitle="8 pending approvals"
            icon={<ArrowLeftRight className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <PlantHealthCard />
          <ChemicalExpiryCard />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <EquipmentAvailabilityCard />
          <RecentActivityCard />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
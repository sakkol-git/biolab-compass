import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Inventory pages
import Chemicals from "./pages/inventory/Chemicals";
import Dashboard from "./pages/inventory/Dashboard";
import Equipment from "./pages/inventory/Equipment";
import PlantSpecies from "./pages/inventory/PlantSpecies";
import PlantStock from "./pages/inventory/PlantStock";
import Transactions from "./pages/inventory/Transactions";
import Users from "./pages/inventory/Users";

// Inventory detail pages
import ChemicalDetail from "./pages/inventory/ChemicalDetail";
import EquipmentDetail from "./pages/inventory/EquipmentDetail";
import PlantSpeciesDetail from "./pages/inventory/PlantSpeciesDetail";
import PlantStockDetail from "./pages/inventory/PlantStockDetail";

// Research pages
import ExperimentDetail from "./pages/research/ExperimentDetail";
import Experiments from "./pages/research/Experiments";
import GrowthAnalysis from "./pages/research/GrowthAnalysis";
import LabNotebooks from "./pages/research/LabNotebooks";
import Protocols from "./pages/research/Protocols";
import Research from "./pages/research/Research";
import SampleTracking from "./pages/research/SampleTracking";

// Business pages
import Business from "./pages/business/Business";
import Clients from "./pages/business/Clients";
import ContractDetail from "./pages/business/ContractDetail";
import Contracts from "./pages/business/Contracts";
import Payments from "./pages/business/Payments";
import ProductionPlanner from "./pages/business/ProductionPlanner";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="biolab-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ── Root redirect ── */}
            <Route path="/" element={<Navigate to="/inventory" replace />} />

            {/* ── Inventory Section ── */}
            <Route path="/inventory" element={<Dashboard />} />
            <Route path="/inventory/plant-species" element={<PlantSpecies />} />
            <Route path="/inventory/plant-stock" element={<PlantStock />} />
            <Route
              path="/inventory/plants"
              element={<Navigate to="/inventory/plant-species" replace />}
            />
            <Route path="/inventory/chemicals" element={<Chemicals />} />
            <Route path="/inventory/equipment" element={<Equipment />} />
            <Route path="/inventory/transactions" element={<Transactions />} />
            <Route path="/inventory/users" element={<Users />} />

            {/* Inventory Product Detail Routes */}
            <Route
              path="/inventory/products/species/:id"
              element={<PlantSpeciesDetail />}
            />
            <Route
              path="/inventory/products/stock/:id"
              element={<PlantStockDetail />}
            />
            <Route
              path="/inventory/products/chemicals/:id"
              element={<ChemicalDetail />}
            />
            <Route
              path="/inventory/products/equipment/:id"
              element={<EquipmentDetail />}
            />

            {/* Legacy route redirects */}
            <Route
              path="/plant-species"
              element={<Navigate to="/inventory/plant-species" replace />}
            />
            <Route
              path="/plant-batches"
              element={<Navigate to="/inventory/plant-stock" replace />}
            />
            <Route
              path="/chemicals"
              element={<Navigate to="/inventory/chemicals" replace />}
            />
            <Route
              path="/equipment"
              element={<Navigate to="/inventory/equipment" replace />}
            />
            <Route
              path="/transactions"
              element={<Navigate to="/inventory/transactions" replace />}
            />
            <Route
              path="/users"
              element={<Navigate to="/inventory/users" replace />}
            />
            <Route
              path="/products/species/:id"
              element={
                <Navigate to="/inventory/products/species/:id" replace />
              }
            />
            <Route
              path="/products/batches/:id"
              element={<Navigate to="/inventory/products/stock/:id" replace />}
            />
            <Route
              path="/products/chemicals/:id"
              element={
                <Navigate to="/inventory/products/chemicals/:id" replace />
              }
            />
            <Route
              path="/products/equipment/:id"
              element={
                <Navigate to="/inventory/products/equipment/:id" replace />
              }
            />

            {/* ── Research Section ── */}
            <Route path="/research" element={<Research />} />
            <Route path="/research/experiments" element={<Experiments />} />
            <Route
              path="/research/experiments/:id"
              element={<ExperimentDetail />}
            />
            <Route path="/research/protocols" element={<Protocols />} />
            <Route path="/research/notebooks" element={<LabNotebooks />} />
            <Route path="/research/analysis" element={<GrowthAnalysis />} />
            <Route path="/research/samples" element={<SampleTracking />} />

            {/* ── Business Section ── */}
            <Route path="/business" element={<Business />} />
            <Route
              path="/business/production"
              element={<ProductionPlanner />}
            />
            <Route path="/business/clients" element={<Clients />} />
            <Route path="/business/contracts" element={<Contracts />} />
            <Route
              path="/business/contracts/:id"
              element={<ContractDetail />}
            />
            <Route path="/business/payments" element={<Payments />} />

            {/* ── Catch-all ── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;

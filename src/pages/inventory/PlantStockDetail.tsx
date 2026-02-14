// ═══════════════════════════════════════════════════════════════════════════
// PLANT STOCK DETAIL PAGE — Composition Root
// ═══════════════════════════════════════════════════════════════════════════
//
// Thin shell: hook → config → renderer.
// Zero business logic. Zero layout. Zero formatting.
// ═══════════════════════════════════════════════════════════════════════════

import {
    DetailNotFound,
    DetailSkeleton,
} from "@/components/detail/DetailPageShell";
import AppLayout from "@/components/layout/AppLayout";
import StockDetailRenderer from "./plant-stock-detail/StockDetailRenderer";
import { useStockDetail } from "./plant-stock-detail/useStockDetail";

const PlantStockDetailPage = () => {
  const { state, id, config } = useStockDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Plant Stock"
        id={id}
        backTo="/inventory/plant-stock"
        backLabel="All Stock"
      />
    );
  }

  return (
    <AppLayout>
      <StockDetailRenderer config={config} />
    </AppLayout>
  );
};

export default PlantStockDetailPage;

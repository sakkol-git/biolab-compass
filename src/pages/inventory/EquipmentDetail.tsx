// ═══════════════════════════════════════════════════════════════════════════
// EQUIPMENT DETAIL PAGE — Composition Root
// ═══════════════════════════════════════════════════════════════════════════
//
// This is a thin shell: hook → config → renderer.
// Zero business logic. Zero layout. Zero formatting.
// ═══════════════════════════════════════════════════════════════════════════

import AppLayout from "@/components/layout/AppLayout";
import {
  DetailSkeleton,
  DetailNotFound,
} from "@/components/detail/DetailPageShell";
import EquipmentDetailRenderer from "./equipment-detail/EquipmentDetailRenderer";
import { useEquipmentDetail } from "./equipment-detail/useEquipmentDetail";

const EquipmentDetailPage = () => {
  const { state, id, config } = useEquipmentDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Equipment"
        id={id}
        backTo="/inventory/equipment"
        backLabel="All Equipment"
      />
    );
  }

  return (
    <AppLayout>
      <EquipmentDetailRenderer config={config} />
    </AppLayout>
  );
};

export default EquipmentDetailPage;

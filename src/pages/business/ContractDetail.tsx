// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT DETAIL PAGE — Composition Root
// ═══════════════════════════════════════════════════════════════════════════
//
// Thin shell: hook → config → renderer.
// Zero business logic. Zero layout. Zero formatting.
// ═══════════════════════════════════════════════════════════════════════════

import AppLayout from "@/components/layout/AppLayout";
import {
  DetailSkeleton,
  DetailNotFound,
} from "@/components/detail/DetailPageShell";
import ContractDetailRenderer from "./contract-detail/ContractDetailRenderer";
import { useContractDetail } from "./contract-detail/useContractDetail";

const ContractDetail = () => {
  const { state, id, config } = useContractDetail();

  if (state === "loading") return <DetailSkeleton />;

  if (state === "not-found" || !config) {
    return (
      <DetailNotFound
        category="Contract"
        id={id}
        backTo="/business/contracts"
        backLabel="Contracts"
      />
    );
  }

  return (
    <AppLayout>
      <ContractDetailRenderer config={config} />
    </AppLayout>
  );
};

export default ContractDetail;

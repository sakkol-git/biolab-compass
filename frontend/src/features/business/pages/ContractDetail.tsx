// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT DETAIL PAGE — Composition Root
// ═══════════════════════════════════════════════════════════════════════════
//
// Thin shell: hook → config → renderer.
// Zero business logic. Zero layout. Zero formatting.
// ═══════════════════════════════════════════════════════════════════════════

import AppLayout from "@/core/layouts/AppLayout";
import {
  DetailNotFound,
  DetailSkeleton,
} from "@/shared/components/detail/DetailPageShell";
import ContractFormDialog from "../components/ContractFormDialog";
import ContractDetailRenderer from "./contract-detail/ContractDetailRenderer";
import { useContractDetail } from "./contract-detail/useContractDetail";
import { useContractsView } from "./useContractsView";

const ContractDetail = () => {
  const detail = useContractDetail();
  const contractsView = useContractsView();

  if (detail.state === "loading") return <DetailSkeleton />;

  if (detail.state === "not-found" || !detail.config) {
    return (
      <DetailNotFound
        category="Contract"
        id={detail.id}
        backTo="/business/contracts"
        backLabel="Contracts"
      />
    );
  }

  const config = {
    ...detail.config,
    actions: detail.config.actions.map((a) =>
      a.label === "Edit"
        ? { ...a, onClick: () => contractsView.openEditForm(detail.rawData) }
        : a,
    ),
  };

  return (
    <AppLayout>
      <ContractDetailRenderer config={config} />
      <ContractFormDialog view={contractsView} />
    </AppLayout>
  );
};

export default ContractDetail;

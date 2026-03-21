import { ProductCard } from "@/components/ui/ProductCard";
import {
    experimentStatusStyles,
    statusBadge,
} from "@/shared/lib/status-styles";
import { cn } from "@/shared/lib/utils";
import type { ExperimentApi } from "@/shared/types";
import { formatEnumLabel } from "@/shared/types/enums";
import { Calendar, Sprout, TestTubes, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExperimentCardProps {
  experiment: ExperimentApi;
  onEdit?: (experiment: ExperimentApi) => void;
}

const ExperimentCard = ({ experiment, onEdit }: ExperimentCardProps) => {
  const navigate = useNavigate();

  return (
    <ProductCard
      image={experiment.image_url}
      fallbackImage={
        <div className="flex flex-col items-center justify-center bg-primary/5">
          <TestTubes className="h-12 w-12 text-primary/40" strokeWidth={1.2} />
          <span className="mt-2 text-xs font-medium tracking-widest text-muted-foreground">
            {formatEnumLabel(experiment.propagation_method)}
          </span>
        </div>
      }
      title={experiment.title}
      subtitle={`${experiment.species.common_name} (${experiment.species.scientific_name})`}
      id={experiment.experiment_code}
      statusBadge={
        <span
          className={cn(statusBadge(experimentStatusStyles, experiment.status))}
        >
          {formatEnumLabel(experiment.status)}
        </span>
      }
      meta={[
        {
          icon: Sprout,
          label: "initial",
          value: experiment.metrics.initial_seed_count,
        },
        {
          icon: Sprout,
          label: "current",
          value: experiment.metrics.current_count.toLocaleString(),
        },
        { icon: Calendar, value: experiment.dates.start_date },
        { icon: Users, value: experiment.assigned_users?.[0]?.name ?? "—" },
      ]}
      tags={experiment.tags?.map((t) => t.name) ?? []}
      onClick={() => navigate(`/research/experiments/${experiment.id}`)}
      onEdit={onEdit ? () => onEdit(experiment) : undefined}
      imageBackgroundColor="bg-muted/50"
    />
  );
};

export default ExperimentCard;

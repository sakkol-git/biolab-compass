import { useNavigate } from "react-router-dom";
import { TestTubes, Calendar, Users, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { experimentStatusStyles, statusBadge } from "@/lib/status-styles";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Experiment } from "@/types/research";

interface ExperimentCardProps {
  experiment: Experiment;
  onEdit?: (experiment: Experiment) => void;
}

const ExperimentCard = ({ experiment, onEdit }: ExperimentCardProps) => {
  const navigate = useNavigate();

  return (
    <ProductCard
      image={experiment.imageUrl}
      fallbackImage={
        <div className="flex flex-col items-center justify-center bg-primary/5">
          <TestTubes className="h-12 w-12 text-primary/40" strokeWidth={1.2} />
          <span className="mt-2 text-xs font-medium tracking-widest text-muted-foreground">
            {experiment.propagationMethod}
          </span>
        </div>
      }
      title={experiment.title}
      subtitle={`${experiment.commonName} (${experiment.speciesName})`}
      id={experiment.experimentCode}
      statusBadge={
        <span className={cn(statusBadge(experimentStatusStyles, experiment.status))}>
          {experiment.status}
        </span>
      }
      meta={[
        { icon: Sprout, label: "initial", value: experiment.initialSeedCount },
        { icon: Sprout, label: "current", value: experiment.currentCount.toLocaleString() },
        { icon: Calendar, value: experiment.startDate },
        { icon: Users, value: experiment.assignedTo[0] },
      ]}
      tags={experiment.tags}
      onClick={() => navigate(`/research/experiments/${experiment.id}`)}
      onEdit={onEdit ? () => onEdit(experiment) : undefined}
      imageBackgroundColor="bg-muted/50"
    />
  );
};

export default ExperimentCard;

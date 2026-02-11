import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GrowthLog, GrowthStage } from "@/types/research";

interface GrowthLogFormProps {
  experimentId: string;
  nextWeekNumber: number;
  onSubmit: (log: Omit<GrowthLog, "id" | "createdAt">) => void;
  onCancel: () => void;
  /** When provided, the form pre-fills for editing an existing log. */
  editingLog?: GrowthLog;
}

const growthStages: GrowthStage[] = ["Germination", "Seedling", "Vegetative", "Hardening", "Ready"];

function buildInitialForm(editingLog: GrowthLog | undefined, nextWeekNumber: number) {
  if (editingLog) {
    return {
      weekNumber: String(editingLog.weekNumber),
      logDate: editingLog.logDate,
      seedlingCount: String(editingLog.seedlingCount),
      aliveCount: String(editingLog.aliveCount),
      deadCount: String(editingLog.deadCount),
      newPropagations: String(editingLog.newPropagations),
      healthScore: String(editingLog.healthScore),
      avgHeightCm: editingLog.avgHeightCm != null ? String(editingLog.avgHeightCm) : "",
      growthStage: editingLog.growthStage,
      observations: editingLog.observations,
    };
  }
  return {
    weekNumber: String(nextWeekNumber),
    logDate: new Date().toISOString().split("T")[0],
    seedlingCount: "",
    aliveCount: "",
    deadCount: "",
    newPropagations: "0",
    healthScore: "8",
    avgHeightCm: "",
    growthStage: "Seedling" as GrowthStage,
    observations: "",
  };
}

const GrowthLogForm = ({ experimentId, nextWeekNumber, onSubmit, onCancel, editingLog }: GrowthLogFormProps) => {
  const isEditing = Boolean(editingLog);
  const [form, setForm] = useState(() => buildInitialForm(editingLog, nextWeekNumber));

  const handleSubmit = () => {
    const seedling = Number(form.seedlingCount);
    const alive = Number(form.aliveCount);
    const dead = Number(form.deadCount);
    const newProp = Number(form.newPropagations);
    const survivalRate = seedling > 0 ? (alive / seedling) * 100 : 0;
    const multRate = dead > 0 || newProp > 0 ? (alive + newProp) / Math.max(alive, 1) : 1;

    onSubmit({
      experimentId,
      weekNumber: Number(form.weekNumber),
      logDate: form.logDate,
      seedlingCount: seedling,
      aliveCount: alive,
      deadCount: dead,
      newPropagations: newProp,
      survivalRatePct: Math.round(survivalRate * 10) / 10,
      multiplicationRate: Math.round(multRate * 100) / 100,
      healthScore: Number(form.healthScore),
      avgHeightCm: form.avgHeightCm ? Number(form.avgHeightCm) : undefined,
      growthStage: form.growthStage,
      observations: form.observations,
      recordedBy: "Dr. Sarah Chen",
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gl-week">Week Number *</Label>
          <Input id="gl-week" type="number" min="1" value={form.weekNumber}
            onChange={(e) => setForm({ ...form, weekNumber: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gl-date">Log Date *</Label>
          <Input id="gl-date" type="date" value={form.logDate}
            onChange={(e) => setForm({ ...form, logDate: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gl-stage">Growth Stage *</Label>
          <Select value={form.growthStage} onValueChange={(v) => setForm({ ...form, growthStage: v as GrowthStage })}>
            <SelectTrigger id="gl-stage"><SelectValue /></SelectTrigger>
            <SelectContent>
              {growthStages.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gl-total">Total Seedlings *</Label>
          <Input id="gl-total" type="number" min="0" placeholder="e.g. 200"
            value={form.seedlingCount} onChange={(e) => setForm({ ...form, seedlingCount: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gl-alive">Alive Count *</Label>
          <Input id="gl-alive" type="number" min="0" placeholder="e.g. 185"
            value={form.aliveCount} onChange={(e) => setForm({ ...form, aliveCount: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gl-dead">Dead Count</Label>
          <Input id="gl-dead" type="number" min="0" placeholder="e.g. 15"
            value={form.deadCount} onChange={(e) => setForm({ ...form, deadCount: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gl-new">New Propagations</Label>
          <Input id="gl-new" type="number" min="0" placeholder="e.g. 175"
            value={form.newPropagations} onChange={(e) => setForm({ ...form, newPropagations: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gl-health">Health Score (1-10) *</Label>
          <Input id="gl-health" type="number" min="1" max="10" value={form.healthScore}
            onChange={(e) => setForm({ ...form, healthScore: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gl-height">Avg Height (cm)</Label>
          <Input id="gl-height" type="number" min="0" step="0.1" placeholder="e.g. 5.4"
            value={form.avgHeightCm} onChange={(e) => setForm({ ...form, avgHeightCm: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="gl-obs">Observations</Label>
        <Textarea id="gl-obs" placeholder="Notes about this week's growth, conditions, issues..."
          value={form.observations} onChange={(e) => setForm({ ...form, observations: e.target.value })} rows={3} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}
          disabled={!form.seedlingCount || !form.aliveCount}>
          {isEditing ? "Update Growth Log" : "Record Growth Log"}
        </Button>
      </div>
    </div>
  );
};

export default GrowthLogForm;

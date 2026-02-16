// ═══════════════════════════════════════════════════════════════════════════
// PLANT VARIETY DETAIL — Section Registry
// ═══════════════════════════════════════════════════════════════════════════

import type { SectionRendererMap } from "./types";

import GeneticInfoSection from "./sections/GeneticInfoSection";
import ImagesSection from "./sections/ImagesSection";
import NotesSection from "./sections/NotesSection";
import OwnershipSection from "./sections/OwnershipSection";
import TraitsSection from "./sections/TraitsSection";
import VarietyInfoSection from "./sections/VarietyInfoSection";

export const sectionRegistry = {
  "variety-info": VarietyInfoSection,
  ownership: OwnershipSection,
  traits: TraitsSection,
  "genetic-info": GeneticInfoSection,
  notes: NotesSection,
  images: ImagesSection,
} satisfies SectionRendererMap;

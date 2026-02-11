// ═══════════════════════════════════════════════════════════════════════════
// MOCK DETAIL DATA — Extended records for product detail pages
// ═══════════════════════════════════════════════════════════════════════════

// ─── Plant Species ──────────────────────────────────────────────────────────

export interface SpeciesDetail {
  id: string;
  scientificName: string;
  commonName: string;
  family: string;
  growthType: string;
  optimalTemp: string;
  activeBatches: number;
  totalPlants: number;
  description: string;
  imageUrl?: string;
  nativeRegion: string;
  lightRequirement: string;
  waterRequirement: string;
  soilType: string;
  humidity: string;
  propagation: string;
  maturityDays: number;
  maxHeight: string;
  associatedBatches: { id: string; stage: string; quantity: number; location: string; startDate: string }[];
  tags: string[];
}

export const speciesDetailData: Record<string, SpeciesDetail> = {
  "SP-001": {
    id: "SP-001",
    scientificName: "Solanum lycopersicum",
    commonName: "Tomato",
    family: "Solanaceae",
    growthType: "Annual",
    optimalTemp: "20–25°C",
    activeBatches: 1,
    totalPlants: 150,
    description: "Widely cultivated edible fruit-bearing plant used in various research studies. Known for its complex genetic architecture and significance in studying fruit development, ripening, and disease resistance mechanisms.",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=400&fit=crop",
    nativeRegion: "Western South America",
    lightRequirement: "Full Sun (6-8 hrs)",
    waterRequirement: "Moderate — consistent moisture",
    soilType: "Well-drained loamy soil, pH 6.0–6.8",
    humidity: "50–70%",
    propagation: "Seed, Stem Cuttings",
    maturityDays: 70,
    maxHeight: "1.5–3 m",
    associatedBatches: [
      { id: "PB-001", stage: "Growing", quantity: 150, location: "Greenhouse A", startDate: "2025-11-15" },
    ],
    tags: ["model organism", "fruit development", "solanaceae"],
  },
  "SP-002": {
    id: "SP-002",
    scientificName: "Arabidopsis thaliana",
    commonName: "Thale Cress",
    family: "Brassicaceae",
    growthType: "Annual",
    optimalTemp: "22–24°C",
    activeBatches: 1,
    totalPlants: 300,
    description: "Model organism for plant biology and genetics research. First plant to have its entire genome sequenced. Widely used in studies of gene regulation, development, and stress responses.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    nativeRegion: "Eurasia & North Africa",
    lightRequirement: "Moderate (16h/8h photoperiod)",
    waterRequirement: "Low — drought tolerant",
    soilType: "Standard potting mix, pH 5.5–6.5",
    humidity: "40–60%",
    propagation: "Seed",
    maturityDays: 42,
    maxHeight: "25–35 cm",
    associatedBatches: [
      { id: "PB-002", stage: "Seedling", quantity: 300, location: "Growth Chamber 1", startDate: "2026-01-03" },
    ],
    tags: ["model organism", "genomics", "genetics"],
  },
  "SP-003": {
    id: "SP-003",
    scientificName: "Zea mays",
    commonName: "Maize",
    family: "Poaceae",
    growthType: "Annual",
    optimalTemp: "25–30°C",
    activeBatches: 1,
    totalPlants: 500,
    description: "Major cereal grain used in genetics, breeding, and biofuel research. Its large genome and genetic diversity make it invaluable for quantitative trait loci mapping and heterosis studies.",
    imageUrl: "https://images.unsplash.com/photo-1601593768498-8de537434af0?w=800&h=400&fit=crop",
    nativeRegion: "Mesoamerica",
    lightRequirement: "Full Sun (8+ hrs)",
    waterRequirement: "High — regular watering",
    soilType: "Rich, well-drained, pH 5.8–7.0",
    humidity: "50–80%",
    propagation: "Seed",
    maturityDays: 90,
    maxHeight: "2–3 m",
    associatedBatches: [
      { id: "PB-003", stage: "Seed", quantity: 500, location: "Cold Storage", startDate: "2025-09-20" },
    ],
    tags: ["cereal crop", "biofuel", "breeding"],
  },
  "SP-004": {
    id: "SP-004",
    scientificName: "Oryza sativa",
    commonName: "Rice",
    family: "Poaceae",
    growthType: "Annual",
    optimalTemp: "25–35°C",
    activeBatches: 1,
    totalPlants: 200,
    description: "Staple cereal crop and model monocot for genomics research. Its relatively small genome among cereals and well-annotated genome sequence make it a reference for grass biology.",
    imageUrl: "https://images.unsplash.com/photo-1536054953991-8a5a0e5e5e04?w=800&h=400&fit=crop",
    nativeRegion: "Southeast Asia",
    lightRequirement: "Full Sun",
    waterRequirement: "Very High — paddy conditions",
    soilType: "Clayey/loamy, pH 5.5–6.5",
    humidity: "70–90%",
    propagation: "Seed",
    maturityDays: 120,
    maxHeight: "1–1.8 m",
    associatedBatches: [
      { id: "PB-004", stage: "Growing", quantity: 200, location: "Greenhouse B", startDate: "2025-12-01" },
    ],
    tags: ["staple crop", "genomics", "monocot"],
  },
  "SP-005": {
    id: "SP-005",
    scientificName: "Nicotiana tabacum",
    commonName: "Tobacco",
    family: "Solanaceae",
    growthType: "Annual",
    optimalTemp: "20–30°C",
    activeBatches: 1,
    totalPlants: 45,
    description: "Commonly used in plant molecular biology and transient expression studies. Its large leaves and ease of transformation make it ideal for protein expression and biopharming research.",
    imageUrl: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=800&h=400&fit=crop",
    nativeRegion: "The Americas",
    lightRequirement: "Full Sun (6-8 hrs)",
    waterRequirement: "Moderate",
    soilType: "Sandy loam, pH 5.8–6.5",
    humidity: "50–70%",
    propagation: "Seed",
    maturityDays: 80,
    maxHeight: "1–2 m",
    associatedBatches: [
      { id: "PB-005", stage: "Harvested", quantity: 45, location: "Drying Room", startDate: "2025-08-10" },
    ],
    tags: ["transient expression", "biopharming", "molecular biology"],
  },
  "SP-006": {
    id: "SP-006",
    scientificName: "Glycine max",
    commonName: "Soybean",
    family: "Fabaceae",
    growthType: "Annual",
    optimalTemp: "20–30°C",
    activeBatches: 0,
    totalPlants: 0,
    description: "Important legume crop used in nitrogen fixation and protein research. Symbiotic relationship with rhizobia bacteria makes it a model for studying biological nitrogen fixation.",
    imageUrl: "https://images.unsplash.com/photo-1599420186946-7a27d18a7d86?w=800&h=400&fit=crop",
    nativeRegion: "East Asia",
    lightRequirement: "Full Sun",
    waterRequirement: "Moderate",
    soilType: "Well-drained, pH 6.0–7.0",
    humidity: "50–70%",
    propagation: "Seed",
    maturityDays: 100,
    maxHeight: "0.6–1.2 m",
    associatedBatches: [
      { id: "PB-006", stage: "Failed", quantity: 0, location: "Greenhouse A", startDate: "2025-10-05" },
    ],
    tags: ["legume", "nitrogen fixation", "protein"],
  },
  "SP-007": {
    id: "SP-007",
    scientificName: "Triticum aestivum",
    commonName: "Wheat",
    family: "Poaceae",
    growthType: "Annual",
    optimalTemp: "15–20°C",
    activeBatches: 1,
    totalPlants: 400,
    description: "Major global cereal crop, model for polyploidy and breeding research. Its hexaploid genome provides unique opportunities for studying gene redundancy and sub-genome evolution.",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop",
    nativeRegion: "Fertile Crescent",
    lightRequirement: "Full Sun",
    waterRequirement: "Moderate",
    soilType: "Loamy, pH 6.0–7.0",
    humidity: "40–60%",
    propagation: "Seed",
    maturityDays: 120,
    maxHeight: "0.7–1.2 m",
    associatedBatches: [
      { id: "PB-007", stage: "Seedling", quantity: 400, location: "Field Plot 1", startDate: "2026-01-20" },
    ],
    tags: ["cereal crop", "polyploidy", "breeding"],
  },
};

// ─── Plant Batches ──────────────────────────────────────────────────────────

export interface BatchDetail {
  id: string;
  species: string;
  commonName: string;
  speciesId: string;
  stage: string;
  quantity: number;
  location: string;
  status: string;
  startDate: string;
  notes: string;
  imageUrl?: string;
  sourceMaterial: string;
  expectedHarvestDate: string;
  healthScore: number;
  growthMilestones: { date: string; event: string }[];
  environmentalLog: { date: string; temp: string; humidity: string; light: string }[];
  assignedTo: string;
}

export const batchDetailData: Record<string, BatchDetail> = {
  "PB-001": {
    id: "PB-001",
    species: "Solanum lycopersicum",
    commonName: "Tomato",
    speciesId: "SP-001",
    stage: "Growing",
    quantity: 150,
    location: "Greenhouse A",
    status: "Healthy",
    startDate: "2025-11-15",
    notes: "Experimental cultivar trial — evaluating disease resistance traits across 3 cultivar lines.",
    imageUrl: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=400&fit=crop",
    sourceMaterial: "Seed lot TM-2024-A (certified)",
    expectedHarvestDate: "2026-03-15",
    healthScore: 92,
    growthMilestones: [
      { date: "2025-11-15", event: "Seeds sown in propagation trays" },
      { date: "2025-11-25", event: "Germination complete (95% rate)" },
      { date: "2025-12-10", event: "Transplanted to individual pots" },
      { date: "2026-01-05", event: "First true leaves observed" },
      { date: "2026-01-28", event: "Flowering stage initiated" },
    ],
    environmentalLog: [
      { date: "2026-02-05", temp: "23°C", humidity: "65%", light: "14h/10h" },
      { date: "2026-02-04", temp: "22°C", humidity: "62%", light: "14h/10h" },
      { date: "2026-02-03", temp: "24°C", humidity: "68%", light: "14h/10h" },
    ],
    assignedTo: "Dr. Sarah Chen",
  },
  "PB-002": {
    id: "PB-002",
    species: "Arabidopsis thaliana",
    commonName: "Thale Cress",
    speciesId: "SP-002",
    stage: "Seedling",
    quantity: 300,
    location: "Growth Chamber 1",
    status: "Healthy",
    startDate: "2026-01-03",
    notes: "Gene expression study — Col-0 ecotype, T3 generation transgenic lines for GFP reporter analysis.",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
    sourceMaterial: "In-house T2 seed stock (transgenic)",
    expectedHarvestDate: "2026-03-20",
    healthScore: 98,
    growthMilestones: [
      { date: "2026-01-03", event: "Seeds stratified at 4°C" },
      { date: "2026-01-07", event: "Moved to growth chamber" },
      { date: "2026-01-14", event: "Germination observed (98% rate)" },
      { date: "2026-01-28", event: "Cotyledon stage — selection started" },
    ],
    environmentalLog: [
      { date: "2026-02-05", temp: "22°C", humidity: "55%", light: "16h/8h" },
      { date: "2026-02-04", temp: "22°C", humidity: "53%", light: "16h/8h" },
      { date: "2026-02-03", temp: "23°C", humidity: "56%", light: "16h/8h" },
    ],
    assignedTo: "Emily Rodriguez",
  },
  "PB-003": {
    id: "PB-003",
    species: "Zea mays",
    commonName: "Maize",
    speciesId: "SP-003",
    stage: "Seed",
    quantity: 500,
    location: "Cold Storage",
    status: "Dormant",
    startDate: "2025-09-20",
    notes: "Stored for spring planting. Inbred lines B73 and Mo17 for heterosis study.",
    imageUrl: "https://images.unsplash.com/photo-1601593768498-8de537434af0?w=800&h=400&fit=crop",
    sourceMaterial: "USDA Seed Bank — Accession ZM-B73-2024",
    expectedHarvestDate: "2026-08-30",
    healthScore: 100,
    growthMilestones: [
      { date: "2025-09-20", event: "Seeds received and catalogued" },
      { date: "2025-09-22", event: "Viability test — 97% germination rate" },
      { date: "2025-09-25", event: "Transferred to cold storage (4°C)" },
    ],
    environmentalLog: [
      { date: "2026-02-05", temp: "4°C", humidity: "30%", light: "Dark" },
      { date: "2026-02-04", temp: "4°C", humidity: "30%", light: "Dark" },
      { date: "2026-02-03", temp: "4°C", humidity: "31%", light: "Dark" },
    ],
    assignedTo: "Dr. James Park",
  },
  "PB-004": {
    id: "PB-004",
    species: "Oryza sativa",
    commonName: "Rice",
    speciesId: "SP-004",
    stage: "Growing",
    quantity: 200,
    location: "Greenhouse B",
    status: "Healthy",
    startDate: "2025-12-01",
    notes: "Drought resistance study — comparing IR64 and Nipponbare cultivars under progressive water stress.",
    imageUrl: "https://images.unsplash.com/photo-1536054953991-8a5a0e5e5e04?w=800&h=400&fit=crop",
    sourceMaterial: "IRRI Seed Bank — IR64-2024, Nipponbare-2024",
    expectedHarvestDate: "2026-05-01",
    healthScore: 85,
    growthMilestones: [
      { date: "2025-12-01", event: "Seeds germinated in wet tissue" },
      { date: "2025-12-08", event: "Transplanted to paddy trays" },
      { date: "2025-12-28", event: "Tillering stage reached" },
      { date: "2026-01-20", event: "Water stress treatment started" },
    ],
    environmentalLog: [
      { date: "2026-02-05", temp: "28°C", humidity: "75%", light: "12h/12h" },
      { date: "2026-02-04", temp: "27°C", humidity: "78%", light: "12h/12h" },
      { date: "2026-02-03", temp: "29°C", humidity: "72%", light: "12h/12h" },
    ],
    assignedTo: "Dr. Anika Patel",
  },
  "PB-005": {
    id: "PB-005",
    species: "Nicotiana tabacum",
    commonName: "Tobacco",
    speciesId: "SP-005",
    stage: "Harvested",
    quantity: 45,
    location: "Drying Room",
    status: "Processed",
    startDate: "2025-08-10",
    notes: "Transient expression batch — Agrobacterium-mediated infiltration for GFP-tagged proteins.",
    imageUrl: "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?w=800&h=400&fit=crop",
    sourceMaterial: "In-house Xanthi variety seed stock",
    expectedHarvestDate: "2025-12-15",
    healthScore: 75,
    growthMilestones: [
      { date: "2025-08-10", event: "Seeds sown" },
      { date: "2025-08-22", event: "Germination complete" },
      { date: "2025-09-15", event: "Plants at 6-leaf stage" },
      { date: "2025-10-20", event: "Agro-infiltration performed" },
      { date: "2025-11-05", event: "Leaf tissue harvested" },
      { date: "2025-12-01", event: "Remaining plants moved to drying" },
    ],
    environmentalLog: [
      { date: "2026-02-05", temp: "20°C", humidity: "35%", light: "Dark" },
      { date: "2026-02-04", temp: "20°C", humidity: "36%", light: "Dark" },
      { date: "2026-02-03", temp: "20°C", humidity: "34%", light: "Dark" },
    ],
    assignedTo: "Dr. Sarah Chen",
  },
  "PB-006": {
    id: "PB-006",
    species: "Glycine max",
    commonName: "Soybean",
    speciesId: "SP-006",
    stage: "Failed",
    quantity: 0,
    location: "Greenhouse A",
    status: "Failed",
    startDate: "2025-10-05",
    notes: "Contamination detected — Rhizoctonia root rot identified. Batch terminated to prevent spread.",
    imageUrl: "https://images.unsplash.com/photo-1599420186946-7a27d18a7d86?w=800&h=400&fit=crop",
    sourceMaterial: "Certified Williams 82 seed (commercial)",
    expectedHarvestDate: "N/A",
    healthScore: 0,
    growthMilestones: [
      { date: "2025-10-05", event: "Seeds sown" },
      { date: "2025-10-15", event: "Germination (88% rate)" },
      { date: "2025-11-01", event: "Yellowing observed in 30% of plants" },
      { date: "2025-11-10", event: "Root rot confirmed — fungal pathogen" },
      { date: "2025-11-15", event: "Batch terminated, area sterilized" },
    ],
    environmentalLog: [],
    assignedTo: "Dr. James Park",
  },
  "PB-007": {
    id: "PB-007",
    species: "Triticum aestivum",
    commonName: "Wheat",
    speciesId: "SP-007",
    stage: "Seedling",
    quantity: 400,
    location: "Field Plot 1",
    status: "Healthy",
    startDate: "2026-01-20",
    notes: "Winter wheat variety trial — comparing 5 cultivars for cold tolerance and yield potential.",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop",
    sourceMaterial: "CIMMYT Seed Bank — 5 cultivar accessions",
    expectedHarvestDate: "2026-06-15",
    healthScore: 90,
    growthMilestones: [
      { date: "2026-01-20", event: "Seeds sown in field plot" },
      { date: "2026-01-30", event: "Emergence observed (92% rate)" },
      { date: "2026-02-05", event: "Seedling stage — vernalization ongoing" },
    ],
    environmentalLog: [
      { date: "2026-02-05", temp: "8°C", humidity: "70%", light: "Natural" },
      { date: "2026-02-04", temp: "6°C", humidity: "75%", light: "Natural" },
      { date: "2026-02-03", temp: "7°C", humidity: "72%", light: "Natural" },
    ],
    assignedTo: "Emily Rodriguez",
  },
};

// ─── Chemicals ──────────────────────────────────────────────────────────────

export interface ChemicalDetail {
  id: string;
  name: string;
  cas: string;
  quantity: string;
  expiry: string;
  daysLeft: number;
  hazard: string;
  location: string;
  notes: string;
  imageUrl?: string;
  concentration: string;
  molecularWeight: string;
  purity: string;
  supplier: string;
  supplierCatalog: string;
  lotNumber: string;
  dateReceived: string;
  storageTemp: string;
  storageConditions: string;
  safetyClass: string;
  ghs: string[];
  sdsUrl: string;
  usageRecords: { date: string; user: string; amountUsed: string; purpose: string }[];
}

export const chemicalDetailData: Record<string, ChemicalDetail> = {
  "CH-001": {
    id: "CH-001",
    name: "Sodium Hydroxide (NaOH)",
    cas: "1310-73-2",
    quantity: "2.5L",
    concentration: "10 M",
    molecularWeight: "40.00 g/mol",
    purity: "≥ 98%",
    expiry: "2026-02-12",
    daysLeft: 7,
    hazard: "high",
    location: "Cabinet A-1",
    notes: "Corrosive — always use PPE. Used for pH adjustment in growth media preparation.",
    imageUrl: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=400&fit=crop",
    supplier: "Sigma-Aldrich",
    supplierCatalog: "S8045",
    lotNumber: "MKCL9574",
    dateReceived: "2025-03-15",
    storageTemp: "15–25°C",
    storageConditions: "Keep tightly sealed. Protect from moisture and CO₂.",
    safetyClass: "Corrosive (C)",
    ghs: ["GHS05", "GHS07"],
    sdsUrl: "#",
    usageRecords: [
      { date: "2026-02-01", user: "Dr. Chen", amountUsed: "50 mL", purpose: "Media pH adjustment" },
      { date: "2026-01-20", user: "Emily R.", amountUsed: "100 mL", purpose: "Buffer preparation" },
      { date: "2026-01-10", user: "Dr. Park", amountUsed: "25 mL", purpose: "Cleaning solution" },
    ],
  },
  "CH-002": {
    id: "CH-002",
    name: "Hydrochloric Acid (HCl)",
    cas: "7647-01-0",
    quantity: "1L",
    concentration: "12 M (37%)",
    molecularWeight: "36.46 g/mol",
    purity: "ACS Reagent Grade",
    expiry: "2026-02-18",
    daysLeft: 13,
    hazard: "high",
    location: "Acid Storage",
    notes: "Strong mineral acid. Used for pH lowering and glassware cleaning.",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop",
    supplier: "Fisher Scientific",
    supplierCatalog: "A144-500",
    lotNumber: "FS-20240812",
    dateReceived: "2024-08-20",
    storageTemp: "15–25°C",
    storageConditions: "Store in acid cabinet. Keep away from bases and oxidizers.",
    safetyClass: "Corrosive / Toxic",
    ghs: ["GHS05", "GHS07"],
    sdsUrl: "#",
    usageRecords: [
      { date: "2026-01-25", user: "Dr. Patel", amountUsed: "20 mL", purpose: "Acid wash of glassware" },
      { date: "2025-12-15", user: "Dr. Chen", amountUsed: "10 mL", purpose: "pH titration" },
    ],
  },
  "CH-003": {
    id: "CH-003",
    name: "Ethanol 95%",
    cas: "64-17-5",
    quantity: "5L",
    concentration: "95% v/v",
    molecularWeight: "46.07 g/mol",
    purity: "Analytical Grade",
    expiry: "2026-02-25",
    daysLeft: 20,
    hazard: "medium",
    location: "Flammable Cabinet",
    notes: "Highly flammable. Used for surface disinfection and RNA extraction protocols.",
    imageUrl: "https://images.unsplash.com/photo-1616711020004-4a85c872f1ee?w=800&h=400&fit=crop",
    supplier: "VWR International",
    supplierCatalog: "89125-170",
    lotNumber: "VWR-2025-0445",
    dateReceived: "2025-06-01",
    storageTemp: "15–25°C",
    storageConditions: "Flammable cabinet. Keep away from heat sources and ignition.",
    safetyClass: "Flammable Liquid (Category 2)",
    ghs: ["GHS02", "GHS07"],
    sdsUrl: "#",
    usageRecords: [
      { date: "2026-02-03", user: "Emily R.", amountUsed: "500 mL", purpose: "Laminar flow hood sterilization" },
      { date: "2026-01-28", user: "Dr. Park", amountUsed: "200 mL", purpose: "RNA extraction" },
    ],
  },
  "CH-004": {
    id: "CH-004",
    name: "Agar Powder",
    cas: "9002-18-0",
    quantity: "500g",
    concentration: "N/A (solid)",
    molecularWeight: "N/A (polymer)",
    purity: "Bacteriological Grade",
    expiry: "2026-12-15",
    daysLeft: 313,
    hazard: "low",
    location: "Dry Storage",
    notes: "Used for preparing solid growth media. Non-hazardous — standard lab practice applies.",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop",
    supplier: "BD Difco",
    supplierCatalog: "214010",
    lotNumber: "BD-2025-1120",
    dateReceived: "2025-01-10",
    storageTemp: "15–25°C",
    storageConditions: "Store in dry area. Keep container sealed to prevent moisture absorption.",
    safetyClass: "Non-hazardous",
    ghs: [],
    sdsUrl: "#",
    usageRecords: [
      { date: "2026-02-02", user: "Dr. Chen", amountUsed: "15 g", purpose: "MS agar plates preparation" },
      { date: "2026-01-15", user: "Emily R.", amountUsed: "30 g", purpose: "Batch culture media" },
    ],
  },
  "CH-005": {
    id: "CH-005",
    name: "Murashige-Skoog Medium",
    cas: "N/A",
    quantity: "1kg",
    concentration: "Full strength (4.43 g/L)",
    molecularWeight: "N/A (mixture)",
    purity: "Plant Cell Culture Grade",
    expiry: "2026-08-30",
    daysLeft: 206,
    hazard: "low",
    location: "Cold Room",
    notes: "Standard basal salt mixture for plant tissue culture. Store desiccated at 2–8°C.",
    imageUrl: "https://images.unsplash.com/photo-1578496781985-452d4a934d50?w=800&h=400&fit=crop",
    supplier: "PhytoTech Labs",
    supplierCatalog: "M519",
    lotNumber: "PT-2025-0901",
    dateReceived: "2025-09-05",
    storageTemp: "2–8°C",
    storageConditions: "Refrigerate. Keep desiccated and sealed. Protect from light.",
    safetyClass: "Non-hazardous",
    ghs: [],
    sdsUrl: "#",
    usageRecords: [
      { date: "2026-01-30", user: "Dr. Patel", amountUsed: "44 g", purpose: "10L MS media batch" },
      { date: "2026-01-10", user: "Dr. Chen", amountUsed: "22 g", purpose: "5L media prep for tissue culture" },
    ],
  },
  "CH-006": {
    id: "CH-006",
    name: "Phosphoric Acid",
    cas: "7664-38-2",
    quantity: "500mL",
    concentration: "85% w/w",
    molecularWeight: "98.00 g/mol",
    purity: "ACS Grade",
    expiry: "2026-01-05",
    daysLeft: -31,
    hazard: "high",
    location: "Acid Storage",
    notes: "EXPIRED — schedule for disposal. Previously used for phosphate buffer preparation.",
    imageUrl: "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?w=800&h=400&fit=crop",
    supplier: "Sigma-Aldrich",
    supplierCatalog: "W290017",
    lotNumber: "MKCQ4422",
    dateReceived: "2024-01-20",
    storageTemp: "15–25°C",
    storageConditions: "Acid storage cabinet. Incompatible with bases, metals, and organic materials.",
    safetyClass: "Corrosive (C)",
    ghs: ["GHS05"],
    sdsUrl: "#",
    usageRecords: [
      { date: "2025-11-30", user: "Dr. Park", amountUsed: "15 mL", purpose: "Phosphate buffer" },
    ],
  },
  "CH-007": {
    id: "CH-007",
    name: "Potassium Nitrate",
    cas: "7757-79-1",
    quantity: "2kg",
    concentration: "N/A (solid)",
    molecularWeight: "101.10 g/mol",
    purity: "≥ 99%",
    expiry: "2026-10-20",
    daysLeft: 257,
    hazard: "medium",
    location: "Chemical Store",
    notes: "Oxidizing agent. Used as a macronutrient source in custom hydroponic solutions.",
    imageUrl: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=800&h=400&fit=crop",
    supplier: "Merck Millipore",
    supplierCatalog: "1.05063",
    lotNumber: "MM-2025-0621",
    dateReceived: "2025-06-25",
    storageTemp: "15–25°C",
    storageConditions: "Keep away from combustible materials. Store in a cool, dry location.",
    safetyClass: "Oxidizer (Category 3)",
    ghs: ["GHS03", "GHS07"],
    sdsUrl: "#",
    usageRecords: [
      { date: "2026-01-18", user: "Emily R.", amountUsed: "200 g", purpose: "Hydroponic nutrient solution" },
      { date: "2025-12-05", user: "Dr. Patel", amountUsed: "150 g", purpose: "Custom fertilizer mix" },
    ],
  },
};

// ─── Equipment ──────────────────────────────────────────────────────────────

export interface EquipmentDetail {
  id: string;
  name: string;
  category: string;
  status: string;
  location: string;
  lastMaintenance: string;
  borrowedBy?: string;
  returnDate?: string;
  issue?: string;
  notes: string;
  imageUrl?: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  purchasePrice: string;
  currentValue: string;
  depreciationRate: string;
  warrantyExpiry: string;
  specifications: { label: string; value: string }[];
  maintenanceHistory: { date: string; type: string; technician: string; notes: string; cost: string }[];
  usageLog: { date: string; user: string; duration: string; purpose: string }[];
}

export const equipmentDetailData: Record<string, EquipmentDetail> = {
  "EQ-001": {
    id: "EQ-001",
    name: "Compound Microscope",
    category: "Optics",
    status: "Available",
    location: "Lab Room 1",
    lastMaintenance: "Jan 15, 2026",
    notes: "Primary teaching and research microscope. Oil immersion objective available.",
    imageUrl: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?w=800&h=400&fit=crop",
    manufacturer: "Olympus",
    model: "CX43",
    serialNumber: "OLY-CX43-2023-0047",
    purchaseDate: "2023-03-15",
    purchasePrice: "$4,200",
    currentValue: "$3,150",
    depreciationRate: "10% / year (straight-line)",
    warrantyExpiry: "2026-03-15",
    specifications: [
      { label: "Magnification", value: "4x / 10x / 40x / 100x (oil)" },
      { label: "Eyepiece", value: "10x widefield" },
      { label: "Illumination", value: "LED, adjustable" },
      { label: "Stage", value: "Mechanical, 76 × 52 mm" },
      { label: "Weight", value: "7.5 kg" },
    ],
    maintenanceHistory: [
      { date: "2026-01-15", type: "Routine", technician: "Lab Services Inc.", notes: "Lens cleaning, alignment check, LED bulb replaced", cost: "$120" },
      { date: "2025-07-10", type: "Routine", technician: "Lab Services Inc.", notes: "Full optical cleaning and calibration", cost: "$95" },
      { date: "2025-01-20", type: "Repair", technician: "Olympus Service", notes: "Stage mechanism repaired — sticky movement fixed", cost: "$280" },
    ],
    usageLog: [
      { date: "2026-02-05", user: "Emily R.", duration: "2h", purpose: "Cell morphology observation" },
      { date: "2026-02-03", user: "Dr. Chen", duration: "3h", purpose: "Pollen viability assessment" },
    ],
  },
  "EQ-002": {
    id: "EQ-002",
    name: "Autoclave (Large)",
    category: "Sterilization",
    status: "Borrowed",
    location: "Lab Room 2",
    lastMaintenance: "Dec 05, 2025",
    borrowedBy: "Dr. Park",
    returnDate: "Feb 10, 2026",
    notes: "Large-capacity vertical autoclave. Reserve at least 1 day in advance for batch sterilization.",
    imageUrl: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&h=400&fit=crop",
    manufacturer: "Tuttnauer",
    model: "3870ELV",
    serialNumber: "TUT-3870-2022-1103",
    purchaseDate: "2022-06-20",
    purchasePrice: "$12,500",
    currentValue: "$8,750",
    depreciationRate: "10% / year (straight-line)",
    warrantyExpiry: "2025-06-20",
    specifications: [
      { label: "Chamber Volume", value: "62 L" },
      { label: "Max Temperature", value: "135°C" },
      { label: "Max Pressure", value: "2.2 bar" },
      { label: "Cycle Time", value: "30–60 min" },
      { label: "Power", value: "3.5 kW, 220V" },
    ],
    maintenanceHistory: [
      { date: "2025-12-05", type: "Routine", technician: "Tuttnauer Service", notes: "Gasket replacement, pressure test, calibration", cost: "$350" },
      { date: "2025-06-15", type: "Routine", technician: "Tuttnauer Service", notes: "Annual safety inspection and certification", cost: "$200" },
    ],
    usageLog: [
      { date: "2026-02-04", user: "Dr. Park", duration: "4h", purpose: "Media sterilization (batch)" },
      { date: "2026-02-01", user: "Dr. Park", duration: "2h", purpose: "Glassware sterilization" },
    ],
  },
  "EQ-003": {
    id: "EQ-003",
    name: "pH Meter",
    category: "Measurement",
    status: "Available",
    location: "Chemistry Lab",
    lastMaintenance: "Dec 20, 2025",
    notes: "Benchtop pH meter with temperature compensation. Calibrate before each use session.",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&h=400&fit=crop",
    manufacturer: "Mettler Toledo",
    model: "FiveEasy F20",
    serialNumber: "MT-F20-2024-0892",
    purchaseDate: "2024-02-10",
    purchasePrice: "$850",
    currentValue: "$680",
    depreciationRate: "20% / year (accelerated)",
    warrantyExpiry: "2027-02-10",
    specifications: [
      { label: "pH Range", value: "0.00–14.00" },
      { label: "Resolution", value: "0.01 pH" },
      { label: "Accuracy", value: "±0.01 pH" },
      { label: "Temp Compensation", value: "0–100°C (auto)" },
      { label: "Display", value: "LCD backlit" },
    ],
    maintenanceHistory: [
      { date: "2025-12-20", type: "Calibration", technician: "In-house", notes: "3-point calibration (pH 4, 7, 10). Electrode in good condition.", cost: "$0" },
      { date: "2025-09-15", type: "Repair", technician: "MT Service", notes: "Electrode replaced — response time degraded", cost: "$120" },
    ],
    usageLog: [
      { date: "2026-02-05", user: "Dr. Patel", duration: "1h", purpose: "Media pH adjustment" },
      { date: "2026-02-04", user: "Emily R.", duration: "30min", purpose: "Buffer verification" },
    ],
  },
  "EQ-004": {
    id: "EQ-004",
    name: "Centrifuge (High-Speed)",
    category: "Processing",
    status: "Maintenance",
    location: "Service Dept",
    lastMaintenance: "Jan 05, 2026",
    issue: "Rotor replacement",
    notes: "High-speed refrigerated centrifuge. Currently out of service — awaiting replacement rotor from manufacturer.",
    imageUrl: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&h=400&fit=crop",
    manufacturer: "Beckman Coulter",
    model: "Avanti J-26XP",
    serialNumber: "BC-J26-2021-3371",
    purchaseDate: "2021-09-01",
    purchasePrice: "$28,000",
    currentValue: "$15,400",
    depreciationRate: "15% / year (accelerated)",
    warrantyExpiry: "2024-09-01",
    specifications: [
      { label: "Max Speed", value: "26,000 RPM" },
      { label: "Max RCF", value: "82,000 × g" },
      { label: "Temp Range", value: "-10°C to +40°C" },
      { label: "Rotor Capacity", value: "6 × 250 mL (JA-14)" },
      { label: "Weight", value: "272 kg" },
    ],
    maintenanceHistory: [
      { date: "2026-01-28", type: "Repair", technician: "BC Field Service", notes: "Rotor bearing failure detected. Replacement ordered (ETA: 2 weeks).", cost: "$2,400" },
      { date: "2025-08-10", type: "Routine", technician: "BC Field Service", notes: "Annual PM — vacuum system check, rotor inspection, software update", cost: "$450" },
    ],
    usageLog: [
      { date: "2026-01-25", user: "Dr. Chen", duration: "3h", purpose: "Protein extraction — cell pellet" },
    ],
  },
  "EQ-005": {
    id: "EQ-005",
    name: "Spectrophotometer",
    category: "Analysis",
    status: "Available",
    location: "Lab Room 1",
    lastMaintenance: "Jan 28, 2026",
    notes: "UV-Vis spectrophotometer for absorbance measurements. Supports cuvette and microplate reading.",
    imageUrl: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=400&fit=crop",
    manufacturer: "Thermo Fisher",
    model: "NanoDrop One",
    serialNumber: "TF-ND1-2023-5520",
    purchaseDate: "2023-07-01",
    purchasePrice: "$9,500",
    currentValue: "$7,125",
    depreciationRate: "10% / year (straight-line)",
    warrantyExpiry: "2026-07-01",
    specifications: [
      { label: "Wavelength Range", value: "190–850 nm" },
      { label: "Sample Size", value: "1–2 µL (pedestal)" },
      { label: "Path Length", value: "0.03–1 mm (auto)" },
      { label: "Absorbance Range", value: "0.02–300 (10 mm equiv.)" },
      { label: "Measurement Time", value: "< 5 seconds" },
    ],
    maintenanceHistory: [
      { date: "2026-01-28", type: "Calibration", technician: "In-house", notes: "Performance verification with NIST standards. Passed all checks.", cost: "$0" },
      { date: "2025-07-15", type: "Routine", technician: "Thermo Service", notes: "Pedestal resurfaced, firmware updated", cost: "$150" },
    ],
    usageLog: [
      { date: "2026-02-05", user: "Dr. Patel", duration: "1h", purpose: "DNA quantification" },
      { date: "2026-02-04", user: "Emily R.", duration: "2h", purpose: "Protein concentration assay (Bradford)" },
    ],
  },
  "EQ-006": {
    id: "EQ-006",
    name: "Laminar Flow Hood",
    category: "Sterile Work",
    status: "Borrowed",
    location: "Tissue Culture",
    lastMaintenance: "Dec 20, 2025",
    borrowedBy: "Emily Rodriguez",
    returnDate: "Feb 08, 2026",
    notes: "Class II biological safety cabinet. HEPA filtration. UV sterilization cycle before each use.",
    imageUrl: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&h=400&fit=crop",
    manufacturer: "Esco",
    model: "Airstream Class II A2",
    serialNumber: "ESCO-AC2-2022-0815",
    purchaseDate: "2022-04-10",
    purchasePrice: "$6,800",
    currentValue: "$4,760",
    depreciationRate: "10% / year (straight-line)",
    warrantyExpiry: "2025-04-10",
    specifications: [
      { label: "Work Area", value: "1200 mm × 600 mm" },
      { label: "HEPA Efficiency", value: "99.99% @ 0.3 µm" },
      { label: "Airflow", value: "0.45 m/s (downflow)" },
      { label: "UV Lamp", value: "30W germicidal" },
      { label: "Noise Level", value: "< 58 dBA" },
    ],
    maintenanceHistory: [
      { date: "2025-10-15", type: "Certification", technician: "BioSafe Services", notes: "Annual HEPA filter integrity test — PASSED. Airflow verified.", cost: "$250" },
      { date: "2025-04-20", type: "Routine", technician: "BioSafe Services", notes: "UV lamp replaced. Pre-filter cleaned.", cost: "$85" },
    ],
    usageLog: [
      { date: "2026-02-05", user: "Emily R.", duration: "5h", purpose: "Plant tissue culture subculturing" },
      { date: "2026-02-04", user: "Emily R.", duration: "3h", purpose: "Explant preparation" },
    ],
  },
  "EQ-007": {
    id: "EQ-007",
    name: "Growth Chamber",
    category: "Plant Growth",
    status: "Available",
    location: "Plant Lab",
    lastMaintenance: "Feb 01, 2026",
    notes: "Programmable plant growth chamber with independent light, temperature, and humidity control.",
    imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop",
    manufacturer: "Percival Scientific",
    model: "AR-66L3",
    serialNumber: "PS-AR66-2023-1209",
    purchaseDate: "2023-01-15",
    purchasePrice: "$18,500",
    currentValue: "$14,430",
    depreciationRate: "8% / year (straight-line)",
    warrantyExpiry: "2026-01-15",
    specifications: [
      { label: "Interior Volume", value: "566 L" },
      { label: "Temp Range", value: "4–45°C (±0.5°C)" },
      { label: "Humidity Range", value: "40–90% RH" },
      { label: "Light Intensity", value: "0–800 µmol/m²/s" },
      { label: "Shelves", value: "5 adjustable" },
    ],
    maintenanceHistory: [
      { date: "2026-02-01", type: "Routine", technician: "In-house", notes: "Temperature and humidity sensors calibrated. Lighting schedule verified.", cost: "$0" },
      { date: "2025-08-20", type: "Repair", technician: "Percival Service", notes: "Compressor refrigerant top-up. Cooling coil inspection.", cost: "$320" },
    ],
    usageLog: [
      { date: "2026-02-05", user: "Dr. Chen", duration: "Continuous", purpose: "Arabidopsis growth experiment" },
    ],
  },
  "EQ-008": {
    id: "EQ-008",
    name: "PCR Thermocycler",
    category: "Molecular Biology",
    status: "Available",
    location: "Molecular Lab",
    lastMaintenance: "Jan 10, 2026",
    notes: "Gradient-capable PCR thermocycler. 96-well block. Supports touchdown and stepdown protocols.",
    imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&h=400&fit=crop",
    manufacturer: "Bio-Rad",
    model: "T100",
    serialNumber: "BR-T100-2024-2847",
    purchaseDate: "2024-05-10",
    purchasePrice: "$4,900",
    currentValue: "$4,165",
    depreciationRate: "15% / year (accelerated)",
    warrantyExpiry: "2027-05-10",
    specifications: [
      { label: "Block Format", value: "96-well (0.2 mL)" },
      { label: "Temp Range", value: "4–100°C" },
      { label: "Ramp Rate", value: "3°C/s (max)" },
      { label: "Gradient Range", value: "1–24°C spread" },
      { label: "Weight", value: "10.5 kg" },
    ],
    maintenanceHistory: [
      { date: "2026-01-10", type: "Calibration", technician: "In-house", notes: "Block temperature uniformity verified. All wells within ±0.3°C.", cost: "$0" },
      { date: "2025-05-15", type: "Routine", technician: "Bio-Rad Service", notes: "Annual PM — lid mechanism lubricated, firmware updated", cost: "$100" },
    ],
    usageLog: [
      { date: "2026-02-05", user: "Dr. Patel", duration: "4h", purpose: "Genotyping PCR — 48 samples" },
      { date: "2026-02-03", user: "Emily R.", duration: "3h", purpose: "Colony PCR screening" },
    ],
  },
};

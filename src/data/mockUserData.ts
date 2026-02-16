// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA — User Profiles, Research Achievements
// ═══════════════════════════════════════════════════════════════════════════

import type { ResearchAchievement, UserProfile } from "@/types/user";

// ─── User Profiles ──────────────────────────────────────────────────────────

export const userProfilesData: UserProfile[] = [
  {
    id: "U-001",
    userCode: "U-001",
    name: "Dr. Sarah Chen",
    email: "sarah.chen@plantlab.edu",
    role: "Lab Manager",
    department: "Plant Biology",
    status: "Active",
    profileImageUrl: undefined,
    phone: "+855-12-345-678",
    bio: "Lead researcher specializing in plant tissue culture and genetic transformation. Over 10 years of experience in botanical research.",
    lastActive: "2026-02-16T08:30:00Z",
    createdAt: "2024-01-15",
  },
  {
    id: "U-002",
    userCode: "U-002",
    name: "Dr. James Wilson",
    email: "james.wilson@plantlab.edu",
    role: "Lab Manager",
    department: "Horticulture",
    status: "Active",
    profileImageUrl: undefined,
    phone: "+855-12-456-789",
    bio: "Expert in horticultural practices and plant breeding with focus on tropical crops.",
    lastActive: "2026-02-15T17:00:00Z",
    createdAt: "2024-03-01",
  },
  {
    id: "U-003",
    userCode: "U-003",
    name: "Dr. Mia Patel",
    email: "mia.patel@plantlab.edu",
    role: "Lab Assistant",
    department: "Crop Science",
    status: "Active",
    profileImageUrl: undefined,
    phone: "+855-12-567-890",
    bio: "Post-doctoral researcher in crop science, specializing in rice genomics and drought tolerance.",
    lastActive: "2026-02-16T09:00:00Z",
    createdAt: "2024-06-01",
  },
  {
    id: "U-004",
    userCode: "U-004",
    name: "Alex Thompson",
    email: "alex.thompson@plantlab.edu",
    role: "Lab Assistant",
    department: "Plant Biology",
    status: "Active",
    profileImageUrl: undefined,
    phone: "+855-12-678-901",
    bio: "Lab technician responsible for inventory management and equipment maintenance.",
    lastActive: "2026-02-14T16:30:00Z",
    createdAt: "2024-09-15",
  },
  {
    id: "U-005",
    userCode: "U-005",
    name: "Admin User",
    email: "admin@plantlab.edu",
    role: "Admin",
    department: "Administration",
    status: "Active",
    profileImageUrl: undefined,
    phone: "+855-12-789-012",
    bio: "System administrator for Plant Lap Laboratory.",
    lastActive: "2026-02-16T07:00:00Z",
    createdAt: "2024-01-01",
  },
];

// ─── Simulated Current User (for RBAC demo) ────────────────────────────────
export const currentUser: UserProfile = userProfilesData[0]; // Dr. Sarah Chen (Lab Manager)

// ─── Research Achievements ──────────────────────────────────────────────────

export const researchAchievementsData: ResearchAchievement[] = [
  {
    id: "ACH-001",
    achievementCode: "ACH-001",
    userId: "U-001",
    userName: "Dr. Sarah Chen",
    title: "Novel Tissue Culture Protocol for Cambodian Rice Varieties",
    description:
      "Published a new protocol that increases propagation success rate by 35% for local rice varieties using modified MS medium.",
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
    documentLink: "https://drive.google.com/file/example1",
    achievementDate: "2025-08-15",
    status: "Published",
    createdAt: "2025-08-15",
  },
  {
    id: "ACH-002",
    achievementCode: "ACH-002",
    userId: "U-001",
    userName: "Dr. Sarah Chen",
    title: "Disease Resistance Mapping in Solanum lycopersicum",
    description:
      "Identified key gene markers for late blight resistance in local tomato cultivars through cross-breeding experiments.",
    imageUrl: undefined,
    documentLink: "https://drive.google.com/file/example2",
    achievementDate: "2025-11-20",
    status: "Published",
    createdAt: "2025-11-20",
  },
  {
    id: "ACH-003",
    achievementCode: "ACH-003",
    userId: "U-002",
    userName: "Dr. James Wilson",
    title: "Tropical Wheat Adaptation Trial Results",
    description:
      "Completed first successful trial of heat-tolerant wheat varieties under Cambodian tropical conditions.",
    imageUrl: undefined,
    documentLink: "https://drive.google.com/file/example3",
    achievementDate: "2026-01-10",
    status: "Published",
    createdAt: "2026-01-10",
  },
  {
    id: "ACH-004",
    achievementCode: "ACH-004",
    userId: "U-003",
    userName: "Dr. Mia Patel",
    title: "Drought Tolerance Screening in Cambodian Rice",
    description:
      "Screening 50 local rice accessions for drought tolerance using controlled stress conditions. Preliminary results show 8 promising candidates.",
    imageUrl: undefined,
    documentLink: undefined,
    achievementDate: "2026-02-01",
    status: "Draft",
    createdAt: "2026-02-01",
  },
  {
    id: "ACH-005",
    achievementCode: "ACH-005",
    userId: "U-001",
    userName: "Dr. Sarah Chen",
    title: "Lab Equipment Optimization Study",
    description:
      "Documented best practices for maximizing growth chamber utilization in the lab, resulting in 20% resource savings.",
    imageUrl: undefined,
    documentLink: undefined,
    achievementDate: "2026-02-10",
    status: "Draft",
    createdAt: "2026-02-10",
  },
];

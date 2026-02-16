// ═══════════════════════════════════════════════════════════════════════════
// USER MODULE — TypeScript Interfaces
// ═══════════════════════════════════════════════════════════════════════════

// ─── User Roles (RBAC) ─────────────────────────────────────────────────────
export type UserRole = "Admin" | "Lab Manager" | "Lab Assistant";
export type AchievementStatus = "Draft" | "Published";

// ─── Role Permission Map ────────────────────────────────────────────────────
export interface RolePermissions {
  canManageUsers: boolean;
  canManageRoles: boolean;
  canManageSystemSettings: boolean;
  canDeleteAnyData: boolean;
  canAccessInventory: boolean;
  canAccessBusiness: boolean;
  canAccessResearch: boolean;
  canInputInventory: boolean;
  canUpdateChemicalQuantity: boolean;
  canCreateLabService: boolean;
  canDeleteSpecies: boolean;
  canViewAllAchievements: boolean;
  canManageOwnAchievements: boolean;
  canManageOwnProfile: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  Admin: {
    canManageUsers: true,
    canManageRoles: true,
    canManageSystemSettings: true,
    canDeleteAnyData: true,
    canAccessInventory: true,
    canAccessBusiness: true,
    canAccessResearch: true,
    canInputInventory: true,
    canUpdateChemicalQuantity: true,
    canCreateLabService: true,
    canDeleteSpecies: true,
    canViewAllAchievements: true,
    canManageOwnAchievements: true,
    canManageOwnProfile: true,
  },
  "Lab Manager": {
    canManageUsers: false,
    canManageRoles: false,
    canManageSystemSettings: false,
    canDeleteAnyData: false,
    canAccessInventory: true,
    canAccessBusiness: true,
    canAccessResearch: true,
    canInputInventory: true,
    canUpdateChemicalQuantity: true,
    canCreateLabService: true,
    canDeleteSpecies: false,
    canViewAllAchievements: true,
    canManageOwnAchievements: true,
    canManageOwnProfile: true,
  },
  "Lab Assistant": {
    canManageUsers: false,
    canManageRoles: false,
    canManageSystemSettings: false,
    canDeleteAnyData: false,
    canAccessInventory: true,
    canAccessBusiness: false,
    canAccessResearch: false,
    canInputInventory: true,
    canUpdateChemicalQuantity: true,
    canCreateLabService: true,
    canDeleteSpecies: false,
    canViewAllAchievements: false,
    canManageOwnAchievements: true,
    canManageOwnProfile: true,
  },
};

// ─── User Profile ───────────────────────────────────────────────────────────
export interface UserProfile {
  id: string;
  userCode: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: "Active" | "Inactive";
  profileImageUrl?: string;
  phone?: string;
  bio?: string;
  lastActive?: string;
  createdAt: string;
}

// ─── Research Achievement ──────────────────────────────────────────────────
export interface ResearchAchievement {
  id: string;
  achievementCode: string;
  userId: string;
  userName?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  documentLink?: string;
  achievementDate: string;
  status: AchievementStatus;
  createdAt: string;
}

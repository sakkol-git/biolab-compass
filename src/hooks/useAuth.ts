/* ═══════════════════════════════════════════════════════════════════════════
 * useAuth — Authentication and RBAC hook.
 *
 * Provides current user info and permission checking.
 * In production, this would integrate with a real auth backend.
 * For now, it uses mock data to simulate the RBAC system.
 * ═══════════════════════════════════════════════════════════════════════════ */

import { currentUser } from "@/data/mockUserData";
import {
    ROLE_PERMISSIONS,
    type RolePermissions,
    type UserProfile,
    type UserRole,
} from "@/types/user";
import { useMemo } from "react";

export function useAuth() {
  const user: UserProfile = currentUser;

  const permissions: RolePermissions = useMemo(
    () => ROLE_PERMISSIONS[user.role],
    [user.role],
  );

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission] ?? false;
  };

  const isRole = (role: UserRole): boolean => {
    return user.role === role;
  };

  const isOwner = (resourceUserId: string): boolean => {
    return user.id === resourceUserId;
  };

  return {
    user,
    permissions,
    hasPermission,
    isRole,
    isOwner,
  } as const;
}

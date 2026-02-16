/* ═══════════════════════════════════════════════════════════════════════════
 * PermissionGate — Conditionally render children based on RBAC permissions.
 *
 * Addresses: BL-003 (RBAC permissions not enforced in UI)
 *
 * Usage:
 *   <PermissionGate permission="canDeleteSpecies">
 *     <DeleteButton />
 *   </PermissionGate>
 *
 *   <PermissionGate permission="canDeleteSpecies" fallback={<DisabledButton />}>
 *     <DeleteButton />
 *   </PermissionGate>
 * ═══════════════════════════════════════════════════════════════════════════ */

import { useAuth } from "@/hooks/useAuth";
import type { RolePermissions } from "@/types/user";
import type { ReactNode } from "react";

interface PermissionGateProps {
  /** The permission key to check */
  permission: keyof RolePermissions;
  /** Content to render when user has permission */
  children: ReactNode;
  /** Optional fallback when user lacks permission (defaults to nothing) */
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission } = useAuth();

  if (hasPermission(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

// ─── OwnerOrPermissionGate ──────────────────────────────────────────────────
// Show content if user owns the resource OR has the specified permission.

interface OwnerOrPermissionGateProps {
  permission: keyof RolePermissions;
  resourceOwnerId: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function OwnerOrPermissionGate({
  permission,
  resourceOwnerId,
  children,
  fallback = null,
}: OwnerOrPermissionGateProps) {
  const { hasPermission, isOwner } = useAuth();

  if (hasPermission(permission) || isOwner(resourceOwnerId)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

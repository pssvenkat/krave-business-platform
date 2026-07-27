/**
 * RBAC – Role-Based Access Control
 *
 * Defines role hierarchy and permission checks for all admin operations.
 * Used in middleware and API route handlers.
 *
 * Roles (highest → lowest privilege):
 * 1. super_admin – Full access, can manage other admins
 * 2. admin       – Can manage webinars, registrations, CRM, data export
 * 3. viewer      – Read-only access to all data
 *
 * @module auth/rbac
 */
import type { UserRole } from "@krave/types";

// ─── Role Hierarchy ───────────────────────────────────────────────────────

const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 3,
  admin: 2,
  viewer: 1,
};

/**
 * Returns true if the given role meets or exceeds the required minimum role.
 *
 * @example
 * hasMinimumRole("admin", "viewer") → true
 * hasMinimumRole("viewer", "admin") → false
 */
export function hasMinimumRole(
  userRole: UserRole,
  requiredRole: UserRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

// ─── Permission Definitions ───────────────────────────────────────────────

export type Permission =
  // Webinar permissions
  | "webinars:read"
  | "webinars:create"
  | "webinars:update"
  | "webinars:delete"
  // Registration permissions
  | "registrations:read"
  | "registrations:delete"
  | "registrations:export"
  // CRM permissions
  | "crm:read"
  | "crm:write"
  | "crm:export"
  // Attendance permissions
  | "attendance:read"
  | "attendance:mark"
  // User/Admin management
  | "admin_users:read"
  | "admin_users:create"
  | "admin_users:delete"
  // Audit log permissions
  | "audit_logs:read"
  // Analytics permissions
  | "analytics:read";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  super_admin: [
    "webinars:read",
    "webinars:create",
    "webinars:update",
    "webinars:delete",
    "registrations:read",
    "registrations:delete",
    "registrations:export",
    "crm:read",
    "crm:write",
    "crm:export",
    "attendance:read",
    "attendance:mark",
    "admin_users:read",
    "admin_users:create",
    "admin_users:delete",
    "audit_logs:read",
    "analytics:read",
  ],
  admin: [
    "webinars:read",
    "webinars:create",
    "webinars:update",
    "registrations:read",
    "registrations:export",
    "crm:read",
    "crm:write",
    "attendance:read",
    "attendance:mark",
    "admin_users:read",
    "analytics:read",
  ],
  viewer: [
    "webinars:read",
    "registrations:read",
    "crm:read",
    "attendance:read",
    "analytics:read",
  ],
};

/**
 * Checks if a role has a specific permission.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Checks if a role has ALL of the specified permissions.
 */
export function hasAllPermissions(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Checks if a role has ANY of the specified permissions.
 */
export function hasAnyPermission(
  role: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Returns all permissions for a given role.
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

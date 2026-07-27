/**
 * @krave/auth
 * Public API for the auth package.
 */

// Middleware helper
export { updateSession, type MiddlewareConfig } from "./middleware";

// RBAC
export {
  hasMinimumRole,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getPermissionsForRole,
  type Permission,
} from "./rbac";

// Session utilities
export {
  getCurrentUser,
  getAdminRole,
  requireAuth,
  requireAdminRole,
} from "./session";

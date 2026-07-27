/**
 * @krave/utils
 * Public API for the utils package.
 */

// Encryption
export {
  encrypt,
  decrypt,
  encryptOptional,
  decryptOptional,
  generateSecureKey,
} from "./crypto";

// Hashing
export { createHash, hashEmail, hashPhone, verifyHash } from "./hash";

// Formatting
export {
  formatDate,
  formatDateShort,
  formatDateTime,
  formatISODate,
  formatRelativeTime,
  formatCountdown,
  formatPhone,
  normalizePhone,
  formatFullName,
  formatInitials,
  formatNumber,
  formatPercent,
  truncate,
  slugify,
} from "./format";

// className utility
export { cn } from "./cn";

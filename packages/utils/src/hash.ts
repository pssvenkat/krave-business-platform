/**
 * HMAC-SHA256 Deterministic Hashing Utility
 *
 * Used for creating searchable, deterministic hashes of sensitive fields:
 * - Email addresses
 * - Phone numbers
 *
 * Purpose:
 * - Duplicate detection during registration
 * - O(1) CRM lookups without exposing raw values
 * - Cross-webinar tracking without decryption
 *
 * The HMAC secret MUST:
 * - Come from the HMAC_SECRET environment variable
 * - Be different from the encryption key (ENCRYPTION_SECRET)
 * - Never be logged, stored in code, or exposed to clients
 *
 * NEVER expose hashes to the frontend or include them in API responses.
 *
 * @module hash
 */

const ALGORITHM = { name: "HMAC", hash: "SHA-256" };

/**
 * Derives an HMAC CryptoKey from a hex-encoded secret.
 */
async function deriveHmacKey(hexSecret: string): Promise<CryptoKey> {
  if (!hexSecret || hexSecret.length < 32) {
    throw new Error(
      "HMAC_SECRET must be at least a 32-character hex string (16 bytes)"
    );
  }

  const keyBytes = new Uint8Array(
    hexSecret.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  return crypto.subtle.importKey("raw", keyBytes, ALGORITHM, false, ["sign"]);
}

/**
 * Creates a deterministic HMAC-SHA256 hash of the input value.
 *
 * - Input is normalized (trimmed, lowercased) for consistency
 * - Output is a 64-character hex string
 * - Same input + same secret = same output (deterministic)
 * - Computationally infeasible to reverse without the secret
 *
 * @param value - The value to hash (email, phone number)
 * @param hexSecret - The HMAC secret from environment variables
 * @returns 64-character hex HMAC-SHA256 hash
 */
export async function createHash(
  value: string,
  hexSecret: string
): Promise<string> {
  const key = await deriveHmacKey(hexSecret);
  const normalized = value.trim().toLowerCase();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);

  const signature = await crypto.subtle.sign(ALGORITHM.name, key, data);
  const hashArray = new Uint8Array(signature);

  return Array.from(hashArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Creates a hash for an email address.
 * Emails are normalized to lowercase before hashing.
 *
 * @param email - The email address to hash
 * @param hexSecret - HMAC_SECRET from environment variables
 */
export async function hashEmail(
  email: string,
  hexSecret: string
): Promise<string> {
  return createHash(email.toLowerCase().trim(), hexSecret);
}

/**
 * Creates a hash for a phone number.
 * Phone numbers are normalized: strips all non-digit characters.
 *
 * @param phone - The phone number to hash
 * @param hexSecret - HMAC_SECRET from environment variables
 */
export async function hashPhone(
  phone: string,
  hexSecret: string
): Promise<string> {
  const normalized = phone.replace(/\D/g, "");
  return createHash(normalized, hexSecret);
}

/**
 * Checks if a value matches a stored hash.
 *
 * @param value - The plaintext value to check
 * @param storedHash - The hash stored in the database
 * @param hexSecret - HMAC_SECRET from environment variables
 * @returns true if the value matches the hash
 */
export async function verifyHash(
  value: string,
  storedHash: string,
  hexSecret: string
): Promise<boolean> {
  const computedHash = await createHash(value, hexSecret);
  // Constant-time comparison to prevent timing attacks
  if (computedHash.length !== storedHash.length) return false;
  let mismatch = 0;
  for (let i = 0; i < computedHash.length; i++) {
    mismatch |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return mismatch === 0;
}

/**
 * AES-256-GCM Encryption Utility
 *
 * Used for encrypting sensitive data such as:
 * - Internal CRM notes
 * - Remarks and addresses
 * - Future payment references
 *
 * Keys MUST be stored in environment variables only.
 * Never log or expose keys or IVs in plaintext.
 *
 * @module crypto
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256; // bits
const IV_LENGTH = 12; // bytes (96-bit IV recommended for GCM)
const TAG_LENGTH = 128; // bits (GCM auth tag)

/**
 * Derives a CryptoKey from a hex-encoded 32-byte secret.
 * The secret MUST come from an environment variable.
 */
async function deriveKey(hexSecret: string): Promise<CryptoKey> {
  if (!hexSecret || hexSecret.length !== 64) {
    throw new Error(
      "ENCRYPTION_SECRET must be a 64-character hex string (32 bytes)"
    );
  }

  const keyBytes = new Uint8Array(
    hexSecret.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  return crypto.subtle.importKey("raw", keyBytes, { name: ALGORITHM }, false, [
    "encrypt",
    "decrypt",
  ]);
}

/**
 * Encrypts plaintext using AES-256-GCM with a random IV.
 *
 * Output format: `${iv_hex}:${ciphertext_hex}`
 * The IV is stored alongside the ciphertext and is NOT secret.
 *
 * @param plaintext - The text to encrypt
 * @param hexSecret - 64-char hex encryption key from env
 * @returns Encrypted string in format `iv:ciphertext`
 */
export async function encrypt(
  plaintext: string,
  hexSecret: string
): Promise<string> {
  const key = await deriveKey(hexSecret);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    data
  );

  const encryptedArray = new Uint8Array(encryptedBuffer);
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const ciphertextHex = Array.from(encryptedArray)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${ivHex}:${ciphertextHex}`;
}

/**
 * Decrypts an encrypted string produced by `encrypt()`.
 *
 * @param encrypted - Encrypted string in format `iv:ciphertext`
 * @param hexSecret - 64-char hex encryption key from env
 * @returns Decrypted plaintext
 */
export async function decrypt(
  encrypted: string,
  hexSecret: string
): Promise<string> {
  const [ivHex, ciphertextHex] = encrypted.split(":");

  if (!ivHex || !ciphertextHex) {
    throw new Error("Invalid encrypted string format");
  }

  const key = await deriveKey(hexSecret);

  const iv = new Uint8Array(
    ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  const ciphertext = new Uint8Array(
    ciphertextHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv, tagLength: TAG_LENGTH },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Encrypts a value only if it's non-null/non-empty.
 * Returns null for null/empty input.
 */
export async function encryptOptional(
  value: string | null | undefined,
  hexSecret: string
): Promise<string | null> {
  if (!value || value.trim() === "") return null;
  return encrypt(value, hexSecret);
}

/**
 * Decrypts a value only if it's non-null.
 * Returns null for null input.
 */
export async function decryptOptional(
  encrypted: string | null | undefined,
  hexSecret: string
): Promise<string | null> {
  if (!encrypted) return null;
  return decrypt(encrypted, hexSecret);
}

/**
 * Generates a cryptographically secure random hex string.
 * Useful for generating encryption keys in setup scripts.
 *
 * @param bytes - Number of random bytes (default 32 = 256-bit key)
 * @returns Hex string of length `bytes * 2`
 */
export function generateSecureKey(bytes = 32): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

export interface CipherConfig {
  key: string;
  salt?: string;
}

/**
 * Creates a cipher instance for encrypting/decrypting string fields.
 * Pure module - no external dependencies except Node crypto.
 */
export function createCipher(config: CipherConfig) {
  const salt = config.salt ?? "prisma-field-encryption";
  const keyBuffer = scryptSync(config.key, salt, KEY_LENGTH);

  return {
    encrypt(plaintext: string): string {
      const iv = randomBytes(IV_LENGTH);
      const cipher = createCipheriv(ALGORITHM, keyBuffer, iv);
      const encrypted = Buffer.concat([
        cipher.update(plaintext, "utf8"),
        cipher.final(),
      ]);
      const authTag = cipher.getAuthTag();
      return Buffer.concat([iv, authTag, encrypted]).toString("base64");
    },

    decrypt(ciphertext: string): string {
      const buf = Buffer.from(ciphertext, "base64");
      const iv = buf.subarray(0, IV_LENGTH);
      const authTag = buf.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
      const encrypted = buf.subarray(IV_LENGTH + AUTH_TAG_LENGTH);
      const decipher = createDecipheriv(ALGORITHM, keyBuffer, iv);
      decipher.setAuthTag(authTag);
      return (
        decipher.update(encrypted).toString("utf8") + decipher.final("utf8")
      );
    },

    tryDecrypt(value: string): string {
      try {
        const buf = Buffer.from(value, "base64");
        if (buf.length < IV_LENGTH + AUTH_TAG_LENGTH) return value;
        return this.decrypt(value);
      } catch {
        return value;
      }
    },
  };
}

export type Cipher = ReturnType<typeof createCipher>;

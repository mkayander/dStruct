import type { Cipher } from "./cipher";

/** Describes which field of which model should be encrypted. */
export interface EncryptedField {
  /** Prisma model name in PascalCase (e.g. "LeetCodeUser"). */
  model: string;
  /** Field name to encrypt (e.g. "token"). */
  field: string;
}

/** Configuration for the field encryption Prisma extension. */
export interface FieldEncryptionConfig {
  /** Encryption key (e.g. from env). Ignored if cipher is provided. */
  key: string;
  /** Optional salt for key derivation. Defaults to "prisma-field-encryption". */
  salt?: string;
  /** List of model.field pairs to encrypt. */
  fields: readonly EncryptedField[];
  /** Optional: inject custom cipher (e.g. for testing). Takes precedence over key. */
  cipher?: Encryptor;
}

/** Abstraction for encrypt/decrypt - allows swapping implementations (e.g. for testing). */
export interface Encryptor {
  encrypt(plaintext: string): string;
  tryDecrypt(value: string): string;
}

/** Internal: extension receives a cipher, not raw config. */
export interface ExtensionDeps {
  cipher: Cipher;
  fields: readonly EncryptedField[];
}

/**
 * Prisma field encryption - config-driven, library-ready.
 *
 * Usage:
 * ```ts
 * import { createFieldEncryptionExtension } from "#/server/db/encryption";
 *
 * const db = prisma.$extends(createFieldEncryptionExtension({
 *   key: process.env.ENCRYPTION_KEY!,
 *   fields: [{ model: "LeetCodeUser", field: "token" }],
 * }));
 * ```
 *
 * To extract as a library: copy the `encryption/` folder and ensure
 * @prisma/client is a peerDependency.
 */
export { createCipher } from "./cipher";
export type { Cipher, CipherConfig } from "./cipher";
export { createFieldEncryptionExtension } from "./extension";
export type { EncryptedField, Encryptor, FieldEncryptionConfig } from "./types";

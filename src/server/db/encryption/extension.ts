import { Prisma } from "@prisma/client/extension";

import { createCipher } from "./cipher";
import type { Encryptor } from "./types";
import type { EncryptedField, FieldEncryptionConfig } from "./types";

/** PascalCase -> camelCase for Prisma client API. */
function toPrismaModelName(model: string): string {
  return model.charAt(0).toLowerCase() + model.slice(1);
}

/** Groups fields by model for write-path. Returns modelKey -> fields to encrypt. */
function groupFieldsByModel(
  fields: readonly EncryptedField[],
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>();
  for (const { model, field } of fields) {
    const key = toPrismaModelName(model);
    let set = map.get(key);
    if (!set) {
      set = new Set();
      map.set(key, set);
    }
    set.add(field);
  }
  return map;
}

/** All field names that are encrypted (for nested decrypt). tryDecrypt is no-op on plaintext. */
function allEncryptedFieldNames(
  fields: readonly EncryptedField[],
): Set<string> {
  return new Set(fields.map((f) => f.field));
}

function createModelHandlers(
  encryptFields: Set<string>,
  decryptFields: Set<string>,
  cipher: Encryptor,
) {
  const encryptInData = (
    data: Record<string, unknown> | null | undefined,
  ): void => {
    if (!data || typeof data !== "object") return;
    for (const field of encryptFields) {
      const v = data[field];
      if (typeof v === "string") data[field] = cipher.encrypt(v);
    }
  };

  const decryptInResult = <T>(value: T): T => {
    if (value == null) return value;
    if (Array.isArray(value)) return value.map(decryptInResult) as T;
    if (typeof value !== "object" || value instanceof Date) return value;

    const obj = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      result[k] =
        decryptFields.has(k) && typeof v === "string" && v
          ? cipher.tryDecrypt(v)
          : decryptInResult(v);
    }
    return result as T;
  };

  type Params = {
    args: Record<string, unknown>;
    query: (args: unknown) => Promise<unknown>;
  };

  return {
    async create({ args, query }: Params) {
      encryptInData(args.data as Record<string, unknown>);
      return decryptInResult(await query(args));
    },
    async createMany({ args, query }: Params) {
      const data = args.data;
      if (Array.isArray(data)) {
        for (const row of data) {
          if (row && typeof row === "object")
            encryptInData(row as Record<string, unknown>);
        }
      }
      return query(args);
    },
    async update({ args, query }: Params) {
      encryptInData(args.data as Record<string, unknown>);
      return decryptInResult(await query(args));
    },
    async updateMany({ args, query }: Params) {
      encryptInData(args.data as Record<string, unknown>);
      return query(args);
    },
    async upsert({ args, query }: Params) {
      encryptInData(args.create as Record<string, unknown>);
      encryptInData(args.update as Record<string, unknown>);
      return decryptInResult(await query(args));
    },
    async $allOperations({ args, query }: Params) {
      const result = await query(args);
      return decryptInResult(result);
    },
  };
}

/**
 * Creates a Prisma extension that transparently encrypts/decrypts specified string fields.
 *
 * @example
 * ```ts
 * const db = prisma.$extends(createFieldEncryptionExtension({
 *   key: process.env.ENCRYPTION_KEY!,
 *   fields: [
 *     { model: "LeetCodeUser", field: "token" },
 *     { model: "User", field: "ssn" },
 *   ],
 * }));
 * ```
 */
export function createFieldEncryptionExtension(config: FieldEncryptionConfig) {
  if (!config.fields?.length) {
    throw new Error("Field encryption requires at least one field");
  }

  const cipher: Encryptor =
    config.cipher ??
    (() => {
      if (!config.key) {
        throw new Error("Field encryption requires key or cipher");
      }
      return createCipher({ key: config.key, salt: config.salt });
    })();
  const fieldsByModel = groupFieldsByModel(config.fields);
  const decryptFields = allEncryptedFieldNames(config.fields);

  const query: Record<string, ReturnType<typeof createModelHandlers>> = {};
  for (const [modelKey, encryptFields] of fieldsByModel) {
    query[modelKey] = createModelHandlers(encryptFields, decryptFields, cipher);
  }

  return Prisma.defineExtension({
    name: "field-encryption",
    // Prisma's query expects model-specific callback types; our generic handlers are compatible at runtime
    query: query as Parameters<typeof Prisma.defineExtension>[0] extends {
      query?: infer Q;
    }
      ? Q
      : never,
  });
}

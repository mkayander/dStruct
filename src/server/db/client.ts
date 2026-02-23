import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "#/env/server.mjs";
import { createDateSerializationExtension } from "#/server/db/dateSerialization";
import { createFieldEncryptionExtension } from "#/server/db/encryption";
import { PrismaClient } from "#/server/db/generated/client";

const isProduction = env.NODE_ENV === "production";

declare global {
  var db: ReturnType<typeof makeClient> | undefined;
}

const ENCRYPTED_FIELDS = [{ model: "LeetCodeUser", field: "token" }] as const;

const makeClient = () => {
  if (!env.PRISMA_FIELD_ENCRYPTION_KEY) {
    throw new Error("PRISMA_FIELD_ENCRYPTION_KEY is not set");
  }

  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  const baseClient = new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  return baseClient.$extends(createDateSerializationExtension()).$extends(
    createFieldEncryptionExtension({
      fields: ENCRYPTED_FIELDS,
      key: env.PRISMA_FIELD_ENCRYPTION_KEY,
    }),
  );
};

const db = global.db || makeClient();

if (!isProduction) {
  global.db = db;
}

export { db };

export type AppPrismaClient = typeof db;

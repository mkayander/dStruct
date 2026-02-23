import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "#/env/server.mjs";
import { createDateSerializationExtension } from "#/server/db/dateSerialization";
import { PrismaClient } from "#/server/db/generated/client";

// import { createFieldEncryptionExtension } from "#/server/db/encryption";

const isProduction = env.NODE_ENV === "production";

declare global {
  var db: ReturnType<typeof makeClient> | undefined;
}

// const ENCRYPTED_FIELDS = [{ model: "LeetCodeUser", field: "token" }] as const;

const makeClient = () => {
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
  const baseClient = new PrismaClient({
    adapter,
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  return baseClient.$extends(createDateSerializationExtension());
};

const db = global.db || makeClient();

if (!isProduction) {
  global.db = db;
}

export { db };

export type AppPrismaClient = typeof db;

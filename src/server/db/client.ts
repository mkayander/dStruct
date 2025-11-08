import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { fieldEncryptionExtension } from "prisma-field-encryption";

import { env } from "#/env/server.mjs";

const isProduction = env.NODE_ENV === "production";

declare global {
  var db: ReturnType<typeof makeClient> | undefined;
}

const makeClient = () => {
  const client = new PrismaClient({
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  return client.$extends(withAccelerate()).$extends(fieldEncryptionExtension());
};

const db = global.db || makeClient();

if (!isProduction) {
  global.db = db;
}

export { db };

export type AppPrismaClient = typeof db;

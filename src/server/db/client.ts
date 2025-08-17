import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { fieldEncryptionMiddleware } from "prisma-field-encryption";

import { env } from "#/env/server.mjs";

const isProduction = env.NODE_ENV === "production";

declare global {
  // eslint-disable-next-line no-var
  var db: ReturnType<typeof makeClient> | undefined;
}

const makeClient = () => {
  const client = new PrismaClient({
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  client.$use(fieldEncryptionMiddleware());

  return client.$extends(withAccelerate());
};

const db = global.db || makeClient();

if (!isProduction) {
  global.db = db;
}

export { db };

export type AppPrismaClient = typeof db;

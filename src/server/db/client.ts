import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { fieldEncryptionMiddleware } from "prisma-field-encryption";

import { env } from "#/env/server.mjs";

const isProduction = env.NODE_ENV === "production";

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof makeClient> | undefined;
}

const makeClient = () => {
  const client = new PrismaClient({
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

  client.$use(fieldEncryptionMiddleware());

  return client.$extends(withAccelerate());
};

const prisma = global.prisma || makeClient();

if (!isProduction) {
  global.prisma = prisma;
}

export { prisma };

export type AppPrismaClient = typeof prisma;

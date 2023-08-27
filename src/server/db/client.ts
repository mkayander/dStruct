import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import { fieldEncryptionMiddleware } from "prisma-field-encryption";

import { env } from "#/env/server.mjs";

const isProduction = env.NODE_ENV === "production";

// declare global {
// eslint-disable-next-line no-var
// var prisma: PrismaClient | undefined;
// }

const prismaBase =
  // global.prisma ||
  new PrismaClient({
    log: isProduction ? ["error"] : ["query", "error", "warn"],
  });

prismaBase.$use(fieldEncryptionMiddleware());

const prisma = prismaBase.$extends(withAccelerate());

// if (env.NODE_ENV !== "production") {
//   global.prisma = prisma;
// }

export { prisma };

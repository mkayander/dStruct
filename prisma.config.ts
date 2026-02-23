import "dotenv/config";
import type { PrismaConfig } from "prisma";
import { env } from "prisma/config";

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prefer direct URL for CLI (migrate, studio) when using a connection pooler; app uses DATABASE_URL at runtime
    url: process.env.DIRECT_DATABASE_URL ?? env("DATABASE_URL"),
  },
} satisfies PrismaConfig;

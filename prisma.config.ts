import "dotenv/config";
import type { PrismaConfig } from "prisma";

/** Matches AGENTS.md / Cursor Cloud local PostgreSQL defaults; used only when env is unset (e.g. postinstall). */
const DEFAULT_LOCAL_DATABASE_URL =
  "postgresql://dstruct:dstruct@localhost:5432/dstruct";

export default {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Prefer direct URL for CLI (migrate, studio) when using a connection pooler; app uses DATABASE_URL at runtime
    url:
      process.env.DIRECT_DATABASE_URL ??
      process.env.DATABASE_URL ??
      DEFAULT_LOCAL_DATABASE_URL,
  },
} satisfies PrismaConfig;

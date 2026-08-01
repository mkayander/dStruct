/**
 * Vercel (and some CI caches) can restore `node_modules` without running the
 * root `postinstall` again, while gitignored codegen output stays absent — then
 * `next build` fails on `#/graphql/generated` (GraphQL codegen) or
 * `#/server/db/generated/*` (the Prisma client).
 *
 * Cheap no-op when the artifacts already exist; otherwise regenerates them.
 */
import { execSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();

const ensureGenerated = (
  label: string,
  sentinelPath: string,
  command: string,
  outputDir?: string,
): void => {
  if (existsSync(sentinelPath)) {
    console.log(
      `[ensure-generated-from-install] ${label} output present; skipping.`,
    );
    return;
  }

  if (outputDir && existsSync(outputDir)) {
    console.warn(
      `[ensure-generated-from-install] Removing stale ${label} output at ${outputDir}…`,
    );
    rmSync(outputDir, { recursive: true, force: true });
  }

  console.warn(
    `[ensure-generated-from-install] Missing ${label} output; running ${command}…`,
  );
  execSync(command, { stdio: "inherit", cwd: repoRoot });
};

ensureGenerated(
  "GraphQL codegen",
  join(repoRoot, "src", "graphql", "generated", "index.tsx"),
  "pnpm run generate-graphql",
  join(repoRoot, "src", "graphql", "generated"),
);

ensureGenerated(
  "Prisma client",
  join(repoRoot, "src", "server", "db", "generated", "client.ts"),
  "pnpm run prisma:generate",
  join(repoRoot, "src", "server", "db", "generated"),
);

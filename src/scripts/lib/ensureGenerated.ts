/**
 * Vercel (and some CI caches) can restore `node_modules` without running the
 * root `postinstall` again, while gitignored codegen output stays absent — then
 * `next build` fails on `#/graphql/generated` (GraphQL codegen) or
 * `#/server/db/generated/*` (the Prisma client).
 *
 * Cheap no-op when the artifacts already exist; otherwise regenerates them.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Side-effecting operations, injectable so the regeneration logic can be tested
 * without touching the filesystem or spawning processes.
 */
export type EnsureGeneratedDeps = {
  fileExists: (path: string) => boolean;
  run: (command: string, cwd: string) => void;
};

const defaultDeps: EnsureGeneratedDeps = {
  fileExists: (path) => existsSync(path),
  run: (command, cwd) => {
    execSync(command, { stdio: "inherit", cwd });
  },
};

/**
 * Runs `command` (from `repoRoot`) only when `sentinelPath` is missing, so a
 * present artifact is a cheap no-op.
 */
export const ensureGenerated = (
  label: string,
  sentinelPath: string,
  command: string,
  repoRoot: string = process.cwd(),
  deps: EnsureGeneratedDeps = defaultDeps,
): void => {
  if (deps.fileExists(sentinelPath)) {
    console.log(
      `[ensure-generated-from-install] ${label} output present; skipping.`,
    );
    return;
  }

  console.warn(
    `[ensure-generated-from-install] Missing ${label} output; running ${command}…`,
  );
  deps.run(command, repoRoot);
};

/**
 * Ensures every gitignored codegen artifact required by `next build` exists,
 * regenerating any that a cached install left behind.
 */
export const ensureAllGenerated = (
  repoRoot: string = process.cwd(),
  deps: EnsureGeneratedDeps = defaultDeps,
): void => {
  ensureGenerated(
    "GraphQL codegen",
    join(repoRoot, "src", "graphql", "generated", "index.tsx"),
    "pnpm run generate-graphql",
    repoRoot,
    deps,
  );

  ensureGenerated(
    "Prisma client",
    join(repoRoot, "src", "server", "db", "generated", "client.ts"),
    "pnpm run prisma:generate",
    repoRoot,
    deps,
  );
};

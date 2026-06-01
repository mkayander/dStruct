/**
 * Vercel (and some CI caches) can restore `node_modules` without running the
 * root `postinstall` again, while `src/graphql/generated` stays gitignored and
 * absent — then `next build` fails on `#/graphql/generated`.
 *
 * Cheap no-op when artifacts already exist; otherwise runs `generate-graphql`.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const repoRoot = process.cwd();
const graphqlIndex = join(repoRoot, "src", "graphql", "generated", "index.tsx");

if (!existsSync(graphqlIndex)) {
  console.warn(
    "[ensure-generated-from-install] Missing GraphQL codegen output; running generate-graphql…",
  );
  execSync("pnpm run generate-graphql", { stdio: "inherit", cwd: repoRoot });
} else {
  console.log(
    "[ensure-generated-from-install] GraphQL codegen output present; skipping.",
  );
}

import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ensureAllGenerated,
  ensureGenerated,
  type EnsureGeneratedDeps,
} from "#/scripts/lib/ensureGenerated";

const REPO_ROOT = "/repo";
const graphqlSentinel = join(
  REPO_ROOT,
  "src",
  "graphql",
  "generated",
  "index.tsx",
);
const prismaSentinel = join(
  REPO_ROOT,
  "src",
  "server",
  "db",
  "generated",
  "client.ts",
);

const fileExists = vi.fn<EnsureGeneratedDeps["fileExists"]>();
const run = vi.fn<EnsureGeneratedDeps["run"]>();
const deps: EnsureGeneratedDeps = { fileExists, run };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("ensureGenerated", () => {
  it("skips regeneration when the sentinel file exists", () => {
    fileExists.mockReturnValue(true);

    ensureGenerated(
      "Prisma client",
      prismaSentinel,
      "pnpm run prisma:generate",
      REPO_ROOT,
      deps,
    );

    expect(run).not.toHaveBeenCalled();
  });

  it("runs the command from the repo root when the sentinel file is missing", () => {
    fileExists.mockReturnValue(false);

    ensureGenerated(
      "Prisma client",
      prismaSentinel,
      "pnpm run prisma:generate",
      REPO_ROOT,
      deps,
    );

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith("pnpm run prisma:generate", REPO_ROOT);
  });
});

describe("ensureAllGenerated", () => {
  it("regenerates the Prisma client when only its output is missing (cached-install regression)", () => {
    // GraphQL output present, Prisma client output absent — the exact state a
    // cached Vercel install leaves behind that broke `next build`.
    fileExists.mockImplementation((path) => path === graphqlSentinel);

    ensureAllGenerated(REPO_ROOT, deps);

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith("pnpm run prisma:generate", REPO_ROOT);
  });

  it("regenerates both artifacts when neither output exists", () => {
    fileExists.mockReturnValue(false);

    ensureAllGenerated(REPO_ROOT, deps);

    expect(run).toHaveBeenCalledTimes(2);
    expect(run).toHaveBeenNthCalledWith(
      1,
      "pnpm run generate-graphql",
      REPO_ROOT,
    );
    expect(run).toHaveBeenNthCalledWith(
      2,
      "pnpm run prisma:generate",
      REPO_ROOT,
    );
  });

  it("regenerates nothing when all outputs exist", () => {
    fileExists.mockReturnValue(true);

    ensureAllGenerated(REPO_ROOT, deps);

    expect(run).not.toHaveBeenCalled();
  });
});

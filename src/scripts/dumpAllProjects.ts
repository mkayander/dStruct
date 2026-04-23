// Environment: `pnpm run dumpAllProjects` uses `load-env` (`loadEnvAndRun.ts`: `.env` then `.env.local`) so
// variables exist before `tsx` runs and `#/env/server.mjs` is validated.
//
// Flags:
//   --rewrite          Write to public-dumps/main.json (default path) instead of dumps/data-<slug>.json
//   --public-only      Only export isPublic playground projects and their test cases + solutions (for repo main dump)
import { promises as fs } from "fs";
import minimist from "minimist";
import { join } from "path";
import slugify from "slugify";

import { db } from "#/server/db/client";

type Args = { rewrite?: boolean; "public-only"?: boolean; out?: string };
const argv = minimist<Args>(process.argv.slice(2), {
  boolean: ["rewrite", "public-only"],
  string: ["out"],
});

const publicOnly = Boolean(argv["public-only"]);

type ProjectFromDb = Awaited<
  ReturnType<typeof db.playgroundProject.findMany>
>[number];
type TestCaseFromDb = Awaited<
  ReturnType<typeof db.playgroundTestCase.findMany>
>[number];
type SolutionFromDb = Awaited<
  ReturnType<typeof db.playgroundSolution.findMany>
>[number];

(async () => {
  const projectWhere = publicOnly ? { isPublic: true } : {};

  const projectsList = await db.playgroundProject.findMany({
    where: projectWhere,
  });
  const projects: Record<string, ProjectFromDb> = {};
  for (const project of projectsList) {
    projects[project.id] = project;
  }

  const projectIds = Object.keys(projects);

  const casesList =
    publicOnly && projectIds.length === 0
      ? []
      : await db.playgroundTestCase.findMany(
          publicOnly ? { where: { projectId: { in: projectIds } } } : undefined,
        );
  const testCases: Record<string, TestCaseFromDb> = {};
  for (const testCase of casesList) {
    testCases[testCase.id] = testCase;
  }

  const solutionsList =
    publicOnly && projectIds.length === 0
      ? []
      : await db.playgroundSolution.findMany(
          publicOnly ? { where: { projectId: { in: projectIds } } } : undefined,
        );
  const solutions: Record<string, SolutionFromDb> = {};
  for (const solution of solutionsList) {
    solutions[solution.id] = solution;
  }

  const data = {
    projects,
    testCases,
    solutions,
  };

  const date = new Date();
  const text = `${JSON.stringify(data, null, 2)}\n`;

  if (argv.rewrite) {
    const outPath =
      typeof argv.out === "string" && argv.out.length > 0
        ? argv.out
        : join(process.cwd(), "public-dumps/main.json");
    await fs.writeFile(outPath, text);
    if (publicOnly) {
      console.log(
        `Wrote ${Object.keys(projects).length} public projects to ${outPath}`,
      );
    }
  } else {
    await fs.writeFile(
      join(
        process.cwd(),
        `dumps/data-${slugify(date.toLocaleString(), { strict: true })}.json`,
      ),
      text,
    );
  }
})();

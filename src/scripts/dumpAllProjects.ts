import type {
  PlaygroundProject,
  PlaygroundSolution,
  PlaygroundTestCase,
} from "@prisma/client";
import { promises as fs } from "fs";
import minimist from "minimist";
import slugify from "slugify";

import { prisma } from "#/server/db/client";

type Args = { rewrite?: boolean };
const argv = minimist<Args>(process.argv.slice(2));

(async () => {
  const projectsList = await prisma.playgroundProject.findMany();
  const projects: Record<string, PlaygroundProject> = {};
  for (const project of projectsList) {
    projects[project.id] = project;
  }

  const casesList = await prisma.playgroundTestCase.findMany();
  const testCases: Record<string, PlaygroundTestCase> = {};
  for (const testCase of casesList) {
    testCases[testCase.id] = testCase;
  }

  const solutionsList = await prisma.playgroundSolution.findMany();
  const solutions: Record<string, PlaygroundSolution> = {};
  for (const solution of solutionsList) {
    solutions[solution.id] = solution;
  }

  const data = {
    projects,
    testCases,
    solutions,
  };

  const date = new Date();
  const text = JSON.stringify(data, null, 2);

  if (argv.rewrite) {
    await fs.writeFile("public-dumps/main.json", text);
  } else {
    await fs.writeFile(
      `dumps/data-${slugify(date.toLocaleString(), { strict: true })}.json`,
      text,
    );
  }
})();

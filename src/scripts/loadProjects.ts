import type { PlaygroundProject, PlaygroundSolution } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { promises as fs } from "fs";
import * as process from "process";

import { prisma } from "#/server/db/client";

import PlaygroundTestCaseCreateInput = Prisma.PlaygroundTestCaseCreateInput;

const dumpPath = process.argv[2];
if (!dumpPath) {
  console.error("No dump path provided");
  process.exit(1);
}

(async () => {
  const dumpData = await fs.readFile(dumpPath, "utf-8");
  const data = JSON.parse(dumpData) as {
    projects: Record<string, PlaygroundProject>;
    testCases: Record<string, PlaygroundTestCaseCreateInput>;
    solutions: Record<string, PlaygroundSolution>;
  };

  const availableUsers = new Map<string, boolean>();

  console.log("_".repeat(process.stdout.columns));
  console.log("Loading projects");
  for (const project of Object.values(data.projects)) {
    console.log(project.id, project.title);
    const userId = project.userId;
    let attachUser = false;
    if (userId) {
      if (!availableUsers.has(userId)) {
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        });
        availableUsers.set(userId, !!user);
      }
      attachUser = Boolean(availableUsers.get(userId));
    }

    try {
      await prisma.playgroundProject.create({
        data: {
          ...project,
          userId: attachUser ? userId : undefined,
        },
      });
    } catch (e) {
      console.error(e);
      console.error(project);
    }
  }

  console.log("_".repeat(process.stdout.columns));
  console.log("Loading test cases");
  for (const testCase of Object.values(data.testCases)) {
    console.log(testCase.id, testCase.title);
    try {
      await prisma.playgroundTestCase.create({
        data: testCase,
      });
    } catch (e) {
      console.error(e);
      console.error(testCase);
    }
  }

  console.log("_".repeat(process.stdout.columns));
  console.log("Loading solutions");
  for (const solution of Object.values(data.solutions)) {
    console.log(solution.id, solution.title);
    try {
      await prisma.playgroundSolution.create({
        data: solution,
      });
    } catch (e) {
      console.error(e);
      console.error(solution);
    }
  }
})();

import type { PlaygroundProject, PlaygroundSolution } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { promises as fs } from "fs";
import * as process from "process";

import { prisma } from "#/server/db/client";

import PlaygroundTestCaseCreateInput = Prisma.PlaygroundTestCaseCreateInput;

const isDebug = process.env.DEBUG === "true";

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

  if (isDebug) {
    console.log("_".repeat(process.stdout.columns));
    console.log("Loading projects");
  }
  for (const project of Object.values(data.projects)) {
    isDebug && console.log(project.id, project.title);
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
      await prisma.playgroundProject.upsert({
        where: {
          id: project.id,
        },
        create: {
          ...project,
          userId: attachUser ? userId : undefined,
        },
        update: {
          ...project,
        },
      });
    } catch (e) {
      if (!isDebug) continue;
      console.error(e);
      console.error(project);
    }
  }

  if (isDebug) {
    console.log("_".repeat(process.stdout.columns));
    console.log("Loading test cases");
  }
  for (const testCase of Object.values(data.testCases)) {
    console.log(testCase.id, testCase.title);
    try {
      await prisma.playgroundTestCase.upsert({
        where: {
          id: testCase.id,
        },
        create: testCase,
        update: testCase,
      });
    } catch (e) {
      if (!isDebug) continue;
      console.error(e);
      console.error(testCase);
    }
  }

  if (isDebug) {
    console.log("_".repeat(process.stdout.columns));
    console.log("Loading solutions");
  }
  for (const solution of Object.values(data.solutions)) {
    console.log(solution.id, solution.title);
    try {
      await prisma.playgroundSolution.upsert({
        where: {
          id: solution.id,
        },
        create: solution,
        update: solution,
      });
    } catch (e) {
      if (!isDebug) continue;
      console.error(e);
      console.error(solution);
    }
  }
})();

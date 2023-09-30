import shortUUID from "short-uuid";

import { prisma } from "#/server/db/client";

const uuid = shortUUID();

(async () => {
  const projects = await prisma.playgroundProject.findMany();
  await prisma.$transaction(
    projects.map((item) =>
      prisma.playgroundProject.update({
        where: { id: item.id },
        data: {
          slug: `project-${uuid.generate()}`,
        },
      }),
    ),
  );

  const cases = await prisma.playgroundTestCase.findMany();
  await prisma.$transaction(
    cases.map((item) =>
      prisma.playgroundTestCase.update({
        where: { id: item.id },
        data: {
          slug: `case-${uuid.generate()}`,
        },
      }),
    ),
  );

  const solutions = await prisma.playgroundSolution.findMany();
  await prisma.$transaction(
    solutions.map((item) =>
      prisma.playgroundSolution.update({
        where: { id: item.id },
        data: {
          slug: `solution-${uuid.generate()}`,
        },
      }),
    ),
  );
})();

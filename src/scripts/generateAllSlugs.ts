import uuid from "short-uuid";

import { db } from "#/server/db/client";

(async () => {
  const projects = await db.playgroundProject.findMany();
  await db.$transaction(
    projects.map((item) =>
      db.playgroundProject.update({
        where: { id: item.id },
        data: {
          slug: `project-${uuid.generate()}`,
        },
      }),
    ),
  );

  const cases = await db.playgroundTestCase.findMany();
  await db.$transaction(
    cases.map((item) =>
      db.playgroundTestCase.update({
        where: { id: item.id },
        data: {
          slug: `case-${uuid.generate()}`,
        },
      }),
    ),
  );

  const solutions = await db.playgroundSolution.findMany();
  await db.$transaction(
    solutions.map((item) =>
      db.playgroundSolution.update({
        where: { id: item.id },
        data: {
          slug: `solution-${uuid.generate()}`,
        },
      }),
    ),
  );
})();

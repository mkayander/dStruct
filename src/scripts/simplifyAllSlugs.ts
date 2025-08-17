import slugify from "slugify";

import { db } from "#/server/db/client";

(async () => {
  const projects = await db.playgroundProject.findMany();
  for (const project of projects) {
    console.log(project.slug);
    if (project.slug.startsWith("project-")) {
      const slug = slugify(project.title, { lower: true, strict: true });
      try {
        await db.playgroundProject.update({
          where: { id: project.id },
          data: { slug },
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  const cases = await db.playgroundTestCase.findMany();
  for (const testCase of cases) {
    console.log(testCase.slug);
    if (
      testCase.slug.startsWith("case-") &&
      (testCase.slug.split("-")[1]?.length ?? 0) > 5
    ) {
      let index = testCase.order + 1;
      while (
        await db.playgroundTestCase.findUnique({
          where: {
            projectId_slug: {
              projectId: testCase.projectId,
              slug: `case-${index}`,
            },
          },
        })
      ) {
        index++;
      }

      const slug = `case-${index}`;
      await db.playgroundTestCase.update({
        where: { id: testCase.id },
        data: { title: `Case ${index}`, slug },
      });
    }
  }

  const solutions = await db.playgroundSolution.findMany();
  for (const solution of solutions) {
    console.log(solution.slug);
    if (
      solution.slug.startsWith("solution-") &&
      (solution.slug.split("-")[1]?.length ?? 0) > 5
    ) {
      let index = solution.order + 1;
      while (
        await db.playgroundSolution.findUnique({
          where: {
            projectId_slug: {
              projectId: solution.projectId,
              slug: `solution-${index}`,
            },
          },
        })
      ) {
        index++;
      }

      const slug = `solution-${index}`;
      await db.playgroundSolution.update({
        where: { id: solution.id },
        data: { title: `Solution ${index}`, slug },
      });
    }
  }
})();

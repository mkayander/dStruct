import { prisma } from "#/server/db/client";
import {
  argumentObjectValidator,
  ArgumentType,
} from "#/store/reducers/caseReducer";

(async () => {
  const cases = await prisma.playgroundTestCase.findMany();
  await prisma.$transaction(
    cases.map((item) =>
      prisma.playgroundTestCase.update({
        where: { id: item.id },
        data: {
          args: {
            head: argumentObjectValidator.parse({
              name: "head",
              order: 0,
              type: ArgumentType.BINARY_TREE,
              input: item.input || "[]",
            }),
          },
        },
      })
    )
  );
})();

import { argumentObjectValidator } from "#/entities/argument/lib";
import { ArgumentType } from "#/entities/argument/model/argumentObject";
import { db } from "#/server/db/client";

(async () => {
  const cases = await db.playgroundTestCase.findMany();
  await db.$transaction(
    cases.map((item) =>
      db.playgroundTestCase.update({
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
      }),
    ),
  );
})();

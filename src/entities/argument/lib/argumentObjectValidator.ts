import { z } from "zod";

import { ArgumentType } from "../model/argumentObject";

export const argumentObjectValidator = z.object({
  name: z.string(),
  type: z.nativeEnum(ArgumentType),
  order: z.number(),
  input: z.string(),
  nodeData: z
    .record(z.string(), z.object({ x: z.number(), y: z.number() }))
    .optional(),
});

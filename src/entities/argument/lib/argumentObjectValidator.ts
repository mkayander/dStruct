import { z } from "zod";

import { ArgumentType } from "../model/argumentObject";
import type { ArgumentObjectMap } from "../model/types";

export const argumentObjectValidator = z.object({
  name: z.string(),
  type: z.nativeEnum(ArgumentType),
  order: z.number(),
  input: z.string(),
  nodeData: z.record(z.object({ x: z.number(), y: z.number() })).optional(),
});

export const isArgumentObjectValid = (
  args: unknown,
): args is ArgumentObjectMap => {
  if (typeof args !== "object" || args === null) {
    return false;
  }

  for (const arg of Object.values(args)) {
    if (typeof arg !== "object" || arg === null) {
      return false;
    }
    if (!argumentObjectValidator.safeParse(arg).success) {
      return false;
    }
  }

  return true;
};

import { z } from "zod";

export const entityDataSchema = z.object({
  lastIndex: z.number(),
});

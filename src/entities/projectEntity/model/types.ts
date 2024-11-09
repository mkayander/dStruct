import type { z } from "zod";

import type { entityDataSchema } from "./entityData";

export type EntityType = "case" | "solution";
export type EntityData = z.infer<typeof entityDataSchema>;

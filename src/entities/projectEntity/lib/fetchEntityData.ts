import { kv } from "#/shared/lib/kvClient";

import { entityDataSchema } from "../model/entityData";
import type { EntityData } from "../model/types";

export const fetchEntityData = async (key: string) => {
  let data = await kv.get<EntityData>(key);

  if (!data || !entityDataSchema.safeParse(data).success) {
    data = { lastIndex: 0 };
  }

  return data;
};

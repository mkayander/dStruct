import { kv } from "#/shared/lib/kvClient";

import type { EntityData, EntityType } from "../model/types";
import { fetchEntityData } from "./fetchEntityData";
import { getEntityKey } from "./getEntityKey";

export const setLastEntityIndex = async (
  projectId: string,
  type: EntityType,
  index: number,
) => {
  const key = getEntityKey(projectId, type);
  const data = await fetchEntityData(key);
  data.lastIndex = index;

  return kv.set<EntityData>(key, data);
};

import { kv } from "#/shared/lib/kvClient";

import type { EntityData, EntityType } from "../model/types";
import { fetchEntityData } from "./fetchEntityData";
import { getEntityKey } from "./getEntityKey";

export const getNextEntityIndex = async (
  projectId: string,
  type: EntityType,
) => {
  const key = getEntityKey(projectId, type);
  const data = await fetchEntityData(key);
  data.lastIndex++;

  void kv.set<EntityData>(key, data);

  return data.lastIndex;
};

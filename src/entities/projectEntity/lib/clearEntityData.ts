import { kv } from "#/shared/lib/kvClient";

import type { EntityType } from "../model/types";
import { getEntityKey } from "./getEntityKey";

export const clearEntityData = async (projectId: string, type: EntityType) => {
  const key = getEntityKey(projectId, type);

  return kv.del(key);
};

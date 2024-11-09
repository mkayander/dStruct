import type { EntityType } from "../model/types";

export const getEntityKey = (projectId: string, type: EntityType) =>
  `${projectId}-${type}`;

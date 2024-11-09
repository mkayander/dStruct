import type { EntityType } from "../model/types";

export const getEntitySlug = (type: EntityType, index: number) =>
  `${type}-${index}`;

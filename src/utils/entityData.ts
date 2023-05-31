import { kv } from "@vercel/kv";
import { z } from "zod";

const dataSchema = z.object({
  lastIndex: z.number(),
});

type EntityType = "case" | "solution";
type EntityData = z.infer<typeof dataSchema>;

const getEntityKey = (projectId: string, type: EntityType) =>
  `${projectId}-${type}`;

export const getEntitySlug = (type: EntityType, index: number) =>
  `${type}-${index}`;

const fetchEntityData = async (key: string) => {
  let data = await kv.get<EntityData>(key);

  if (!data || !dataSchema.safeParse(data).success) {
    data = { lastIndex: 0 };
  }

  return data;
};

export const getNextEntityIndex = async (
  projectId: string,
  type: EntityType
) => {
  const key = getEntityKey(projectId, type);
  const data = await fetchEntityData(key);
  data.lastIndex++;

  void kv.set<EntityData>(key, data);

  return data.lastIndex;
};

export const setLastEntityIndex = async (
  projectId: string,
  type: EntityType,
  index: number
) => {
  const key = getEntityKey(projectId, type);
  const data = await fetchEntityData(key);
  data.lastIndex = index;

  return kv.set<EntityData>(key, data);
};

export const clearEntityData = async (projectId: string, type: EntityType) => {
  const key = getEntityKey(projectId, type);

  return kv.del(key);
};

export const clearProjectEntities = async (projectId: string) => {
  await clearEntityData(projectId, "case");
  await clearEntityData(projectId, "solution");
};

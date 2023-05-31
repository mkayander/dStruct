import { kv } from "@vercel/kv";
import { z } from "zod";

const dataSchema = z.object({
  lastIndex: z.number(),
});

type EntityType = "case" | "solution";
type EntityData = z.infer<typeof dataSchema>;

const getEntityKey = (type: EntityType, projectId: string) =>
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
  type: EntityType,
  projectId: string
) => {
  const key = getEntityKey(type, projectId);
  const data = await fetchEntityData(key);
  data.lastIndex++;

  void kv.set<EntityData>(key, data);

  return data.lastIndex;
};

export const setLastEntityIndex = async (
  type: EntityType,
  projectId: string,
  index: number
) => {
  const key = getEntityKey(type, projectId);
  const data = await fetchEntityData(key);
  data.lastIndex = index;

  return kv.set<EntityData>(key, data);
};

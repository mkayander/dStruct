import { clearEntityData } from "./clearEntityData";

export const clearProjectEntities = async (projectId: string) => {
  await clearEntityData(projectId, "case");
  await clearEntityData(projectId, "solution");
};

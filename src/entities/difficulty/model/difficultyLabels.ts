import { ProjectDifficulty } from "#/server/db/generated/client";

export const difficultyLabels: Record<ProjectDifficulty, string> = {
  [ProjectDifficulty.EASY]: "Easy",
  [ProjectDifficulty.MEDIUM]: "Medium",
  [ProjectDifficulty.HARD]: "Hard",
};

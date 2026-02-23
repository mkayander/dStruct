import { ProjectDifficulty } from "#/server/db/generated/enums";

export const difficultyLabels: Record<ProjectDifficulty, string> = {
  [ProjectDifficulty.EASY]: "Easy",
  [ProjectDifficulty.MEDIUM]: "Medium",
  [ProjectDifficulty.HARD]: "Hard",
};

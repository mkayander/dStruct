import { ProjectDifficulty } from "@prisma/client";

import { Difficulty } from "#/graphql/generated";

export const getDifficultyValue = (
  difficulty: Difficulty | undefined | null,
): ProjectDifficulty => {
  switch (difficulty) {
    default:
    case Difficulty.Easy:
      return ProjectDifficulty.EASY;
    case Difficulty.Medium:
      return ProjectDifficulty.MEDIUM;
    case Difficulty.Hard:
      return ProjectDifficulty.HARD;
  }
};

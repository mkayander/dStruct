import { ProjectDifficulty } from "@prisma/client";

import { Difficulty } from "#/graphql/generated";
import type { theme as muiTheme } from "#/themes";

export const difficultyLabels: Record<ProjectDifficulty, string> = {
  [ProjectDifficulty.EASY]: "Easy",
  [ProjectDifficulty.MEDIUM]: "Medium",
  [ProjectDifficulty.HARD]: "Hard",
};

export const getDifficultyColor = (
  theme: typeof muiTheme,
  difficulty?: ProjectDifficulty | null,
) => {
  switch (difficulty) {
    case ProjectDifficulty.EASY:
      return theme.palette.question.Easy.main;
    case ProjectDifficulty.MEDIUM:
      return theme.palette.question.Medium.main;
    case ProjectDifficulty.HARD:
      return theme.palette.question.Hard.main;

    default:
      return theme.palette.question.All.main;
  }
};

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

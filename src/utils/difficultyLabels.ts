import { ProjectDifficulty } from "@prisma/client";

import type { themes } from "#/themes";

export const difficultyLabels: Record<ProjectDifficulty, string> = {
  [ProjectDifficulty.EASY]: "Easy",
  [ProjectDifficulty.MEDIUM]: "Medium",
  [ProjectDifficulty.HARD]: "Hard",
};

export const getDifficultyColor = (
  theme: (typeof themes)["dark"],
  difficulty?: ProjectDifficulty | null
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

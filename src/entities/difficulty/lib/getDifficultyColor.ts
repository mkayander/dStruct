import { ProjectDifficulty } from "#/server/db/generated/enums";
import type { theme as muiTheme } from "#/themes";

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

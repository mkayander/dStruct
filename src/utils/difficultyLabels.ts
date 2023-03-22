import {
  SignalCellular0Bar,
  SignalCellular2Bar,
  SignalCellular4Bar,
} from "@mui/icons-material";
import { type SvgIcon } from "@mui/material";
import { ProjectDifficulty } from "@prisma/client";

import { Difficulty } from "#/graphql/generated";

export const projectDifficultyLabels: Record<ProjectDifficulty, string> = {
  [ProjectDifficulty.EASY]: "Easy",
  [ProjectDifficulty.MEDIUM]: "Medium",
  [ProjectDifficulty.ADVANCED]: "Advanced",
};

export const projectDifficultyIconMap: Record<
  ProjectDifficulty,
  typeof SvgIcon
> = {
  [ProjectDifficulty.EASY]: SignalCellular0Bar,
  [ProjectDifficulty.MEDIUM]: SignalCellular2Bar,
  [ProjectDifficulty.ADVANCED]: SignalCellular4Bar,
};

export const difficultiesMap: Record<ProjectDifficulty, Difficulty> = {
  [ProjectDifficulty.EASY]: Difficulty.Easy,
  [ProjectDifficulty.MEDIUM]: Difficulty.Medium,
  [ProjectDifficulty.ADVANCED]: Difficulty.Hard,
};

export const difficultyIconMap: Record<
  keyof typeof Difficulty,
  typeof SvgIcon
> = {
  All: SignalCellular0Bar,
  Easy: SignalCellular0Bar,
  Medium: SignalCellular2Bar,
  Hard: SignalCellular4Bar,
};

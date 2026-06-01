import { Avatar, Stack, Tooltip, Typography, useTheme } from "@mui/material";

import { getDifficultyColor } from "#/entities/difficulty/lib/getDifficultyColor";
import { difficultyLabels } from "#/entities/difficulty/model/difficultyLabels";
import type { RouterOutputs } from "#/shared/api";
import { getImageUrl } from "#/shared/lib";
import { NewLabel } from "#/shared/ui/atoms/NewLabel";
import { ProblemLinkButton } from "#/shared/ui/atoms/ProblemLinkButton";

export type ProjectInfoProps = {
  project?: RouterOutputs["project"]["getBySlug"];
};

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  const theme = useTheme();

  if (!project) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
        }}
      >
        <Typography>{project.title}</Typography>
        {project.isNew && <NewLabel createdAt={project.createdAt} />}
        {project.lcLink && <ProblemLinkButton problemLink={project.lcLink} />}
      </Stack>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          minWidth: 10,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: 12,
            textOverflow: "ellipsis",
            overflow: "hidden",
            opacity: 0.6,
            color: getDifficultyColor(theme, project.difficulty),
          }}
        >
          {project.difficulty && difficultyLabels[project.difficulty]}
        </Typography>
        {project.author?.bucketImage && (
          <Tooltip title={`Author: ${project.author.name}`} arrow>
            <Avatar
              src={getImageUrl(project.author.bucketImage)}
              alt={`${project.author.name} avatar`}
              sx={{ height: 24, width: 24 }}
            />
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};

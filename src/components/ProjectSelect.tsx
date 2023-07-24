import {
  Avatar,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  SelectChangeEvent,
  type SelectProps,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { type UseQueryResult } from "@tanstack/react-query";
import React, { useContext, useMemo } from "react";

import { NewLabel } from "#/components/NewLabel";
import { ConfigContext } from "#/context";
import { usePlaygroundSlugs } from "#/hooks";
import { useI18nContext } from "#/i18n/i18n-react";
import {
  categoryLabels,
  difficultyLabels,
  getDifficultyColor,
  getImageUrl,
} from "#/utils";
import { type RouterOutputs } from "#/utils/trpc";

type ProjectSelectProps = {
  allBrief: UseQueryResult<RouterOutputs["project"]["allBrief"]>;
};

export const ProjectSelect: React.FC<ProjectSelectProps> = ({ allBrief }) => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const { newProjectMarginMs } = useContext(ConfigContext);

  const { projectSlug = "", setProject } = usePlaygroundSlugs();

  const handleSelectProject = (e: SelectChangeEvent) => {
    void setProject(e.target.value);
  };

  const projectSelectItems = useMemo(() => {
    let lastCategory = "";
    const elements: JSX.Element[] = [];
    if (!allBrief.data) return elements;

    for (const project of allBrief.data) {
      if (lastCategory !== project.category) {
        lastCategory = project.category;
        elements.push(
          <ListSubheader
            key={project.category}
            sx={{
              backgroundColor: "transparent",
              backdropFilter: "blur(8px)",
              "&:not(:first-of-type)": {
                borderTop: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            {categoryLabels[project.category]}
          </ListSubheader>
        );
      }

      const isProjectNew =
        newProjectMarginMs &&
        project.createdAt.getTime() > Date.now() - Number(newProjectMarginMs);

      elements.push(
        <MenuItem key={project.id} value={project.slug}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            spacing={1}
          >
            <Stack direction="row" spacing={1}>
              <span>{project.title}</span>
              {isProjectNew && <NewLabel createdAt={project.createdAt} />}
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              minWidth={10}
              overflow="hidden"
              spacing={1}
            >
              <Typography
                fontSize={12}
                variant="subtitle1"
                textOverflow="ellipsis"
                overflow="hidden"
                sx={{
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
        </MenuItem>
      );
    }

    return elements;
  }, [allBrief.data, newProjectMarginMs, theme]);

  return (
    <FormControl fullWidth>
      <InputLabel id="project-select-label">{LL.CURRENT_PROJECT()}</InputLabel>
      <Select
        id="project-select"
        labelId="project-select-label"
        label={LL.CURRENT_PROJECT()}
        defaultValue=""
        value={allBrief.isLoading ? "" : projectSlug}
        disabled={allBrief.isLoading}
        onChange={handleSelectProject}
      >
        {projectSelectItems}
      </Select>
    </FormControl>
  );
};

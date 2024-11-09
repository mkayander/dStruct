import {
  Avatar,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
  useColorScheme,
  useTheme,
} from "@mui/material";
import { type UseQueryResult } from "@tanstack/react-query";
import React, { useContext, useMemo, useState } from "react";
import sanitizeHtml from "sanitize-html";

import { ConfigContext } from "#/context";
import { categoryLabels } from "#/entities/category/model/categoryLabels";
import { getDifficultyColor } from "#/entities/difficulty/lib";
import { difficultyLabels } from "#/entities/difficulty/model/difficultyLabels";
import { usePlaygroundSlugs } from "#/hooks";
import { useI18nContext } from "#/hooks";
import { NewLabel } from "#/shared/ui/atoms/NewLabel";
import { SearchInput } from "#/shared/ui/molecules/SearchInput";
import { getImageUrl } from "#/utils";
import { type RouterOutputs } from "#/utils/trpc";

type ProjectSelectProps = {
  allBrief: UseQueryResult<RouterOutputs["project"]["allBrief"]>;
};

export const ProjectSelect: React.FC<ProjectSelectProps> = ({ allBrief }) => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const { mode } = useColorScheme();
  const { newProjectMarginMs } = useContext(ConfigContext);
  const [searchValue, setSearchValue] = useState("");

  const { projectSlug = "", setProject } = usePlaygroundSlugs();

  const panelBgColor = mode === "dark" ? "#2f2f2f" : "#fff";

  const handleSelectProject = (e: SelectChangeEvent) => {
    void setProject(
      sanitizeHtml(e.target.value, {
        allowedTags: [],
        allowedAttributes: {},
      }),
    );
  };

  const projectSelectItems = useMemo(() => {
    let lastCategory = "";
    const elements: React.ReactElement[] = [];
    if (!allBrief.data) return elements;

    for (const project of allBrief.data) {
      if (
        searchValue &&
        !project.title.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        continue;
      }
      if (lastCategory !== project.category) {
        lastCategory = project.category;
        elements.push(
          <ListSubheader
            key={project.category}
            sx={{
              backgroundColor: panelBgColor,
              "&:not(:first-of-type)": {
                borderTop: `1px solid ${theme.palette.divider}`,
              },
              top: 56,
              zIndex: 1,
            }}
          >
            {categoryLabels[project.category]}
          </ListSubheader>,
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
        </MenuItem>,
      );
    }

    return elements;
  }, [allBrief.data, newProjectMarginMs, panelBgColor, searchValue, theme]);

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
        <SearchInput
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          sx={{
            position: "sticky",
            backgroundColor: panelBgColor,
            mt: -1,
            top: 0,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
        {projectSelectItems}
        {!allBrief.isLoading && projectSelectItems.length === 0 && (
          <MenuItem disabled>No projects found</MenuItem>
        )}
      </Select>
    </FormControl>
  );
};

import {
  Avatar,
  Box,
  Chip,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

import { categoryLabels } from "#/entities/category/model/categoryLabels";
import { getDifficultyColor } from "#/entities/difficulty/lib/getDifficultyColor";
import { difficultyLabels } from "#/entities/difficulty/model/difficultyLabels";
import type { RouterOutputs } from "#/shared/api";
import { getImageUrl } from "#/shared/lib";
import { NewLabel } from "#/shared/ui/atoms/NewLabel";

// Support both allBrief and browseProjects types (they have compatible structures)
type ProjectBrief =
  | RouterOutputs["project"]["allBrief"][number]
  | RouterOutputs["project"]["browseProjects"]["projects"][number];

type ProjectBrowserItemProps = {
  project: ProjectBrief;
  isSelected: boolean;
  onClick: () => void;
};

const ProjectBrowserItemComponent: React.FC<ProjectBrowserItemProps> = ({
  project,
  isSelected,
  onClick,
}) => {
  const theme = useTheme();

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      onClick();
    }
  };

  const difficultyColor = project.difficulty
    ? getDifficultyColor(theme, project.difficulty)
    : undefined;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1.5}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      sx={{
        height: 76,
        p: 1.75,
        px: 2,
        cursor: "pointer",
        borderRadius: 1.5,
        backgroundColor: isSelected
          ? theme.palette.action.selected
          : "transparent",
        border: `1px solid ${
          isSelected ? theme.palette.primary.main : theme.palette.divider
        }`,
        borderColor: isSelected ? theme.palette.primary.main : "transparent",
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
        },
        "&:focus-visible": {
          outline: `2px solid ${theme.palette.primary.main}`,
          outlineOffset: -2,
        },
        transition: "background-color 0.15s ease-out",
      }}
      role="button"
      aria-selected={isSelected}
      aria-label={`Select project ${project.title}`}
    >
      {/* Left side: Completion status placeholder, title, category */}
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flex={1}
        minWidth={0}
      >
        {/* Completion status placeholder - can be added when data is available */}
        <Box
          sx={{
            width: 20,
            height: 20,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Completion status"
        >
          {/* Placeholder for checkmark icon when completion data is available */}
        </Box>

        <Stack direction="column" spacing={0.5} flex={1} minWidth={0}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            flexWrap="nowrap"
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: isSelected ? 600 : 500,
                fontSize: "0.95rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: isSelected
                  ? theme.palette.text.primary
                  : theme.palette.text.primary,
              }}
            >
              {project.title}
            </Typography>
            {project.isNew && <NewLabel createdAt={project.createdAt} />}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
                fontSize: "0.75rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {categoryLabels[project.category]}
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Right side: Difficulty badge, author avatar */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ minWidth: 0, flexShrink: 0 }}
      >
        {project.difficulty && (
          <Chip
            label={difficultyLabels[project.difficulty]}
            size="small"
            sx={{
              height: 24,
              fontSize: "0.7rem",
              fontWeight: 600,
              backgroundColor: difficultyColor
                ? `${difficultyColor}20`
                : "transparent",
              color: difficultyColor || theme.palette.text.secondary,
              border: difficultyColor
                ? `1px solid ${difficultyColor}40`
                : `1px solid ${theme.palette.divider}`,
              "& .MuiChip-label": {
                px: 1,
              },
            }}
          />
        )}
        {project.author?.bucketImage && (
          <Tooltip title={`Author: ${project.author.name}`} arrow>
            <Avatar
              src={getImageUrl(project.author.bucketImage)}
              alt={`${project.author.name} avatar`}
              sx={{
                height: 28,
                width: 28,
                border: `2px solid ${theme.palette.divider}`,
              }}
            />
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};

ProjectBrowserItemComponent.displayName = "ProjectBrowserItem";

export const ProjectBrowserItem = React.memo(
  ProjectBrowserItemComponent,
  (prevProps, nextProps) => {
    // Custom comparison: return true if props are equal (skip re-render)
    // Only re-render if project id, isSelected, or onClick reference changes
    return (
      prevProps.project.id === nextProps.project.id &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.onClick === nextProps.onClick &&
      prevProps.project.slug === nextProps.project.slug &&
      prevProps.project.title === nextProps.project.title &&
      prevProps.project.category === nextProps.project.category &&
      prevProps.project.difficulty === nextProps.project.difficulty
    );
  },
);

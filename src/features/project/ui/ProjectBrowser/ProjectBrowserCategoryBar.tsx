import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Button, Chip, Typography } from "@mui/material";
import type { ProjectCategory } from "@prisma/client";
import React, { useMemo, useState } from "react";

import { categoryLabels } from "#/entities/category/model/categoryLabels";
import type { RouterOutputs } from "#/shared/api";

import { useProjectBrowserContext } from "./ProjectBrowserContext";

type ProjectBrief = RouterOutputs["project"]["allBrief"][number];

type ProjectBrowserCategoryBarProps = {
  projects: ProjectBrief[] | undefined;
};

// Max height for collapsed state (approximately 2-3 rows of chips)
const COLLAPSED_MAX_HEIGHT = 120;

export const ProjectBrowserCategoryBar: React.FC<
  ProjectBrowserCategoryBarProps
> = ({ projects }) => {
  const { selectedCategories, setSelectedCategories } =
    useProjectBrowserContext();
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    if (!projects) return new Map<ProjectCategory, number>();

    const counts = new Map<ProjectCategory, number>();
    for (const project of projects) {
      const currentCount = counts.get(project.category) || 0;
      counts.set(project.category, currentCount + 1);
    }
    return counts;
  }, [projects]);

  // Get all categories sorted by count (descending) then alphabetically
  const sortedCategories = useMemo(() => {
    const allCategories = Array.from(categoryCounts.keys());
    return allCategories.sort((a, b) => {
      const countA = categoryCounts.get(a) || 0;
      const countB = categoryCounts.get(b) || 0;
      if (countA !== countB) {
        return countB - countA; // Descending by count
      }
      return categoryLabels[a].localeCompare(categoryLabels[b]); // Alphabetical
    });
  }, [categoryCounts]);

  const handleCategoryClick = (category: ProjectCategory) => {
    const isSelected = selectedCategories.includes(category);
    if (isSelected) {
      // Remove category from selection
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      // Add category to selection
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleKeyDown = (
    ev: React.KeyboardEvent,
    category: ProjectCategory,
  ) => {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      handleCategoryClick(category);
    }
  };

  if (sortedCategories.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: "divider",
      }}
      role="region"
      aria-label="Category filters"
    >
      {/* Subheader */}
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 1,
        }}
      >
        <Typography
          variant="subtitle2"
          component="h3"
          sx={{
            fontWeight: 600,
            color: "text.secondary",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Categories
        </Typography>
      </Box>

      {/* Categories List */}
      <Box
        sx={{
          px: 1.5,
          pb: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            maxHeight: isExpanded ? "none" : COLLAPSED_MAX_HEIGHT,
            overflow: isExpanded ? "visible" : "hidden",
            transition: "max-height 0.3s ease-in-out",
          }}
        >
          {sortedCategories.map((category) => {
            const count = categoryCounts.get(category) || 0;
            const isSelected = selectedCategories.includes(category);
            const label = categoryLabels[category];

            return (
              <Chip
                key={category}
                label={`${label}: ${count}`}
                onClick={() => handleCategoryClick(category)}
                onKeyDown={(ev) => handleKeyDown(ev, category)}
                color={isSelected ? "primary" : "default"}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  cursor: "pointer",
                  fontWeight: isSelected ? 600 : 400,
                  "&:focus-visible": {
                    outline: "2px solid",
                    outlineColor: "primary.main",
                    outlineOffset: 2,
                  },
                }}
                tabIndex={0}
                aria-pressed={isSelected}
                aria-label={`Filter by ${label} category, ${count} projects`}
              />
            );
          })}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mt: 1,
          }}
        >
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            endIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
            size="small"
            sx={{
              textTransform: "none",
              minWidth: "auto",
              px: 1,
            }}
            aria-label={
              isExpanded ? "Collapse categories" : "Expand categories"
            }
            aria-expanded={isExpanded}
          >
            {isExpanded ? "Collapse" : "Show more"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

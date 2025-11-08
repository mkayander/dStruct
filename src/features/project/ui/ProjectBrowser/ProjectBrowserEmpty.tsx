import { Box, Stack, Typography } from "@mui/material";
import React from "react";

import { useI18nContext } from "#/shared/hooks";

type ProjectBrowserEmptyProps = {
  searchQuery?: string;
  hasFilters?: boolean;
};

export const ProjectBrowserEmpty: React.FC<ProjectBrowserEmptyProps> = ({
  searchQuery,
  hasFilters,
}) => {
  const { LL } = useI18nContext();

  const getMessage = () => {
    if (searchQuery) {
      return `${LL.NO_PROJECTS_FOUND()} for "${searchQuery}"`;
    }
    if (hasFilters) {
      return LL.NO_PROJECTS_MATCH_FILTERS();
    }
    return LL.NO_PROJECTS_FOUND();
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 200,
        p: 4,
      }}
    >
      <Stack spacing={1} alignItems="center">
        <Typography variant="body1" color="text.secondary">
          {getMessage()}
        </Typography>
      </Stack>
    </Box>
  );
};

"use client";

import { Box, Divider, Stack, Typography } from "@mui/material";
import React from "react";

import { ProjectBrowserContent } from "#/features/project/ui/ProjectBrowser/ProjectBrowserContent";
import { useI18nContext } from "#/shared/hooks";

import { useMobilePlaygroundView } from "../hooks/useMobilePlaygroundView";

export const MobileBrowseView: React.FC = () => {
  const { LL } = useI18nContext();
  const { goToCode } = useMobilePlaygroundView();

  return (
    <Stack sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
          {LL.PROJECT_BROWSER()}
        </Typography>
      </Box>
      <Divider />

      <ProjectBrowserContent onSelectProject={goToCode} />
    </Stack>
  );
};

import { alpha, Box, LinearProgress, useTheme } from "@mui/material";
import React from "react";

import { Footer, MainAppBar, PageScrollContainer } from "#/components";

export type MainLayoutProps = {
  children: React.ReactNode;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isLoading,
  setDarkMode,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ".os-theme-dark.os-scrollbar > .os-scrollbar-track > .os-scrollbar-handle":
          {
            background: theme.palette.action.hover,
            "&:hover": {
              backgroundColor: alpha(theme.palette.primary.light, 0.3),
            },
            "&:active": {
              backgroundColor: alpha(theme.palette.primary.dark, 0.6),
            },
          },
      }}
    >
      <PageScrollContainer>
        <Box sx={{ minHeight: "100vh" }}>
          <MainAppBar setDarkMode={setDarkMode} />
          <Box sx={{ minHeight: "85vh" }}>
            {isLoading ? <LinearProgress variant="indeterminate" /> : children}
          </Box>
          <Footer />
        </Box>
      </PageScrollContainer>
    </Box>
  );
};

import { Box, LinearProgress } from "@mui/material";
import React from "react";

import { Footer, MainAppBar, PageScrollContainer } from "#/components";

export type MainLayoutProps = {
  children: React.ReactNode;
  isLoading?: boolean;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isLoading,
}) => {
  return (
    <PageScrollContainer isPage={true} style={{ height: "100vh" }}>
      <Box sx={{ minHeight: "100vh" }}>
        <MainAppBar />
        <Box component="main" sx={{ minHeight: "85vh" }}>
          {isLoading ? <LinearProgress variant="indeterminate" /> : children}
        </Box>
        <Footer />
      </Box>
    </PageScrollContainer>
  );
};

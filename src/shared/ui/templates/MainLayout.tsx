import { Box, type BoxProps, LinearProgress } from "@mui/material";
import React from "react";

import { MainAppBar } from "#/features/appBar/ui/MainAppBar";
import { Footer } from "#/shared/ui/organisms/Footer";
import {
  PageScrollContainer,
  type PageScrollContainerProps,
} from "#/shared/ui/templates/PageScrollContainer";

export type MainLayoutProps = Omit<BoxProps, "onScroll"> & {
  children: React.ReactNode;
  isLoading?: boolean;
  onScroll?: PageScrollContainerProps["onScroll"];
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isLoading,
  onScroll,
  ...restProps
}) => {
  return (
    <PageScrollContainer
      isPage={true}
      style={{ height: "100vh" }}
      onScroll={onScroll}
    >
      <Box sx={{ minHeight: "100vh" }} {...restProps}>
        <MainAppBar />
        <Box component="main" sx={{ minHeight: "85vh" }}>
          {isLoading ? <LinearProgress variant="indeterminate" /> : children}
        </Box>
        <Footer />
      </Box>
    </PageScrollContainer>
  );
};

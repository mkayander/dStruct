import { Box, type BoxProps, LinearProgress } from "@mui/material";
import React, { type Ref } from "react";

import {
  MainAppBar,
  type MainAppBarProps,
} from "#/features/appBar/ui/MainAppBar";
import { Footer } from "#/shared/ui/organisms/Footer";
import {
  PageScrollContainer,
  type PageScrollContainerProps,
} from "#/shared/ui/templates/PageScrollContainer";

export type MainLayoutProps = Omit<BoxProps, "onScroll"> & {
  children: React.ReactNode;
  isLoading?: boolean;
  headerPosition?: MainAppBarProps["position"];
  onScroll?: PageScrollContainerProps["onScroll"];
  pageScrollViewportRef?: Ref<HTMLDivElement | null>;
};

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  isLoading,
  headerPosition = "sticky",
  onScroll,
  pageScrollViewportRef,
  ...restProps
}) => {
  return (
    <PageScrollContainer
      isPage={true}
      style={{ height: "100vh" }}
      onScroll={onScroll}
      viewportRef={pageScrollViewportRef}
    >
      <Box sx={{ minHeight: "100vh" }} {...restProps}>
        <MainAppBar position={headerPosition} />
        <Box component="main" sx={{ minHeight: "85vh" }}>
          {isLoading ? <LinearProgress variant="indeterminate" /> : children}
        </Box>
        <Footer />
      </Box>
    </PageScrollContainer>
  );
};

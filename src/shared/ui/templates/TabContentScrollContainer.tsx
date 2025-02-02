import { alpha, Box, type SxProps, useTheme } from "@mui/material";
import {
  OverlayScrollbarsComponent,
  type OverlayScrollbarsComponentRef,
} from "overlayscrollbars-react";
import React, { forwardRef } from "react";

export type TabContentScrollContainerProps = React.ComponentProps<
  typeof OverlayScrollbarsComponent
> & {
  viewportStyle?: React.CSSProperties;
  sx?: SxProps;
};

export const TabContentScrollContainer = forwardRef<
  HTMLDivElement,
  TabContentScrollContainerProps
>(({ children, viewportStyle = {}, ...restProps }, ref) => {
  const theme = useTheme();

  const overlayScrollbarsRef = (
    instance: OverlayScrollbarsComponentRef<"div"> | null,
  ) => {
    if (instance) {
      const customViewport = (instance.osInstance()?.elements().viewport ??
        document.createElement("div")) as HTMLDivElement;
      for (const key in restProps) {
        if (!restProps.hasOwnProperty(key)) {
          continue;
        }
        customViewport?.setAttribute(key, restProps[key]);
      }

      if (ref) {
        if (typeof ref === "function") {
          ref(customViewport);
        } else {
          ref.current = customViewport;
        }
      }
    }
  };

  return (
    <Box
      component="div"
      display="contents"
      sx={{
        height: "100%",
        flexGrow: 1,
        ".os-viewport": viewportStyle,
        ".os-scrollbar > .os-scrollbar-track > div.os-scrollbar-handle": {
          transition: "background .2s",
          background: alpha(theme.palette.divider, 0.1),
          "&:hover": {
            background: alpha(theme.palette.primary.light, 0.2),
          },
          "&:active": {
            background: alpha(theme.palette.primary.light, 0.5),
          },
        },
      }}
    >
      <OverlayScrollbarsComponent ref={overlayScrollbarsRef} {...restProps}>
        {children}
      </OverlayScrollbarsComponent>
    </Box>
  );
});
TabContentScrollContainer.displayName = "TabContentScrollContainer";

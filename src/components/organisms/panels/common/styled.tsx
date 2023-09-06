import { TabPanel, type TabPanelProps } from "@mui/lab";
import { alpha, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React from "react";

type TabContentScrollContainerProps = React.ComponentProps<
  typeof OverlayScrollbarsComponent
> & {
  viewportStyle?: React.CSSProperties;
};

const TabContentScrollContainer: React.FC<TabContentScrollContainerProps> = ({
  children,
  viewportStyle = {},
  ...restProps
}) => {
  const theme = useTheme();

  return (
    <Box
      display="contents"
      sx={{
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
      <OverlayScrollbarsComponent {...restProps}>
        {children}
      </OverlayScrollbarsComponent>
    </Box>
  );
};

export const TabListWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexFlow: "row nowrap",
  justifyContent: "space-between",
  boxShadow: theme.shadows[3],
  ".MuiTab-root": {
    color: "white",
    textTransform: "none",
    "&.Mui-selected": {
      color: theme.palette.text.primary,
    },
  },
}));

type StyledTabPanelProps = TabPanelProps & {
  scrollContainerStyle?: React.CSSProperties;
  scrollViewportStyle?: React.CSSProperties;
  useScroll?: boolean;
};

export const StyledTabPanel: React.FC<StyledTabPanelProps> = ({
  scrollContainerStyle,
  scrollViewportStyle,
  useScroll = true,
  sx,
  ...restProps
}) => {
  const panel = (
    <TabPanel
      sx={{ p: 2, display: "flex", flexDirection: "column", ...sx }}
      {...restProps}
    />
  );

  if (useScroll) {
    return (
      <TabContentScrollContainer
        defer
        style={scrollContainerStyle}
        viewportStyle={scrollViewportStyle}
      >
        {panel}
      </TabContentScrollContainer>
    );
  } else {
    return panel;
  }
};

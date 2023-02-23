import { TabPanel, type TabPanelProps } from "@mui/lab";
import { alpha, Box, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React from "react";

const TabContentScrollContainer: React.FC<
  React.ComponentProps<typeof OverlayScrollbarsComponent>
> = ({ children, ...restProps }) => {
  const theme = useTheme();

  return (
    <Box
      display="contents"
      sx={{
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
};

export const StyledTabPanel: React.FC<StyledTabPanelProps> = ({
  scrollContainerStyle,
  ...restProps
}) => (
  <TabContentScrollContainer defer style={scrollContainerStyle}>
    <TabPanel sx={{ p: 2 }} {...restProps} />
  </TabContentScrollContainer>
);

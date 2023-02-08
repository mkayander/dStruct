import { TabPanel, type TabPanelProps } from "@mui/lab";
import { alpha, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React from "react";

const StyledOverlayScrollbarsComponent = styled(OverlayScrollbarsComponent)(
  ({ theme }) => ({
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
  })
);

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

export const StyledTabPanel: React.FC<TabPanelProps> = (props) => (
  <StyledOverlayScrollbarsComponent defer>
    <TabPanel sx={{ p: 2 }} {...props} />
  </StyledOverlayScrollbarsComponent>
);

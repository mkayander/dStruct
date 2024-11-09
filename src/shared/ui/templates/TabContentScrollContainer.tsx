import { alpha, Box, useTheme } from "@mui/material";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

export type TabContentScrollContainerProps = React.ComponentProps<
  typeof OverlayScrollbarsComponent
> & {
  viewportStyle?: React.CSSProperties;
};

export const TabContentScrollContainer: React.FC<
  TabContentScrollContainerProps
> = ({ children, viewportStyle = {}, ...restProps }) => {
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

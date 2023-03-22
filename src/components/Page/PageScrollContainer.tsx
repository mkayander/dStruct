import { alpha, Box, useTheme } from "@mui/material";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { type OverlayScrollbarsComponentProps } from "overlayscrollbars-react/types/OverlayScrollbarsComponent";
import React from "react";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  appBarSlice,
  selectIsAppBarScrolled,
} from "#/store/reducers/appBarReducer";

type PageScrollContainerProps = {
  children: React.ReactNode;
  isPage?: boolean;
  options?: OverlayScrollbarsComponentProps["options"];
  style?: React.CSSProperties;
};

export const PageScrollContainer: React.FC<PageScrollContainerProps> = ({
  children,
  isPage,
  options = {
    scrollbars: {
      autoHide: "scroll",
    },
  },
  style,
}) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isScrolled = useAppSelector(selectIsAppBarScrolled);

  return (
    <Box
      sx={{
        display: "contents",
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
      <OverlayScrollbarsComponent
        defer
        style={style}
        options={options}
        events={
          isPage
            ? {
                scroll: (instance, ev) => {
                  if (
                    ev.target instanceof Element &&
                    ev.target.scrollTop > 0 !== isScrolled
                  ) {
                    dispatch(
                      appBarSlice.actions.setIsScrolled(ev.target.scrollTop > 0)
                    );
                  }
                },
                destroyed: () => {
                  dispatch(appBarSlice.actions.setIsScrolled(false));
                },
              }
            : undefined
        }
      >
        {children}
      </OverlayScrollbarsComponent>
    </Box>
  );
};

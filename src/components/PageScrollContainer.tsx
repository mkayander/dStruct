import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React from "react";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  appBarSlice,
  selectIsAppBarScrolled,
} from "#/store/reducers/appBarReducer";

type PageScrollContainerProps = {
  children: React.ReactNode;
};

export const PageScrollContainer: React.FC<PageScrollContainerProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const isScrolled = useAppSelector(selectIsAppBarScrolled);

  return (
    <OverlayScrollbarsComponent
      defer
      style={{ height: "100vh" }}
      options={{
        scrollbars: {
          autoHide: "scroll",
        },
      }}
      events={{
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
      }}
    >
      {children}
    </OverlayScrollbarsComponent>
  );
};

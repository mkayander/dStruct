import React from "react";

import { useAppSelector } from "#/store/hooks";
import {
  selectViewerOffsetX,
  selectViewerOffsetY,
} from "#/store/reducers/editorReducer";

export type PannableViewerProps = React.PropsWithChildren;

export const PannableViewer: React.FC<PannableViewerProps> = ({ children }) => {
  const xOffset = useAppSelector(selectViewerOffsetX);
  const yOffset = useAppSelector(selectViewerOffsetY);

  return (
    <div
      style={{
        minHeight: "100%",
        transform: `translate(${xOffset}px, ${yOffset}px)`,
      }}
    >
      {children}
    </div>
  );
};

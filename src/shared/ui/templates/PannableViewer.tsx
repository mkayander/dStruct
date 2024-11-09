import React from "react";

import {
  selectViewerOffsetX,
  selectViewerOffsetY,
} from "#/features/treeViewer/model/editorSlice";
import { useAppSelector } from "#/store/hooks";

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

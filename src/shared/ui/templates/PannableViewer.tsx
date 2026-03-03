import React from "react";

import {
  selectViewerOffsetX,
  selectViewerOffsetY,
  selectViewerScale,
} from "#/features/treeViewer/model/editorSlice";
import { useAppSelector } from "#/store/hooks";

export type PannableViewerProps = React.PropsWithChildren;

export const PannableViewer: React.FC<PannableViewerProps> = ({ children }) => {
  const xOffset = useAppSelector(selectViewerOffsetX);
  const yOffset = useAppSelector(selectViewerOffsetY);
  const scale = useAppSelector(selectViewerScale);

  return (
    <div
      style={{
        minHeight: "100%",
        transformOrigin: "0 0",
        transform: `translate(${xOffset}px, ${yOffset}px) scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
};

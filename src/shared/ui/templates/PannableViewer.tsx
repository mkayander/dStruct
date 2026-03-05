import React from "react";

export type PannableViewerProps = React.PropsWithChildren<{
  /** Ref for the transform element; useViewerPan controls transform directly */
  transformRef: React.RefObject<HTMLDivElement | null>;
}>;

/**
 * Wrapper that applies pan/zoom transform. The transform is controlled
 * directly by useViewerPan via the ref—no store subscription.
 */
export const PannableViewer: React.FC<PannableViewerProps> = ({
  children,
  transformRef,
}) => (
  <div
    ref={transformRef}
    style={{
      minHeight: "100%",
      transformOrigin: "0 0",
      transform: "translate(0, 0) scale(1)",
    }}
  >
    {children}
  </div>
);

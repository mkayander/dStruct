import { useRef, useState } from "react";

import { useAppDispatch } from "#/store/hooks";
import { editorSlice } from "#/store/reducers/editorReducer";

export const useViewerPan = () => {
  const dispatch = useAppDispatch();
  const [panEvent, setPanEvent] = useState<React.MouseEvent | null>(null);
  const prevEventRef = useRef<React.MouseEvent | null>(null);

  const handleMouseMove = (ev: React.MouseEvent) => {
    if (!panEvent) return;

    if (prevEventRef.current) {
      dispatch(
        editorSlice.actions.panView({
          offsetX: ev.clientX - prevEventRef.current.clientX,
          offsetY: ev.clientY - prevEventRef.current.clientY,
        }),
      );
    }
    prevEventRef.current = ev;
  };

  const handlePanStart = (ev: React.MouseEvent) => {
    if (ev.target instanceof HTMLElement) {
      if (
        !(ev.target instanceof HTMLDivElement) ||
        ev.target.classList.contains("os-scrollbar-handle")
      )
        return;

      setPanEvent(ev);
      dispatch(editorSlice.actions.setIsPanning(true));
    }
  };

  const handlePanEnd = () => {
    if (!panEvent) return;

    setPanEvent(null);
    dispatch(editorSlice.actions.setIsPanning(false));
    prevEventRef.current = null;
  };

  const handlePanReset = () => {
    dispatch(editorSlice.actions.resetViewOffset());
  };

  return {
    handlePanStart,
    handlePanEnd,
    handlePanReset,
    handleMouseMove,
  };
};

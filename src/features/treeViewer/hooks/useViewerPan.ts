import { useCallback, useEffect, useRef, useState } from "react";

import {
  editorSlice,
  selectViewerScale,
} from "#/features/treeViewer/model/editorSlice";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

type TouchListLike = { length: number; 0?: Touch; 1?: Touch };

function getTouchDistance(touches: TouchListLike): number {
  if (touches.length < 2) return 0;
  const t0 = touches[0];
  const t1 = touches[1];
  if (t0 == null || t1 == null) return 0;
  const dx = t1.clientX - t0.clientX;
  const dy = t1.clientY - t0.clientY;
  return Math.hypot(dx, dy);
}

function getTouchCenter(touches: TouchListLike): {
  clientX: number;
  clientY: number;
} {
  const t0 = touches[0];
  if (touches.length < 2) {
    return {
      clientX: t0?.clientX ?? 0,
      clientY: t0?.clientY ?? 0,
    };
  }
  const t1 = touches[1];
  if (t0 == null || t1 == null) {
    return {
      clientX: t0?.clientX ?? t1?.clientX ?? 0,
      clientY: t0?.clientY ?? t1?.clientY ?? 0,
    };
  }
  return {
    clientX: (t0.clientX + t1.clientX) / 2,
    clientY: (t0.clientY + t1.clientY) / 2,
  };
}

export const useViewerPan = () => {
  const dispatch = useAppDispatch();
  const scale = useAppSelector(selectViewerScale);
  const [panEvent, setPanEvent] = useState<React.MouseEvent | null>(null);
  const prevEventRef = useRef<React.MouseEvent | null>(null);

  const pinchRef = useRef<{
    initialDistance: number;
    initialScale: number;
    center: { clientX: number; clientY: number };
    containerRect: DOMRect;
  } | null>(null);

  const touchPanRef = useRef<{
    startX: number;
    startY: number;
  } | null>(null);

  const handleMouseMove = useCallback(
    (ev: React.MouseEvent) => {
      if (!panEvent) return;

      const prev = prevEventRef.current;
      if (prev) {
        dispatch(
          editorSlice.actions.panView({
            offsetX: ev.clientX - prev.clientX,
            offsetY: ev.clientY - prev.clientY,
          }),
        );
      }
      prevEventRef.current = ev;
    },
    [dispatch, panEvent],
  );

  const handlePanStart = useCallback(
    (ev: React.MouseEvent) => {
      if (ev.target instanceof HTMLElement) {
        if (
          !(ev.target instanceof HTMLDivElement) ||
          ev.target.classList.contains("os-scrollbar-handle")
        )
          return;

        setPanEvent(ev);
        dispatch(editorSlice.actions.setIsPanning(true));
      }
    },
    [dispatch],
  );

  const handlePanEnd = useCallback(() => {
    setPanEvent(null);
    prevEventRef.current = null;
    dispatch(editorSlice.actions.setIsPanning(false));
  }, [dispatch]);

  const handlePanReset = useCallback(() => {
    dispatch(editorSlice.actions.resetViewOffset());
  }, [dispatch]);

  const handleViewReset = useCallback(() => {
    dispatch(editorSlice.actions.resetView());
  }, [dispatch]);

  const handleZoomIn = useCallback(() => {
    dispatch(editorSlice.actions.zoomIn());
  }, [dispatch]);

  const handleZoomOut = useCallback(() => {
    dispatch(editorSlice.actions.zoomOut());
  }, [dispatch]);

  const viewerRef = useRef<HTMLDivElement | null>(null);

  const handleWheel = useCallback(
    (ev: WheelEvent) => {
      const target = ev.currentTarget;
      if (!(target instanceof HTMLElement)) return;

      const rect = target.getBoundingClientRect();
      const delta = -Math.sign(ev.deltaY) * 0.15;
      const newScale = scale * (1 + delta);

      ev.preventDefault();
      dispatch(
        editorSlice.actions.zoomAtPoint({
          clientX: ev.clientX,
          clientY: ev.clientY,
          containerLeft: rect.left,
          containerTop: rect.top,
          newScale,
        }),
      );
    },
    [dispatch, scale],
  );

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleTouchStart = useCallback(
    (ev: React.TouchEvent) => {
      const target = ev.currentTarget;
      if (!(target instanceof HTMLElement)) return;

      if (ev.touches.length === 2) {
        ev.preventDefault();
        pinchRef.current = {
          initialDistance: getTouchDistance(ev.touches),
          initialScale: scale,
          center: getTouchCenter(ev.touches),
          containerRect: target.getBoundingClientRect(),
        };
      } else if (ev.touches.length === 1 && !pinchRef.current) {
        const t0 = ev.touches[0];
        if (t0) {
          touchPanRef.current = {
            startX: t0.clientX,
            startY: t0.clientY,
          };
        }
      }
    },
    [scale],
  );

  const handleTouchMove = useCallback(
    (ev: React.TouchEvent) => {
      if (ev.touches.length === 2 && pinchRef.current) {
        ev.preventDefault();
        const distance = getTouchDistance(ev.touches);
        const center = getTouchCenter(ev.touches);
        const pinch = pinchRef.current;
        if (pinch.initialDistance <= 0) return;
        const scaleFactor = distance / pinch.initialDistance;
        const newScale = pinch.initialScale * scaleFactor;

        dispatch(
          editorSlice.actions.zoomAtPoint({
            clientX: center.clientX,
            clientY: center.clientY,
            containerLeft: pinch.containerRect.left,
            containerTop: pinch.containerRect.top,
            newScale,
          }),
        );
      } else if (
        ev.touches.length === 1 &&
        touchPanRef.current &&
        !pinchRef.current
      ) {
        const t0 = ev.touches[0];
        if (!t0) return;
        const touchPan = touchPanRef.current;
        const deltaX = t0.clientX - touchPan.startX;
        const deltaY = t0.clientY - touchPan.startY;
        touchPan.startX = t0.clientX;
        touchPan.startY = t0.clientY;
        dispatch(
          editorSlice.actions.panView({
            offsetX: deltaX,
            offsetY: deltaY,
          }),
        );
      }
    },
    [dispatch],
  );

  const handleTouchEnd = useCallback((ev: React.TouchEvent) => {
    if (ev.touches.length < 2) {
      pinchRef.current = null;
    }
    if (ev.touches.length === 0) {
      touchPanRef.current = null;
    }
  }, []);

  return {
    handlePanStart,
    handlePanEnd,
    handlePanReset,
    handleViewReset,
    handleMouseMove,
    handleZoomIn,
    handleZoomOut,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    viewerRef,
  };
};

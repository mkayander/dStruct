import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { computeZoomAtPoint } from "#/features/treeViewer/lib";
import {
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_STEP,
} from "#/features/treeViewer/model/editorConstants";

type TouchListLike = { length: number; 0?: Touch; 1?: Touch };

function getTouchDistance(touches: TouchListLike): number {
  if (touches.length < 2) return 0;
  const t0 = touches[0];
  const t1 = touches[1];
  if (t0 == null || t1 == null) return 0;
  return Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
}

function getTouchCenter(touches: TouchListLike): {
  clientX: number;
  clientY: number;
} {
  const t0 = touches[0];
  if (touches.length < 2) {
    return { clientX: t0?.clientX ?? 0, clientY: t0?.clientY ?? 0 };
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

const WHEEL_SYNC_DELAY_MS = 80;

const DEFAULT_VIEW = { offsetX: 0, offsetY: 0, scale: 1 };

export type ViewerPanHandle = {
  resetView: () => void;
  resetOffset: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  isViewAtDefault: boolean;
};

export type UseViewerPanOptions = {
  ref?: React.RefObject<ViewerPanHandle | null>;
};

export const useViewerPan = (options?: UseViewerPanOptions) => {
  const handleRef = options?.ref;
  const [isViewAtDefault, setIsViewAtDefault] = useState(true);
  const [panEvent, setPanEvent] = useState<React.MouseEvent | null>(null);
  const prevEventRef = useRef<React.MouseEvent | null>(null);

  const viewRef = useRef({ ...DEFAULT_VIEW });
  const transformRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const wheelSyncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const isMountedRef = useRef(true);

  const pinchRef = useRef<{
    initialDistance: number;
    baseTransform: { offsetX: number; offsetY: number; scale: number };
    center: { clientX: number; clientY: number };
    containerRect: DOMRect;
    lastApplied: { offsetX: number; offsetY: number; scale: number };
  } | null>(null);

  const touchPanRef = useRef<{
    startX: number;
    startY: number;
    baseOffsetX: number;
    baseOffsetY: number;
    accumulatedX: number;
    accumulatedY: number;
  } | null>(null);

  const mousePanRef = useRef<{
    baseOffsetX: number;
    baseOffsetY: number;
    accumulatedX: number;
    accumulatedY: number;
  } | null>(null);

  const applyTransform = useCallback(
    (offsetX: number, offsetY: number, scale: number) => {
      viewRef.current = { offsetX, offsetY, scale };
      if (transformRef.current) {
        transformRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
      }
    },
    [],
  );

  const setView = useCallback(
    (offsetX: number, offsetY: number, scale: number) => {
      applyTransform(offsetX, offsetY, scale);
      setIsViewAtDefault(offsetX === 0 && offsetY === 0 && scale === 1);
    },
    [applyTransform],
  );

  const setCursor = useCallback((grabbing: boolean) => {
    if (viewerRef.current) {
      viewerRef.current.style.cursor = grabbing ? "grabbing" : "grab";
    }
  }, []);

  const handleMouseMove = useCallback(
    (ev: React.MouseEvent) => {
      if (!panEvent) return;

      const prev = prevEventRef.current;
      const pan = mousePanRef.current;
      if (prev && pan) {
        pan.accumulatedX += ev.clientX - prev.clientX;
        pan.accumulatedY += ev.clientY - prev.clientY;
        const { scale } = viewRef.current;
        applyTransform(
          pan.baseOffsetX + pan.accumulatedX,
          pan.baseOffsetY + pan.accumulatedY,
          scale,
        );
      }
      prevEventRef.current = ev;
    },
    [panEvent, applyTransform],
  );

  const handlePanStart = useCallback(
    (ev: React.MouseEvent) => {
      if (
        !(ev.target instanceof HTMLDivElement) ||
        ev.target.classList.contains("os-scrollbar-handle")
      )
        return;

      const { offsetX, offsetY } = viewRef.current;
      mousePanRef.current = {
        baseOffsetX: offsetX,
        baseOffsetY: offsetY,
        accumulatedX: 0,
        accumulatedY: 0,
      };
      prevEventRef.current = ev;
      setPanEvent(ev);
      setCursor(true);
    },
    [setCursor],
  );

  const handlePanEnd = useCallback(() => {
    const pan = mousePanRef.current;
    if (pan) {
      setView(
        pan.baseOffsetX + pan.accumulatedX,
        pan.baseOffsetY + pan.accumulatedY,
        viewRef.current.scale,
      );
      mousePanRef.current = null;
    }
    setPanEvent(null);
    prevEventRef.current = null;
    setCursor(false);
  }, [setView, setCursor]);

  const handlePanReset = useCallback(() => {
    const { scale } = viewRef.current;
    setView(0, 0, scale);
  }, [setView]);

  const handleViewReset = useCallback(() => {
    setView(0, 0, 1);
  }, [setView]);

  const handleZoomIn = useCallback(() => {
    const { offsetX, offsetY, scale } = viewRef.current;
    const newScale = Math.min(MAX_ZOOM, scale + ZOOM_STEP);
    setView(offsetX, offsetY, newScale);
  }, [setView]);

  const handleZoomOut = useCallback(() => {
    const { offsetX, offsetY, scale } = viewRef.current;
    const newScale = Math.max(MIN_ZOOM, scale - ZOOM_STEP);
    setView(offsetX, offsetY, newScale);
  }, [setView]);

  const handleWheel = useCallback(
    (ev: WheelEvent) => {
      const target = ev.currentTarget;
      if (!(target instanceof HTMLElement)) return;

      const rect = target.getBoundingClientRect();
      const { offsetX, offsetY, scale } = viewRef.current;
      const delta = -Math.sign(ev.deltaY) * 0.15;
      const newScale = scale * (1 + delta);

      ev.preventDefault();

      const next = computeZoomAtPoint(
        { offsetX, offsetY, scale },
        ev.clientX,
        ev.clientY,
        rect.left,
        rect.top,
        newScale,
      );
      applyTransform(next.offsetX, next.offsetY, next.scale);

      if (wheelSyncTimeoutRef.current) {
        clearTimeout(wheelSyncTimeoutRef.current);
      }
      wheelSyncTimeoutRef.current = setTimeout(() => {
        wheelSyncTimeoutRef.current = null;
        if (isMountedRef.current) {
          setView(next.offsetX, next.offsetY, next.scale);
        }
      }, WHEEL_SYNC_DELAY_MS);
    },
    [applyTransform, setView],
  );

  useEffect(() => {
    isMountedRef.current = true;
    const el = viewerRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      isMountedRef.current = false;
      if (el) {
        el.removeEventListener("wheel", handleWheel);
      }
      if (wheelSyncTimeoutRef.current) {
        clearTimeout(wheelSyncTimeoutRef.current);
        wheelSyncTimeoutRef.current = null;
      }
    };
  }, [handleWheel]);

  useEffect(() => {
    applyTransform(
      viewRef.current.offsetX,
      viewRef.current.offsetY,
      viewRef.current.scale,
    );
  }, [applyTransform]);

  const handleTouchStart = useCallback((ev: React.TouchEvent) => {
    const target = ev.currentTarget;
    if (!(target instanceof HTMLElement)) return;

    if (ev.touches.length === 2) {
      ev.preventDefault();
      touchPanRef.current = null;
      const initialDistance = getTouchDistance(ev.touches);
      if (initialDistance <= 0) return;

      const base = { ...viewRef.current };
      pinchRef.current = {
        initialDistance,
        baseTransform: base,
        center: getTouchCenter(ev.touches),
        containerRect: target.getBoundingClientRect(),
        lastApplied: base,
      };
    } else if (ev.touches.length === 1 && !pinchRef.current) {
      const t0 = ev.touches[0];
      if (t0) {
        const { offsetX, offsetY } = viewRef.current;
        touchPanRef.current = {
          startX: t0.clientX,
          startY: t0.clientY,
          baseOffsetX: offsetX,
          baseOffsetY: offsetY,
          accumulatedX: 0,
          accumulatedY: 0,
        };
      }
    }
  }, []);

  const handleTouchMove = useCallback(
    (ev: React.TouchEvent) => {
      if (ev.touches.length === 2 && pinchRef.current) {
        ev.preventDefault();
        const pinch = pinchRef.current;
        if (pinch.initialDistance <= 0) return;

        const distance = getTouchDistance(ev.touches);
        const center = getTouchCenter(ev.touches);
        const scaleFactor = distance / pinch.initialDistance;
        const newScale = pinch.baseTransform.scale * scaleFactor;

        const next = computeZoomAtPoint(
          pinch.baseTransform,
          center.clientX,
          center.clientY,
          pinch.containerRect.left,
          pinch.containerRect.top,
          newScale,
        );
        pinch.lastApplied = next;
        applyTransform(next.offsetX, next.offsetY, next.scale);
      } else if (
        ev.touches.length === 1 &&
        touchPanRef.current &&
        !pinchRef.current
      ) {
        const t0 = ev.touches[0];
        if (!t0) return;
        const pan = touchPanRef.current;
        pan.accumulatedX += t0.clientX - pan.startX;
        pan.accumulatedY += t0.clientY - pan.startY;
        pan.startX = t0.clientX;
        pan.startY = t0.clientY;
        const { scale } = viewRef.current;
        applyTransform(
          pan.baseOffsetX + pan.accumulatedX,
          pan.baseOffsetY + pan.accumulatedY,
          scale,
        );
      }
    },
    [applyTransform],
  );

  const handleTouchEnd = useCallback(
    (ev: React.TouchEvent) => {
      if (ev.touches.length < 2) {
        const pinch = pinchRef.current;
        if (pinch) {
          setView(
            pinch.lastApplied.offsetX,
            pinch.lastApplied.offsetY,
            pinch.lastApplied.scale,
          );
          touchPanRef.current = null;
        }
        pinchRef.current = null;
      }
      if (ev.touches.length === 0) {
        const pan = touchPanRef.current;
        if (pan) {
          setView(
            pan.baseOffsetX + pan.accumulatedX,
            pan.baseOffsetY + pan.accumulatedY,
            viewRef.current.scale,
          );
        }
        touchPanRef.current = null;
      }
    },
    [setView],
  );

  useImperativeHandle(
    handleRef,
    () => ({
      resetView: handleViewReset,
      resetOffset: handlePanReset,
      zoomIn: handleZoomIn,
      zoomOut: handleZoomOut,
      isViewAtDefault,
    }),
    [
      handleViewReset,
      handlePanReset,
      handleZoomIn,
      handleZoomOut,
      isViewAtDefault,
    ],
  );

  return {
    handlePanStart,
    handlePanEnd,
    handleMouseMove,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    viewerRef,
    transformRef,
    isViewAtDefault,
    getViewState: () => ({ ...viewRef.current }),
  };
};

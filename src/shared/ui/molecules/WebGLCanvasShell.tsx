"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";

import {
  attachWebGLContextRecovery,
  disposeWebGLRenderer,
} from "#/shared/lib/webglCanvasRecovery";

type WebGLCanvasShellInnerProps = CanvasProps & {
  onContextLost: () => void;
};

const WebGLCanvasShellInner: React.FC<WebGLCanvasShellInnerProps> = ({
  onContextLost,
  onCreated,
  ...canvasProps
}) => {
  const [isReady, setIsReady] = useState(false);
  const disposeRendererRef = useRef<(() => void) | undefined>(undefined);
  const detachContextRecoveryRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      detachContextRecoveryRef.current?.();
      detachContextRecoveryRef.current = undefined;
      disposeWebGLRenderer(disposeRendererRef.current);
      disposeRendererRef.current = undefined;
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <Canvas
      {...canvasProps}
      onCreated={(state) => {
        const { gl } = state;
        gl.setClearColor("#000000", 0);

        detachContextRecoveryRef.current?.();
        detachContextRecoveryRef.current = attachWebGLContextRecovery(
          gl.domElement,
          onContextLost,
        );
        disposeRendererRef.current = () => {
          gl.dispose();
        };

        onCreated?.(state);
      }}
    />
  );
};

type WebGLCanvasShellProps = CanvasProps;

/**
 * R3F canvas wrapper for decorative marketing models.
 * Defers mount one frame (avoids off-screen prefetch init), disposes on unmount,
 * and remounts when the browser reports `webglcontextlost`.
 */
export const WebGLCanvasShell: React.FC<WebGLCanvasShellProps> = (props) => {
  const [canvasKey, setCanvasKey] = useState(0);

  return (
    <WebGLCanvasShellInner
      key={canvasKey}
      {...props}
      onContextLost={() => {
        setCanvasKey((previousKey) => previousKey + 1);
      }}
    />
  );
};

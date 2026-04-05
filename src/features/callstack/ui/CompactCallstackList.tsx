import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useRef } from "react";

import { selectCallstack } from "#/features/callstack/model/callstackSlice";
import { TabContentScrollContainer } from "#/shared/ui/templates/TabContentScrollContainer";
import { useAppSelector } from "#/store/hooks";

import {
  CallstackArgumentsValue,
  CallstackNodeBadge,
} from "./CallstackFrameContent";

type CompactCallstackListProps = {
  height?: number | string;
};

const COMPACT_CALLSTACK_ROW_HEIGHT = 58;

export const CompactCallstackList: React.FC<CompactCallstackListProps> = ({
  height = 262,
}) => {
  const theme = useTheme();
  const callstack = useAppSelector(selectCallstack);
  const startTimestamp = callstack.startTimestamp ?? 0;
  const runtimeErrorMessage = callstack.error?.message ?? null;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (
      callstack.frameIndex < 0 ||
      callstack.frameIndex >= callstack.frames.length
    ) {
      return;
    }

    const activeFrame = callstack.frames[callstack.frameIndex];
    if (!activeFrame) return;

    const container = containerRef.current;
    const activeRow = rowRefs.current[activeFrame.id];

    if (!container || !activeRow) return;

    const targetScrollTop =
      activeRow.offsetTop -
      (container.clientHeight - activeRow.offsetHeight) / 2;
    const maxScrollTop = Math.max(
      0,
      container.scrollHeight - container.clientHeight,
    );
    const nextScrollTop = Math.min(Math.max(targetScrollTop, 0), maxScrollTop);

    container.scrollTo({
      top: nextScrollTop,
      behavior: "smooth",
    });
  }, [callstack.frameIndex, callstack.frames]);

  if (!callstack.isReady || callstack.frames.length === 0) {
    return (
      <TabContentScrollContainer
        ref={containerRef}
        defer
        style={{
          height,
        }}
      >
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            variant="caption"
            color={runtimeErrorMessage ? "error.main" : "text.secondary"}
            role={runtimeErrorMessage ? "alert" : undefined}
          >
            {runtimeErrorMessage
              ? `Preview runtime failed: ${runtimeErrorMessage}`
              : "Runtime actions will appear here once the preview is ready."}
          </Typography>
        </Box>
      </TabContentScrollContainer>
    );
  }

  return (
    <TabContentScrollContainer
      ref={containerRef}
      defer
      style={{
        height,
      }}
      options={{
        scrollbars: {
          autoHide: "leave",
          autoHideSuspend: false,
        },
        overflow: {
          x: "hidden",
        },
      }}
    >
      <Box sx={{ px: 1.5, py: 1.25 }}>
        <Stack spacing={0.75}>
          {callstack.frames.map((frame, index) => {
            const isActive = index === callstack.frameIndex;
            const isPast = index < callstack.frameIndex;

            return (
              <div
                key={frame.id}
                ref={(node) => {
                  rowRefs.current[frame.id] = node;
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0, 1fr) auto",
                    gap: 1,
                    alignItems: "center",
                    px: 1,
                    py: 0.75,
                    minHeight: COMPACT_CALLSTACK_ROW_HEIGHT,
                    borderRadius: 2,
                    bgcolor: isActive
                      ? alpha(theme.appDesign.accent, 0.14)
                      : isPast
                        ? alpha(theme.appDesign.accentSoft, 0.05)
                        : "transparent",
                  }}
                >
                  <Box sx={{ minWidth: 24 }}>
                    {"treeName" in frame && "nodeId" in frame ? (
                      <CallstackNodeBadge
                        treeName={frame.treeName}
                        id={frame.nodeId}
                        size={24}
                      />
                    ) : null}
                  </Box>
                  <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: isActive
                          ? theme.appDesign.accentSoft
                          : "text.secondary",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {String(index + 1).padStart(2, "0")} {frame.name}
                    </Typography>
                    <Box
                      sx={{
                        color: "text.secondary",
                        typography: "caption",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        minHeight: 18,
                      }}
                    >
                      {"args" in frame ? (
                        <CallstackArgumentsValue frame={frame} />
                      ) : (
                        "\u00A0"
                      )}
                    </Box>
                  </Stack>
                  <Typography variant="caption" color="text.secondary">
                    +{(frame.timestamp - startTimestamp).toFixed(2)} ms
                  </Typography>
                </Box>
              </div>
            );
          })}
        </Stack>
      </Box>
    </TabContentScrollContainer>
  );
};

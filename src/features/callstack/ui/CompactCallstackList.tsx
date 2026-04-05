import { alpha, Box, Stack, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useRef } from "react";

import { selectCallstack } from "#/features/callstack/model/callstackSlice";
import {
  getPlaybackStepGroups,
  getPlaybackStepIndex,
} from "#/features/treeViewer/lib";
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
  const runtimeErrorMessage = callstack.error?.message ?? null;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rowRefs = useRef<Record<string, HTMLElement | null>>({});
  const playbackStepGroups = useMemo(
    () => getPlaybackStepGroups(callstack.frames),
    [callstack.frames],
  );
  const activePlaybackStepIndex = useMemo(
    () => getPlaybackStepIndex(playbackStepGroups, callstack.frameIndex),
    [callstack.frameIndex, playbackStepGroups],
  );

  useEffect(() => {
    if (activePlaybackStepIndex < 0) {
      return;
    }

    const activeGroup = playbackStepGroups[activePlaybackStepIndex];
    if (!activeGroup) return;

    const container = containerRef.current;
    const activeRow = rowRefs.current[activeGroup.key];

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
  }, [activePlaybackStepIndex, playbackStepGroups]);

  if (!callstack.isReady || playbackStepGroups.length === 0) {
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
          {playbackStepGroups.map((group, index) => {
            const isActive = index === activePlaybackStepIndex;
            const isPast =
              activePlaybackStepIndex >= 0 &&
              group.endIndex < callstack.frameIndex;
            const frame = group.primaryFrame;
            const isSwapGroup = group.kind === "swap";

            return (
              <div
                key={group.key}
                ref={(node) => {
                  rowRefs.current[group.key] = node;
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0, 1fr)",
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
                        showTooltip={false}
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
                      {String(index + 1).padStart(2, "0")}{" "}
                      {isSwapGroup ? "swapChildren" : frame.name}
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
                      {isSwapGroup ? (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          sx={{ minWidth: 0, whiteSpace: "nowrap" }}
                        >
                          <Typography component="span" variant="inherit">
                            L:
                          </Typography>
                          <CallstackArgumentsValue
                            frame={group.primaryFrame}
                            showTooltip={false}
                          />
                          <Typography component="span" variant="inherit">
                            R:
                          </Typography>
                          <CallstackArgumentsValue
                            frame={group.partnerFrame}
                            showTooltip={false}
                          />
                        </Stack>
                      ) : "args" in frame ? (
                        <CallstackArgumentsValue
                          frame={frame}
                          showTooltip={false}
                        />
                      ) : (
                        "\u00A0"
                      )}
                    </Box>
                  </Stack>
                </Box>
              </div>
            );
          })}
        </Stack>
      </Box>
    </TabContentScrollContainer>
  );
};

import {
  alpha,
  Box,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { TableVirtuoso, type TableVirtuosoHandle } from "react-virtuoso";

import {
  selectNodeDataById,
  treeNodeSlice,
} from "#/entities/dataStructures/node/model/nodeSlice";
import {
  type CallFrame,
  selectCallstack,
} from "#/features/callstack/model/callstackSlice";
import { useI18nContext } from "#/shared/hooks";
import { useMobileLayout } from "#/shared/hooks/useMobileLayout";
import { safeStringify } from "#/shared/lib/stringifySolutionResult";
import { useAppDispatch, useAppSelector } from "#/store/hooks";

const NodeCell: React.FC<{ treeName: string; id: string }> = ({
  treeName,
  id,
}) => {
  const theme = useTheme();
  const nodeData = useAppSelector(selectNodeDataById(treeName, id));
  const dispatcher = useAppDispatch();

  if (!nodeData) return <span>{id}</span>;

  const handleMouseEnter: React.MouseEventHandler<HTMLSpanElement> = () => {
    dispatcher(
      treeNodeSlice.actions.update({
        name: treeName,
        data: {
          id: nodeData.id,
          changes: {
            isHighlighted: true,
          },
        },
      }),
    );
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLSpanElement> = () => {
    dispatcher(
      treeNodeSlice.actions.update({
        name: treeName,
        data: {
          id: nodeData.id,
          changes: {
            isHighlighted: false,
          },
        },
      }),
    );
  };

  return (
    <Tooltip
      title={`id: ${id}`}
      arrow
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        component="span"
        sx={{
          height: "32px",
          width: "32px",
          display: "inline-block",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          pt: "7px",
          pb: 1,
          background: alpha(theme.palette.primary.main, 0.1),
          borderRadius: "50%",
        }}
      >
        {nodeData.value}
      </Box>
    </Tooltip>
  );
};

const ArgumentsCell: React.FC<{ frame: CallFrame }> = ({ frame }) => {
  if (!("args" in frame)) {
    return <span>---</span>;
  }

  switch (frame.name) {
    case "setLeftChild":
    case "setRightChild":
      return frame.args.childId ? (
        <NodeCell treeName={frame.treeName} id={frame.args.childId} />
      ) : (
        <span>null</span>
      );

    default: {
      const value = safeStringify(frame.args);
      return (
        <Tooltip title={<pre>{value}</pre>} arrow>
          <Box
            sx={{
              overflow: "hidden",
              maxWidth: "70vh",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </Box>
        </Tooltip>
      );
    }
  }
};

const BOTTOM_SPACER_HEIGHT = "calc(38px + env(safe-area-inset-bottom, 0px))";

/** Sentinel for the spacer row appended on mobile so last item can scroll above nav bar */
const SPACER_SENTINEL = Symbol("callstack-bottom-spacer");

type TableRowData = CallFrame | typeof SPACER_SENTINEL;

function isSpacerRow(frame: TableRowData): frame is typeof SPACER_SENTINEL {
  return frame === SPACER_SENTINEL;
}

export const CallstackTable: React.FC = () => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const isMobile = useMobileLayout();
  const callstack = useAppSelector(selectCallstack);
  const virtuosoRef = useRef<TableVirtuosoHandle>(null);

  const startTimestamp = callstack.startTimestamp ?? 0;

  // Append spacer row on mobile so last frame can scroll above bottom nav bar
  const tableData = React.useMemo<TableRowData[]>(
    () =>
      isMobile ? [...callstack.frames, SPACER_SENTINEL] : callstack.frames,
    [callstack.frames, isMobile],
  );

  const getBackgroundColor = (index: number) => {
    if (index >= callstack.frames.length) return "transparent";
    let backgroundColor = "transparent";
    if (index === callstack.frameIndex) {
      backgroundColor = alpha(theme.palette.primary.light, 0.1);
    } else if (index < callstack.frameIndex) {
      backgroundColor = alpha(theme.palette.primary.light, 0.032);
    }

    return backgroundColor;
  };

  useEffect(() => {
    const { frameIndex, frames } = callstack;
    if (frameIndex >= 0 && frameIndex < frames.length && virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: frameIndex,
        align: "center",
        behavior: "smooth",
      });
    }
  }, [callstack, callstack.frameIndex, callstack.frames.length]);

  if (!callstack.isReady) {
    return (
      <Box p={2} textAlign="center">
        Here you will see a table of runtime actions once the code is executed!
      </Box>
    );
  }

  return (
    <Stack
      spacing={2}
      sx={{
        height: "100%",
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        overflow: "hidden",
        table: {
          width: "100%",
          borderCollapse: "collapse",
        },
        tr: {
          position: "relative",
        },
      }}
    >
      <TableVirtuoso
        ref={virtuosoRef}
        style={{ height: "100%", width: "100%" }}
        data={tableData}
        fixedHeaderContent={() => (
          <TableRow sx={{ backdropFilter: "blur(10px)" }}>
            <TableCell component="th">{LL.NODE()}</TableCell>
            <TableCell component="th" align="right">
              {LL.ACTION()}
            </TableCell>
            <TableCell component="th" align="right">
              {LL.TIMESTAMP()}
            </TableCell>
            <TableCell component="th" align="left">
              {LL.ARGUMENTS()}
            </TableCell>
          </TableRow>
        )}
        itemContent={(index, frame) => {
          if (isSpacerRow(frame)) {
            return (
              <TableCell colSpan={4} sx={{ padding: 0, border: "none" }}>
                <Box sx={{ height: BOTTOM_SPACER_HEIGHT }} aria-hidden />
              </TableCell>
            );
          }
          return (
            <>
              <TableCell
                component="th"
                scope="row"
                sx={{
                  "&::before": {
                    content: "''",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: getBackgroundColor(index),
                    pointerEvents: "none",
                  },
                }}
              >
                {"treeName" in frame && "nodeId" in frame && (
                  <NodeCell treeName={frame.treeName} id={frame.nodeId} />
                )}
              </TableCell>
              <TableCell align="right">{frame.name}</TableCell>
              <TableCell align="right">
                {`+${(frame.timestamp - startTimestamp).toFixed(2)} ms`}
              </TableCell>
              <TableCell align="left">
                <ArgumentsCell frame={frame} />
              </TableCell>
            </>
          );
        }}
      />
    </Stack>
  );
};

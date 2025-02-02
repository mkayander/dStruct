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
import { TableVirtuoso } from "react-virtuoso";

import {
  selectNodeDataById,
  treeNodeSlice,
} from "#/entities/dataStructures/node/model/nodeSlice";
import {
  type CallFrame,
  selectCallstack,
} from "#/features/callstack/model/callstackSlice";
import { useI18nContext } from "#/shared/hooks";
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

export const CallstackTable: React.FC = () => {
  const { LL } = useI18nContext();
  const theme = useTheme();
  const callstack = useAppSelector(selectCallstack);
  const containerRef = useRef<HTMLTableSectionElement>(null);

  const startTimestamp = callstack.startTimestamp ?? 0;

  const getBackgroundColor = (index: number) => {
    let backgroundColor = "transparent";
    if (index === callstack.frameIndex) {
      backgroundColor = alpha(theme.palette.primary.light, 0.1);
    } else if (index < callstack.frameIndex) {
      backgroundColor = alpha(theme.palette.primary.light, 0.032);
    }

    return backgroundColor;
  };

  useEffect(() => {
    if (containerRef.current) {
      const rowElement = containerRef.current.children[
        callstack.frameIndex
      ] as HTMLTableRowElement;
      if (rowElement) {
        rowElement.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [callstack.frameIndex]);

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
        style={{ height: "100%", width: "100%" }}
        data={callstack.frames}
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
        itemContent={(index, frame) => (
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
        )}
      />
    </Stack>
  );
};

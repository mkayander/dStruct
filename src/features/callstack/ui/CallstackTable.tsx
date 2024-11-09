import {
  alpha,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef } from "react";

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

    default:
      return <span>{safeStringify(frame.args)}</span>;
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

  return (
    <Stack spacing={2}>
      <TableContainer>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{LL.NODE()}</TableCell>
              <TableCell align="right">{LL.ACTION()}</TableCell>
              <TableCell align="right">{LL.TIMESTAMP()}</TableCell>
              <TableCell align="left">{LL.ARGUMENTS()}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody ref={containerRef}>
            {callstack.frames.map((frame, index) => (
              <TableRow
                key={frame.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  transition: "background-color .2s",
                  backgroundColor: getBackgroundColor(index),
                }}
              >
                <TableCell component="th" scope="row">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

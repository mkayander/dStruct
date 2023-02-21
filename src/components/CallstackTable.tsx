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
import React from "react";

import { useAppDispatch, useAppSelector } from "#/store/hooks";
import {
  type CallFrame,
  selectCallstack,
} from "#/store/reducers/callstackReducer";
import {
  selectNodeDataById,
  treeNodeSlice,
} from "#/store/reducers/treeNodeReducer";

const NodeCell: React.FC<{ id: string }> = ({ id }) => {
  const theme = useTheme();
  const nodeData = useAppSelector(selectNodeDataById(id));
  const dispatcher = useAppDispatch();

  if (!nodeData) return <span>{id}</span>;

  const handleMouseEnter: React.MouseEventHandler<HTMLSpanElement> = () => {
    dispatcher(
      treeNodeSlice.actions.update({
        id: nodeData.id,
        changes: {
          isHighlighted: true,
        },
      })
    );
  };

  const handleMouseLeave: React.MouseEventHandler<HTMLSpanElement> = () => {
    dispatcher(
      treeNodeSlice.actions.update({
        id: nodeData.id,
        changes: {
          isHighlighted: false,
        },
      })
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
  switch (frame.name) {
    case "setLeftChild":
    case "setRightChild":
      return frame.args[0] ? (
        <NodeCell id={frame.args[0]} />
      ) : (
        <span>null</span>
      );

    case "error":
      return <span>---</span>;

    default:
      return <span>{frame.args.toString()}</span>;
  }
};

export const CallstackTable: React.FC = () => {
  const callstack = useAppSelector(selectCallstack);

  const startTimestamp = callstack.startTimestamp ?? 0;

  return (
    <Stack spacing={2}>
      <TableContainer>
        <Table sx={{ minWidth: 200 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Node</TableCell>
              <TableCell align="right">Action</TableCell>
              <TableCell align="right">Timestamp</TableCell>
              <TableCell align="right">Arguments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {callstack.frames.map((frame) => (
              <TableRow
                key={frame.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <NodeCell id={frame.nodeId} />
                </TableCell>
                <TableCell align="right">{frame.name}</TableCell>
                <TableCell align="right">
                  {`+${(frame.timestamp - startTimestamp).toFixed(2)} ms`}
                </TableCell>
                <TableCell align="right">
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

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";

import { useAppSelector } from "#/store/hooks";
import { selectCallstack } from "#/store/reducers/callstackReducer";

export const CallstackTable: React.FC = () => {
  const callstack = useAppSelector(selectCallstack);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Node ID</TableCell>
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
                {frame.name}
              </TableCell>
              <TableCell align="right">{frame.nodeId}</TableCell>
              <TableCell align="right">{frame.timestamp}</TableCell>
              <TableCell align="right">
                {frame.name !== "error" ? frame.args.toString() : "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

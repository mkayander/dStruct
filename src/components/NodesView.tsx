import { Box } from "@mui/material";
import React from "react";

import { BinaryNode } from "#/components/BinaryNode";
import { useAppSelector } from "#/store/hooks";
import { selectAllNodeData } from "#/store/reducers/treeNodeReducer";

export const NodesView: React.FC = () => {
  const nodes = useAppSelector(selectAllNodeData);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {nodes.map((node) => (
        <BinaryNode key={node.id} {...node} />
      ))}
    </Box>
  );
};

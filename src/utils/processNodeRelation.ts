import { alpha } from "@mui/material";
import type { RelationType } from "react-archer/lib/types";

import type { TreeNodeData } from "#/entities/dataStructures/node/model/nodeSlice";

const relationProps = {
  targetAnchor: "middle",
  sourceAnchor: "middle",
} as const;

export const processNodeRelation = (
  relations: RelationType[],
  nodeColor: string,
  color?: string | null,
  data?: TreeNodeData | null,
) => {
  if (!data) return;

  const linkColor =
    data?.color && color === data.color ? alpha(nodeColor, 0.4) : undefined;

  if (data.id && relations[0]?.targetId !== data.id) {
    relations.push({
      ...relationProps,
      targetId: data.id,
      style: { strokeColor: linkColor },
    });
  }
};

import {
  Draggable,
  type DraggableProvided,
  type DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Stack } from "@mui/material";
import React from "react";

type DraggableItemProps = {
  id: string;
  index: number;
  isDragDisabled?: boolean;
  children: (
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
  ) => React.ReactNode;
};

export const DraggableItem: React.FC<DraggableItemProps> = ({
  id,
  index,
  isDragDisabled,
  children,
}) => {
  return (
    <Draggable
      key={id}
      draggableId={id}
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Stack
          ref={provided.innerRef}
          {...provided.draggableProps}
          sx={{
            opacity: snapshot.isDragging ? 0.5 : 1,
            transform: snapshot.isDragging ? "scale(1.02)" : "none",
            transition: snapshot.isDragging
              ? "opacity 0.2s, transform 0.2s"
              : "none",
          }}
        >
          {children(provided, snapshot)}
        </Stack>
      )}
    </Draggable>
  );
};

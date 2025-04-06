import {
  DragDropContext,
  Droppable,
  type OnDragEndResponder,
} from "@hello-pangea/dnd";
import { Stack } from "@mui/material";
import React from "react";

type DraggableArgsListProps = {
  onDragEnd: OnDragEndResponder;
  children: React.ReactNode;
  renderAddButton?: () => React.ReactNode;
};

export const DraggableArgsList: React.FC<DraggableArgsListProps> = ({
  onDragEnd,
  children,
  renderAddButton,
}) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="args-list">
        {(provided) => (
          <Stack
            {...provided.droppableProps}
            ref={provided.innerRef}
            mt={1}
            spacing={1}
          >
            {children}
            {provided.placeholder}
            {renderAddButton?.()}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  );
};

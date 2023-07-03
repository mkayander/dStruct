import { Add } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  Stack,
  type StackProps,
} from "@mui/material";
import React from "react";
import {
  DragDropContext,
  type DroppableProvided,
  type DroppableStateSnapshot,
  type OnDragEndResponder,
} from "react-beautiful-dnd";

import { SelectBarChipSkeleton } from "#/components/SelectBar/SelectBarChip";
import { StrictModeDroppable } from "#/components/SelectBar/StrictModeDroppable";

type DraggableSelectBarListProps = Omit<
  StackProps,
  "children" | "onDragEnd"
> & {
  isLoading?: boolean;
  isEmpty?: boolean;
  droppableId: string;
  onItemDragEnd: OnDragEndResponder;
  isEditable?: boolean;
  handleAddItem?: () => void;
  addItemTitle?: string;
  children(
    provided: DroppableProvided,
    snapshot: DroppableStateSnapshot
  ): React.ReactNode | undefined;
};

export const DraggableSelectBarList: React.FC<DraggableSelectBarListProps> = ({
  isLoading,
  isEmpty,
  droppableId,
  onItemDragEnd,
  isEditable,
  addItemTitle,
  handleAddItem,
  children,
  ...restProps
}) => {
  return (
    <DragDropContext onDragEnd={onItemDragEnd}>
      <StrictModeDroppable droppableId={droppableId} direction="horizontal">
        {(provided, droppableSnapshot) => (
          <Stack
            {...provided.droppableProps}
            ref={provided.innerRef}
            flexWrap="wrap"
            direction="row"
            gap={1}
            {...restProps}
          >
            {isEmpty && (
              <>
                <SelectBarChipSkeleton width={112} />
                <SelectBarChipSkeleton width={42} />
                <SelectBarChipSkeleton />
                <SelectBarChipSkeleton width={24} />
              </>
            )}

            {children(provided, droppableSnapshot)}
            {provided.placeholder}

            {isEditable && (
              <IconButton
                title={addItemTitle}
                size="small"
                onClick={handleAddItem}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size="1.3rem" />
                ) : (
                  <Add fontSize="small" />
                )}
              </IconButton>
            )}
          </Stack>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  );
};

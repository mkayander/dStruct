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

import { SelectBarChipSkeleton } from "#/features/selectBar/ui/SelectBarChip";
import { StrictModeDroppable } from "#/features/selectBar/ui/StrictModeDroppable";

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
    snapshot: DroppableStateSnapshot,
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
      <StrictModeDroppable
        droppableId={droppableId}
        direction="horizontal"
        isDropDisabled={!isEditable}
        isCombineEnabled={false}
        ignoreContainerClipping
      >
        {(provided, droppableSnapshot) => (
          <Stack
            {...provided.droppableProps}
            ref={provided.innerRef}
            flexWrap="wrap"
            alignItems="center"
            direction="row"
            gap={1}
            {...restProps}
          >
            {isEmpty && (
              <Stack direction="row" gap={1}>
                <SelectBarChipSkeleton width={112} />
                <SelectBarChipSkeleton width={42} />
                <SelectBarChipSkeleton />
                <SelectBarChipSkeleton width={24} />
              </Stack>
            )}

            {children(provided, droppableSnapshot)}
            {provided.placeholder}

            {isEditable && (
              <IconButton
                title={addItemTitle}
                size="small"
                onClick={handleAddItem}
                disabled={isLoading}
                sx={{
                  mt: 0.15,
                }}
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

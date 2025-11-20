import { Draggable, type DroppableStateSnapshot } from "@hello-pangea/dnd";
import Edit from "@mui/icons-material/Edit";
import {
  Box,
  Chip,
  type ChipProps,
  IconButton,
  Skeleton,
  type SkeletonProps,
  useTheme,
} from "@mui/material";
import React from "react";

type SelectBarChipProps = ChipProps & {
  isCurrent: boolean;
  isEditable: boolean;
  isDragging?: boolean;
  onEditClick?: React.MouseEventHandler<HTMLButtonElement>;
  editLabel?: string;
};

export const SelectBarChip = React.forwardRef<
  HTMLDivElement,
  SelectBarChipProps
>(function SelectBarChip(
  {
    isCurrent,
    isEditable,
    isDragging,
    onEditClick,
    editLabel,
    sx,
    ...restProps
  },
  ref,
) {
  const theme = useTheme();

  return (
    <Box
      ref={ref}
      position="relative"
      sx={{
        "&:hover": {
          ".EditIcon": {
            opacity: 1,
            pointerEvents: "all",
          },
        },
      }}
    >
      <Chip
        {...restProps}
        variant="filled"
        size="small"
        sx={{
          border: `1px solid ${
            isCurrent ? "transparent" : theme.palette.divider
          }`,
          background: isCurrent ? "primary.main" : "transparent",
          "&:hover": {
            background: isCurrent ? "primary.main" : "rgba(245,245,245,0.1)",
          },
          cursor: "pointer !important",
          boxShadow: isDragging ? 4 : 0,
          backdropFilter: isDragging ? "blur(6px)" : "",
          ...sx,
        }}
      />
      {isEditable && onEditClick && (
        <IconButton
          size="small"
          title={editLabel ?? "Edit"}
          className="EditIcon"
          sx={{
            transition: "opacity 0.3s",
            position: "absolute",
            top: "-10px",
            right: "-2px",
            opacity: 0,
            pointerEvents: "none",
            "&:hover": {
              "& svg": {
                opacity: 1,
              },
            },
          }}
          onClick={onEditClick}
        >
          <Edit
            sx={{
              transition: "opacity 0.3s",
              opacity: 0.3,
              fontSize: "1rem",
            }}
          />
        </IconButton>
      )}
    </Box>
  );
});

type DraggableSelectBarChipProps = SelectBarChipProps & {
  id: string;
  index: number;
  droppableSnapshot: DroppableStateSnapshot;
};

export const DraggableSelectBarChip: React.FC<DraggableSelectBarChipProps> = ({
  id,
  index,
  droppableSnapshot,
  isEditable,
  ...restProps
}) => {
  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!isEditable}>
      {(provided, snapshot) => (
        <SelectBarChip
          ref={provided.innerRef}
          isEditable={droppableSnapshot.isDraggingOver ? false : isEditable}
          isDragging={snapshot.isDragging}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          {...restProps}
        />
      )}
    </Draggable>
  );
};

export const SelectBarChipSkeleton: React.FC<SkeletonProps> = (props) => {
  return (
    <Skeleton
      width={64}
      height={24}
      variant="rectangular"
      sx={{
        borderRadius: 4,
        mt: "2px",
      }}
      {...props}
    />
  );
};

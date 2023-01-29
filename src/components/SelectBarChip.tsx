import { Cancel } from "@mui/icons-material";
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
};

export const SelectBarChip: React.FC<SelectBarChipProps> = ({
  isCurrent,
  isEditable,
  onDelete,
  ...restProps
}) => {
  const theme = useTheme();

  return (
    <Box
      position="relative"
      sx={{
        "&:hover": {
          ".DeleteIcon": {
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
          transition: "all 0.3s",
          border: `1px solid ${
            isCurrent ? "transparent" : theme.palette.divider
          }`,
          background: isCurrent ? "primary.main" : "transparent",
          "&:hover": {
            background: isCurrent ? "primary.main" : "rgba(245,245,245,0.1)",
          },
        }}
      />
      {isEditable && (
        <IconButton
          size="small"
          title="Delete solution"
          className="DeleteIcon"
          sx={{
            transition: "opacity 0.3s",
            position: "absolute",
            top: "-10px",
            right: "-10px",
            opacity: 0,
            pointerEvents: "none",
            "&:hover": {
              "& svg": {
                opacity: 1,
              },
            },
          }}
          onClick={onDelete}
        >
          <Cancel
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

import { Edit } from "@mui/icons-material";
import {
  Box,
  Chip,
  type ChipProps,
  IconButton,
  Skeleton,
  type SkeletonProps,
  type Theme,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";

type SelectBarChipProps = ChipProps & {
  isCurrent: boolean;
  isEditable: boolean;
  onEditClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const SelectBarChip: React.FC<SelectBarChipProps> = ({
  isCurrent,
  isEditable,
  onEditClick,
  ...restProps
}) => {
  const theme = useTheme();

  const isMobile = useMediaQuery<Theme>((theme) =>
    theme.breakpoints.down("sm")
  );

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
      {isEditable && onEditClick && (
        <IconButton
          size="small"
          title="Delete solution"
          className="DeleteIcon"
          sx={{
            transition: "opacity 0.3s",
            position: "absolute",
            top: "-10px",
            right: "-10px",
            opacity: isMobile && isCurrent ? 1 : 0,
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

import {
  Box,
  Divider,
  LinearProgress,
  Paper,
  type SvgIcon,
  type SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import cn from "classnames";
import React from "react";

import styles from "./DataSection.module.scss";

interface DataSectionProps extends React.PropsWithChildren {
  className?: string;
  contentClassName?: string;
  title: string;
  caption?: string | React.ReactNode;
  Icon?: typeof SvgIcon;
  isLoading?: boolean;
  sx?: SxProps;
}

export const DataSection: React.FC<DataSectionProps> = ({
  className,
  contentClassName,
  children,
  title,
  caption,
  Icon,
  isLoading,
}) => {
  const theme = useTheme();

  return (
    <Paper
      className={cn(styles.root, className)}
      elevation={2}
      sx={{
        p: 4,
        borderRadius: theme.shape.borderRadius,
      }}
    >
      <Box
        marginBottom={1}
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h5" color={theme.palette.primary.light}>
            {title}
          </Typography>
          {typeof caption === "string" ? (
            <Typography variant="subtitle2">{caption}</Typography>
          ) : (
            caption
          )}
        </Box>
        {Icon && <Icon color="primary" fontSize={"large"} />}
      </Box>
      <Divider />
      <Box className={contentClassName} marginTop={2}>
        {isLoading ? <LinearProgress variant="indeterminate" /> : children}
      </Box>
    </Paper>
  );
};

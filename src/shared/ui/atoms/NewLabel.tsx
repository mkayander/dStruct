import { Tooltip, Typography } from "@mui/material";
import React from "react";

import { useI18nContext } from "#/shared/hooks";

type NewLabelProps = {
  createdAt: string;
};

export const NewLabel: React.FC<NewLabelProps> = ({ createdAt }) => {
  const { LL } = useI18nContext();
  const date = typeof createdAt === "string" ? new Date(createdAt) : createdAt;

  return (
    <Tooltip title={`Created at ${date.toLocaleString()}`} arrow>
      <Typography
        display="inline-block"
        fontSize={12}
        px={0.5}
        pt={0.1}
        variant="caption"
        height="1.2rem"
        sx={{
          opacity: 0.9,
          color: "white",
          backgroundColor: "success.main",
          borderRadius: 2,
          boxShadow: 4,
        }}
      >
        {LL.NEW()}
      </Typography>
    </Tooltip>
  );
};

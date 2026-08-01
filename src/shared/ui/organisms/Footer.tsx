import { Box, Container, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

import { useI18nContext } from "#/shared/hooks";

export const Footer: React.FC = () => {
  const { LL } = useI18nContext();

  return (
    <Container component="footer">
      <Box
        sx={{
          mt: 4,
          mb: 2,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="caption">© Max Kayander, 2026.</Typography>
        <MuiLink
          component={Link}
          href="/privacy"
          variant="caption"
          underline="hover"
          color="text.secondary"
        >
          {LL.PRIVACY_POLICY()}
        </MuiLink>
      </Box>
    </Container>
  );
};

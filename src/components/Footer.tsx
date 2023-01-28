import { Box, Container, Typography } from "@mui/material";
import React from "react";

export const Footer: React.FC = () => {
  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="caption">© Max Kayander, 2023.</Typography>
      </Box>
    </Container>
  );
};

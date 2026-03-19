import { Box, styled } from "@mui/material";

export const TabListWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexFlow: "row nowrap",
  justifyContent: "space-between",
  width: "100%",
  boxShadow: theme.shadows[3],
  // Let the tab strip span the row so the scroller isn’t narrower than the wrapper (avoids a seam / stray edge next to sibling controls).
  "& .MuiTabs-root": {
    flex: "1 1 0%",
    minWidth: 0,
  },
  ".MuiTab-root": {
    color: "white",
    textTransform: "none",
    "&.Mui-selected": {
      color: theme.palette.text.primary,
    },
  },
}));

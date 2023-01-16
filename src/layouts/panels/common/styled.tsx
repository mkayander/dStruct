import { TabPanel } from '@mui/lab';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TabListWrapper = styled(Box)(({ theme }) => ({
  boxShadow: theme.shadows[3],
  button: {
    color: 'white',
    textTransform: 'none',
    '&.Mui-selected': {
      color: theme.palette.text.primary,
    },
  },
}));

export const StyledTabPanel = styled(TabPanel)(({ theme }) => ({
  padding: theme.spacing(2),
}));

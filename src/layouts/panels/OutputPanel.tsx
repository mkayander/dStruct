import { TabContext, TabList } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React, { useState } from 'react';

import { PanelWrapper } from '#/layouts/panels/common/PanelWrapper';
import { StyledTabPanel, TabListWrapper } from '#/layouts/panels/common/styled';

export const OutputPanel: React.FC = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <PanelWrapper>
      <TabContext value={value}>
        <TabListWrapper>
          <TabList onChange={handleChange} aria-label="panel tabs">
            <Tab label="Output" value="1" />
          </TabList>
        </TabListWrapper>
        <Box
          sx={{
            p: 1,
            mt: 1,
          }}
        >
          <StyledTabPanel value="1">Output goes here</StyledTabPanel>
        </Box>
      </TabContext>
    </PanelWrapper>
  );
};

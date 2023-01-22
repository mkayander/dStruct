import { TabContext, TabList } from '@mui/lab';
import { Tab } from '@mui/material';
import React, { useState } from 'react';

import { CodeRunner } from '#/components';
import { PanelWrapper } from '#/layouts/panels/common/PanelWrapper';
import { StyledTabPanel, TabListWrapper } from '#/layouts/panels/common/styled';

export const CodePanel: React.FC = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <PanelWrapper>
      <TabContext value={value}>
        <TabListWrapper>
          <TabList onChange={handleChange} aria-label="panel tabs">
            <Tab label="Code Runner" value="1" />
          </TabList>
        </TabListWrapper>
        <StyledTabPanel value="1">
          <CodeRunner />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};

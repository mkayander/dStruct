import { TabContext, TabList } from '@mui/lab';
import { Tab } from '@mui/material';
import React, { useState } from 'react';

import { CodeRunner, SolutionSelectBar } from '#/components';
import { PanelWrapper } from '#/layouts/panels/common/PanelWrapper';
import { StyledTabPanel, TabListWrapper } from '#/layouts/panels/common/styled';
import { trpc } from '#/utils';

import { useAppSelector } from '#/store/hooks';
import { selectCurrentProjectId } from '#/store/reducers/projectReducer';

export const CodePanel: React.FC = () => {
  const [value, setValue] = useState('1');

  const selectedProjectId = useAppSelector(selectCurrentProjectId);

  const selectedProject = trpc.project.getById.useQuery(
    selectedProjectId || '',
    {
      enabled: Boolean(selectedProjectId),
    }
  );

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
          <SolutionSelectBar selectedProject={selectedProject} />
          <CodeRunner />
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};

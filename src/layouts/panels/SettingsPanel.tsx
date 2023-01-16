import { Refresh } from '@mui/icons-material';
import { TabContext, TabList } from '@mui/lab';
import {
  Box,
  CircularProgress,
  IconButton,
  Tab,
  TextField,
} from '@mui/material';
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useDebounce } from '#/hooks';
import type { BinaryTreeInput } from '#/hooks/useBinaryTree';
import { PanelWrapper } from '#/layouts/panels/common/PanelWrapper';
import { StyledTabPanel, TabListWrapper } from '#/layouts/panels/common/styled';

type SettingsPanelProps = {
  setParsedInput: Dispatch<SetStateAction<BinaryTreeInput | undefined>>;
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  setParsedInput,
}) => {
  const [value, setValue] = useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [rawInput, setRawInput] = useState<string>('[1,2,3,null,5]');
  const [inputError, setInputError] = useState<string | null>(null);
  const { value: input, isPending } = useDebounce(rawInput, 500);

  const parsedInput = useMemo<BinaryTreeInput | undefined>(() => {
    if (input === '') {
      setInputError(null);
      return undefined;
    }

    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        setInputError(null);
        return parsed;
      } else {
        setInputError(`Input must be an array, but got ${typeof parsed}`);
        return undefined;
      }
    } catch (e: any) {
      setInputError(e.message);
      return undefined;
    }
  }, [input]);

  useEffect(() => {
    setParsedInput(parsedInput);
  }, [parsedInput, setParsedInput]);

  return (
    <PanelWrapper>
      <TabContext value={value}>
        <TabListWrapper>
          <TabList onChange={handleChange} aria-label="panel tabs">
            <Tab label="Settings" value="1" />
          </TabList>
        </TabListWrapper>

        <StyledTabPanel value="1">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'start',
              mt: 1,
              gap: 2,
              'button.btn-refresh': { mt: 1 },
            }}
          >
            <TextField
              label="Input array"
              placeholder="e.g.: [1,2,3,null,5]"
              value={rawInput}
              onChange={(ev) => setRawInput(ev.target.value)}
              error={!!inputError}
              helperText={inputError || 'Must be a JSON array of numbers'}
              fullWidth
            />
            <IconButton
              className="btn-refresh"
              onClick={() => setRawInput('[1,2,3,null,5]')}
              title="Reset input to default"
              disabled={isPending}
            >
              <Refresh />
            </IconButton>
            {isPending && <CircularProgress />}
          </Box>
        </StyledTabPanel>
      </TabContext>
    </PanelWrapper>
  );
};

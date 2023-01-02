import { Box, useTheme } from '@mui/material';
import React from 'react';

import type { BinaryTreeNode } from '#/hooks/useBinaryTree';

type BinaryNodeProps = BinaryTreeNode;

export const BinaryNode: React.FC<BinaryNodeProps> = ({
  value,
  left,
  right,
}: BinaryNodeProps) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        width: 'fit-content',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          p: 1,
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          // background: theme.palette.action.hover,
          background: theme.palette.primary.main,
          border: `1px solid ${theme.palette.primary.light}`,
        }}
      >
        {value}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'row nowrap',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {left && <BinaryNode {...left} />}
        {right && <BinaryNode {...right} />}
      </Box>
    </Box>
  );
};
